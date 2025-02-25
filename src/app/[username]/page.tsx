import type { Metadata, ResolvingMetadata } from 'next'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import ClientProfilePage from './client-page'

// Params tipini doğru şekilde tanımlayalım
type Params = {
  params: {
    username: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Metadata fonksiyonu ekleyelim
export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const { username } = params

  try {
    // Metadata için bazı temel bilgileri çekmeyi deneyebiliriz
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
    // Hata durumunda basit bir metadata döndür
    return {
      title: `${username} | TanLink`,
      description: `Connect with ${username} through their TanLink profile`
    }
  }
}

// Ana sayfa fonksiyonu
export default function ProfilePage({ params }: Params) {
  return <ClientProfilePage params={params} />
}
