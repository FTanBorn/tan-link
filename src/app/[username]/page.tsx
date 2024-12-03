// src/app/[username]/page.tsx
'use client'
import { useState, useEffect, use } from 'react'
import { Box, Container, Avatar, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  GitHub,
  YouTube,
  WhatsApp,
  Telegram,
  Language,
  Mail,
  Store,
  Code
} from '@mui/icons-material'

const linkStyles = {
  instagram: { color: '#E1306C', bgColor: '#FCE4EC' },
  github: { color: '#333333', bgColor: '#F5F5F5' },
  youtube: { color: '#FF0000', bgColor: '#FFEBEE' },
  whatsapp: { color: '#25D366', bgColor: '#E8F5E9' },
  twitter: { color: '#1DA1F2', bgColor: '#E3F2FD' },
  facebook: { color: '#1877F2', bgColor: '#E3F2FD' },
  website: { color: '#9C27B0', bgColor: '#F3E5F5' },
  linkedin: { color: '#0077B5', bgColor: '#E3F2FD' },
  store: { color: '#FF9800', bgColor: '#FFF3E0' },
  telegram: { color: '#0088cc', bgColor: '#E3F2FD' },
  email: { color: '#EA4335', bgColor: '#FFEBEE' },
  portfolio: { color: '#607D8B', bgColor: '#ECEFF1' }
}

const getIcon = (type: string) => {
  const icons = {
    instagram: <Instagram />,
    github: <GitHub />,
    youtube: <YouTube />,
    whatsapp: <WhatsApp />,
    twitter: <Twitter />,
    facebook: <Facebook />,
    website: <Language />,
    linkedin: <LinkedIn />,
    store: <Store />,
    telegram: <Telegram />,
    email: <Mail />,
    portfolio: <Code />
  }
  return icons[type as keyof typeof icons] || <Language />
}

interface UserData {
  username: string
  displayName: string
  photoURL?: string
  bio?: string
  theme?: {
    backgroundColor: string
    cardBackground: string
    textColor: string
    buttonStyle: {
      type: string
      style: {
        borderRadius?: string
        background?: string
        border?: string
        backdropFilter?: string
        boxShadow?: string
      }
    }
    backgroundStyle: {
      type: string
      value: string
      overlay?: string
      blur?: number
    }
  }
}

interface Link {
  id: string
  type: string
  title: string
  url: string
  order: number
}

interface PageProps {
  params: Promise<{ username: string }>
}

const defaultTheme = {
  backgroundColor: '#f0f2f5',
  cardBackground: '#ffffff',
  textColor: '#000000',
  buttonStyle: {
    type: 'solid',
    style: {
      borderRadius: '8px',
      background: 'primary.main'
    }
  },
  backgroundStyle: {
    type: 'solid',
    value: '#f0f2f5',
    overlay: undefined,
    blur: undefined
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = use(params)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [links, setLinks] = useState<Link[]>([])

  const theme = userData?.theme || defaultTheme

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
            type: doc.data().type,
            title: doc.data().title,
            url: doc.data().url,
            order: doc.data().order || 0
          }))
          .sort((a, b) => a.order - b.order)

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
          bgcolor: theme.backgroundColor
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

  const getBackgroundStyles = () => {
    if (!theme.backgroundStyle) return { bgcolor: theme.backgroundColor }

    switch (theme.backgroundStyle.type) {
      case 'gradient':
        return { background: theme.backgroundStyle.value }
      case 'glass':
        return {
          bgcolor: 'transparent',
          backdropFilter: `blur(${theme.backgroundStyle.blur || 10}px)`,
          background: theme.backgroundStyle.value
        }
      case 'image':
        return {
          backgroundImage: `url(${theme.backgroundStyle.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.backgroundStyle.overlay
          }
        }
      default:
        return { bgcolor: theme.backgroundStyle.value || theme.backgroundColor }
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        ...getBackgroundStyles(),
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
            borderRadius: theme.buttonStyle?.style?.borderRadius || '16px',
            bgcolor: theme.cardBackground,
            color: theme.textColor,
            ...theme.buttonStyle?.style
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

          <Typography variant='h5' gutterBottom fontWeight='bold' sx={{ color: theme.textColor }}>
            {userData?.displayName}
          </Typography>

          {userData?.bio && (
            <Typography
              sx={{
                mb: 4,
                color: theme.textColor,
                opacity: 0.7
              }}
              align='center'
            >
              {userData.bio}
            </Typography>
          )}

          <Box sx={{ width: '100%' }}>
            {links.map(link => {
              const style = linkStyles[link.type as keyof typeof linkStyles] || linkStyles.website

              return (
                <Button
                  key={link.id}
                  variant='contained'
                  fullWidth
                  startIcon={getIcon(link.type)}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  sx={{
                    mb: 2,
                    ...theme.buttonStyle?.style,
                    bgcolor: style.bgColor,
                    color: style.color,
                    '&:hover': {
                      bgcolor: style.color,
                      color: '#fff'
                    }
                  }}
                >
                  {link.title}
                </Button>
              )
            })}
          </Box>

          <Typography
            variant='body2'
            sx={{
              mt: 4,
              color: theme.textColor,
              opacity: 0.5
            }}
          >
            Powered by TanLink
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
