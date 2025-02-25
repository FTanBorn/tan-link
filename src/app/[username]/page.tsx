import type { Metadata } from 'next'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import ClientProfilePage from './client-page'

// Next.js 15 için doğru props tipini tanımlama
type Props = {
  params: {
    username: string
  }
}

// Metadata fonksiyonu
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params

  try {
    // Metadata için temel bilgileri çekme
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
    let displayName = username
    let description = `Connect with ${username} through their TanLink profile`
    let imageUrl = '/default-avatar.png'

    if (usernameDoc.exists()) {
      const uid = usernameDoc.data().uid
      const userDoc = await getDoc(doc(db, 'users', uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()
        displayName = userData.displayName || username
        description = userData.bio || description
        imageUrl = userData.photoURL || imageUrl
      }
    }

    return {
      title: `${displayName} | TanLink`,
      description: description,
      openGraph: {
        title: `${displayName} | TanLink`,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 200,
            height: 200,
            alt: `${displayName}'s profile photo`
          }
        ],
        type: 'profile'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${displayName} | TanLink`,
        description: description,
        images: [imageUrl]
      }
    }
  } catch (error) {
    console.error('Metadata error:', error)
    // Hata durumunda basit metadata döndürme
    return {
      title: `${username} | TanLink`,
      description: `Connect with ${username} through their TanLink profile`
    }
  }
}

// Ana sayfa fonksiyonu
export default function ProfilePage({ params }: Props) {
  return <ClientProfilePage params={params} />
}
