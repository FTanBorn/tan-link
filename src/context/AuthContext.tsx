// src/context/AuthContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

interface UserData {
  username: string | null
  displayName: string | null
  email: string | null
  photoURL: string | null
  photoPublicId?: string | null
  bio?: string | null
  theme?: any
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  refreshUserData: () => Promise<void>
  updateUserPhoto: (photoURL: string | null, photoPublicId: string | null) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
  updateUserPhoto: async () => {}
})

// Tarayıcı storage'dan verileri yükleme yardımcı fonksiyonu
const loadUserDataFromStorage = (): UserData | null => {
  if (typeof window === 'undefined') return null

  try {
    const storedData = localStorage.getItem('userData')
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    console.error('Error loading userData from localStorage:', error)
  }
  return null
}

// Tarayıcı storage'a verileri kaydetme yardımcı fonksiyonu
const saveUserDataToStorage = (userData: UserData) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('userData', JSON.stringify(userData))
  } catch (error) {
    console.error('Error saving userData to localStorage:', error)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(loadUserDataFromStorage())
  const [loading, setLoading] = useState(true)

  // Firestore'dan kullanıcı verilerini getirme fonksiyonu
  const fetchUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        const userData: UserData = {
          username: data.username || null,
          displayName: data.displayName || null,
          email: data.email || null,
          photoURL: data.photoURL || null,
          photoPublicId: data.photoPublicId || null,
          bio: data.bio || null,
          theme: data.theme || null
        }
        return userData
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
    return null
  }

  // Kullanıcı verilerini yenileme fonksiyonu
  const refreshUserData = async () => {
    if (!user) return

    try {
      const freshData = await fetchUserData(user.uid)
      if (freshData) {
        setUserData(freshData)
        saveUserDataToStorage(freshData)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Kullanıcı fotoğrafını güncelleme fonksiyonu
  const updateUserPhoto = async (photoURL: string | null, photoPublicId: string | null) => {
    if (!user || !userData) return

    try {
      // Local state güncelleme
      const updatedUserData = {
        ...userData,
        photoURL,
        photoPublicId
      }

      // Firestore güncelleme
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL,
        photoPublicId
      })

      setUserData(updatedUserData)
      saveUserDataToStorage(updatedUserData)
    } catch (error) {
      console.error('Error updating user photo:', error)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)

      if (user) {
        try {
          const freshData = await fetchUserData(user.uid)
          if (freshData) {
            setUserData(freshData)
            saveUserDataToStorage(freshData)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        setUserData(null)
        localStorage.removeItem('userData')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        refreshUserData,
        updateUserPhoto
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
