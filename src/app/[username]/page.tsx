'use client'
import { useState, useEffect, use } from 'react'
import { Box, Container, Avatar, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { platformIcons } from '@/components/tour/steps/LinksStep/constants'
import { ThemePreset } from '@/types/theme'

interface UserData {
  username: string
  displayName: string
  photoURL?: string
  bio?: string
  theme?: ThemePreset | null
}

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
}

interface FirestoreLink extends Link {
  createdAt: Date
  updatedAt: Date
}

interface PageProps {
  params: Promise<{ username: string }>
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = use(params)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [links, setLinks] = useState<Link[]>([])

  const theme = userData?.theme || null

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
        if (!usernameDoc.exists()) {
          setError('Profile not found')
          setLoading(false)
          return
        }

        const userId = usernameDoc.data().uid
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (!userDoc.exists()) {
          setError('User not found')
          setLoading(false)
          return
        }

        setUserData(userDoc.data() as UserData)

        const linksRef = collection(db, `users/${userId}/links`)
        const linksSnapshot = await getDocs(linksRef)
        const linksData = linksSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<FirestoreLink, 'id'>)
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0)) as Link[]

        setLinks(linksData)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Error loading profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme?.backgroundStyle.value || '#f0f2f5'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth='sm' sx={{ mt: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Container>
    )
  }

  const getButtonStyle = (link: Link) => {
    const platformInfo = platformIcons[link.platform]

    if (!theme?.buttonStyle || theme.buttonStyle.type === 'default') {
      return {
        mb: 2,
        bgcolor: platformInfo.bgColor,
        color: platformInfo.color,
        '&:hover': {
          bgcolor: platformInfo.color,
          color: '#fff',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease'
        }
      }
    }

    return {
      mb: 2,
      ...theme.buttonStyle.style
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme?.backgroundStyle.value || '#f0f2f5',
        backdropFilter: theme?.backgroundStyle.blur ? `blur(${theme.backgroundStyle.blur}px)` : undefined,
        position: 'relative'
      }}
    >
      <Container maxWidth='sm' sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: theme?.cardBackground || '#ffffff',
            color: theme?.textColor || '#000000',
            borderRadius: theme?.buttonStyle?.style.borderRadius || '16px'
          }}
        >
          <Avatar
            src={userData?.photoURL}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid',
              borderColor: 'primary.main'
            }}
          >
            {userData?.displayName?.[0]}
          </Avatar>

          <Typography variant='h5' gutterBottom fontWeight='bold'>
            {userData?.displayName}
          </Typography>

          {userData?.bio && (
            <Typography color='text.secondary' align='center' sx={{ mb: 4, opacity: 0.7 }}>
              {userData.bio}
            </Typography>
          )}

          <Box sx={{ width: '100%' }}>
            {links.map(link => {
              const platformInfo = platformIcons[link.platform]
              return (
                <Button
                  key={link.id}
                  fullWidth
                  variant='contained'
                  startIcon={platformInfo.icon}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  sx={getButtonStyle(link)}
                >
                  {link.title || platformInfo.placeholder}
                </Button>
              )
            })}
          </Box>
          <Box
            sx={{
              width: '100%',
              mt: 4,
              pt: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
              textAlign: 'center'
            }}
          >
            <Typography
              variant='body2'
              sx={{
                color: theme?.textColor || 'text.secondary',
                opacity: 0.5,
                mb: 2
              }}
            >
              Powered by TanLink
            </Typography>

            <Button
              href='/r'
              variant='text'
              sx={{
                color: '#2196F3',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.08)'
                }
              }}
            >
              Want to create your own TanLink profile?
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
