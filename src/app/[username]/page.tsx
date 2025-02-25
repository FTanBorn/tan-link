import type { Metadata } from 'next'
import { getDoc, doc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

import { ThemePreset } from '@/types/theme'
import ProfileComponent from './ProfileComponent'

// Props tipi
type Props = {
  params: {
    username: string
  }
}

// Kullanıcı verisi tipi
interface UserData {
  username: string
  displayName: string
  photoURL?: string
  bio?: string
  theme?: ThemePreset | null
}

// Link tipi
interface Link {
  id: string
  platform: any
  title: string
  url: string
  order: number
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
export default async function ProfilePage({ params }: Props) {
  const { username } = params

  try {
    // Kullanıcı verilerini sunucu tarafında çekelim
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))

    if (!usernameDoc.exists()) {
      return <div>Profile not found</div>
    }

    const uid = usernameDoc.data().uid
    const userDoc = await getDoc(doc(db, 'users', uid))

    if (!userDoc.exists()) {
      return <div>User not found</div>
    }

    const userData = userDoc.data() as UserData

    // Kullanıcının bağlantılarını çekelim
    const linksRef = collection(db, `users/${uid}/links`)
    const linksSnapshot = await getDocs(linksRef)

    const links = linksSnapshot.docs
      .map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
            order: doc.data().order || 0
          } as Link)
      )
      .sort((a, b) => a.order - b.order)

    // İstemci tarafı bileşenine verileri gönder
    return <ProfileComponent userData={userData} links={links} username={username} userId={uid} />
  } catch (error) {
    console.error('Error loading profile:', error)
    return <div>Error loading profile. Please try again later.</div>
  }
}
