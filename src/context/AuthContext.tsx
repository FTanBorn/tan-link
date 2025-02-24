// src/context/AuthContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '@/config/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

interface UserData {
  username: string | null
  displayName: string | null
  email: string | null
  photoURL: string | null
  bio?: string | null
  theme?: any
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)

      if (user) {
        try {
          // Önce user dokümanını çek
          const userDoc = await getDoc(doc(db, 'users', user.uid))

          if (userDoc.exists()) {
            const data = userDoc.data()

            // Ardından username koleksiyonundan kullanıcının username'ini çek
            const usernameRef = doc(db, 'usernames', data.username?.toLowerCase())
            const usernameDoc = await getDoc(usernameRef)

            if (usernameDoc.exists()) {
              // Username dokümanı varsa ve bu kullanıcıya aitse
              if (usernameDoc.data().uid === user.uid) {
                setUserData({
                  username: data.username || null,
                  displayName: data.displayName || user.displayName || null,
                  email: data.email || user.email || null,
                  photoURL: data.photoURL || user.photoURL || null,
                  bio: data.bio || null,
                  theme: data.theme || null
                })
              } else {
                console.error('Username belongs to another user')
                setUserData(null)
              }
            } else {
              console.error('Username document not found')
              setUserData(null)
            }
          } else {
            setUserData(null)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          setUserData(null)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, userData, loading }}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
