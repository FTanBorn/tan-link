import { Metadata } from 'next'
import { doc, collection, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import ProfileComponent from './ProfileComponent'
import { ThemePreset } from '@/types/theme'
import Loading from '../loading'

interface UserData {
  username: string
  displayName: string
  photoURL?: string
  bio?: string
  theme?: ThemePreset | null
}

interface Link {
  id: string
  platform: any
  title: string
  url: string
  order: number
}

async function getDocWithRetry(documentRef: any, maxRetries = 3) {
  let retries = maxRetries
  let lastError = null

  while (retries > 0) {
    try {
      const docSnapshot = await getDoc(documentRef)
      return docSnapshot
    } catch (error) {
      lastError = error
      retries--
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  throw lastError || new Error(`Document fetch failed after ${maxRetries} retries`)
}

async function getDocsWithRetry(query: any, maxRetries = 3) {
  let retries = maxRetries
  let lastError = null

  while (retries > 0) {
    try {
      const querySnapshot = await getDocs(query)
      return querySnapshot
    } catch (error) {
      lastError = error
      retries--
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  throw lastError || new Error(`Query failed after ${maxRetries} retries`)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const username = slug
  const profileUrl = `https://tanlink.me/${username}`

  try {
    const usernameDoc = await getDocWithRetry(doc(db, 'usernames', username.toLowerCase()))
    const defaultMetadata = {
      title: `${username} | TanLink`,
      description: `Connect with ${username} through TanLink profile`,
      images: ['/default-avatar.png']
    }

    if (!usernameDoc.exists()) return defaultMetadata

    const uid = (usernameDoc.data() as { uid: string })?.uid // Optional chaining ile güvenli erişim
    if (!uid) return defaultMetadata

    const userDoc = await getDocWithRetry(doc(db, 'users', uid))
    if (!userDoc.exists()) return defaultMetadata

    const userData = userDoc.data() as UserData // Tip belirtme
    const metaImage = userData.photoURL || '/default-avatar.png'

    return {
      title: `${userData.displayName || username} | TanLink`,
      description: userData.bio || defaultMetadata.description,
      openGraph: {
        title: `${userData.displayName || username} | TanLink`,
        description: userData.bio || defaultMetadata.description,
        type: 'profile',
        url: profileUrl,
        images: [
          {
            url: metaImage,
            width: 200,
            height: 200,
            alt: `${userData.displayName}'s profile photo`
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${userData.displayName || username} | TanLink`,
        description: userData.bio || defaultMetadata.description,
        images: [metaImage]
      },
      alternates: {
        canonical: profileUrl
      }
    }
  } catch (error) {
    console.error('Metadata generation error:', error)
    return {
      title: `${username} | TanLink`,
      description: `Connect with ${username} through TanLink profile`
    }
  }
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const username = slug

  try {
    const usernameDoc = await getDocWithRetry(doc(db, 'usernames', username.toLowerCase()))
    if (!usernameDoc.exists()) notFound()

    const uid = (usernameDoc.data() as { uid: string })?.uid // Optional chaining ile güvenli erişim
    if (!uid) notFound()

    const userDoc = await getDocWithRetry(doc(db, 'users', uid))
    if (!userDoc.exists()) notFound()

    const userData = userDoc.data() as UserData // Tip belirtme

    const linksRef = collection(db, `users/${uid}/links`)
    const linksSnapshot = await getDocsWithRetry(linksRef)

    const links = linksSnapshot.docs
      .map(doc => {
        const data = doc.data() as Omit<Link, 'id'> // id'yi çıkarmadan kullanın
        return {
          id: doc.id, // Yeni id'yi belirtin
          ...data,
          order: data.order || 0
        }
      })
      .sort((a, b) => a.order - b.order)

    return (
      <Suspense fallback={<Loading />}>
        <ProfileComponent userData={userData} links={links} username={username} userId={uid} />
      </Suspense>
    )
  } catch (error) {
    console.error('Profile page error:', error)
    notFound()
  }
}
