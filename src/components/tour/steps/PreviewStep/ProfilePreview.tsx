'use client'
import { useState, useEffect } from 'react'
import { Box, Paper, Avatar, Typography, Button, CircularProgress } from '@mui/material'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import { platformIcons } from '../LinksStep/constants'

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
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
    buttonStyle?: {
      type: string
      style: {
        borderRadius?: string
        background?: string
        border?: string
        backdropFilter?: string
        boxShadow?: string
      }
    }
    backgroundStyle?: {
      type: string
      value: string
      blur?: number
    }
  }
}

export default function ProfilePreview() {
  const { user } = useAuth()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        }

        const linksRef = collection(db, `users/${user.uid}/links`)
        const linksSnapshot = await getDocs(linksRef)
        const linksData = linksSnapshot.docs
          .map(doc => ({
            id: doc.id,
            platform: doc.data().type as keyof typeof platformIcons,
            title: doc.data().title,
            url: doc.data().url,
            order: doc.data().order || 0
          }))
          .sort((a, b) => a.order - b.order)

        setLinks(linksData)
      } catch (err) {
        console.error('Error loading profile data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  const theme = userData?.theme || {
    backgroundColor: '#f0f2f5',
    cardBackground: '#ffffff',
    textColor: '#000000'
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
      case 'pattern':
        return {
          background: theme.backgroundStyle.value,
          backgroundSize: 'cover'
        }
      default:
        return { bgcolor: theme.backgroundStyle.value || theme.backgroundColor }
    }
  }

  return (
    <Paper
      elevation={8}
      sx={{
        overflow: 'hidden',
        borderRadius: 4,
        ...getBackgroundStyles()
      }}
    >
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: theme.cardBackground,
          color: theme.textColor
        }}
      >
        <Avatar
          src={user?.photoURL || undefined}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: '4px solid',
            borderColor: 'primary.main'
          }}
        >
          {user?.displayName?.[0]?.toUpperCase()}
        </Avatar>

        <Typography variant='h5' gutterBottom fontWeight='bold'>
          {user?.displayName}
        </Typography>

        {userData?.bio && (
          <Typography color='text.secondary' align='center' sx={{ mb: 4 }}>
            {userData.bio}
          </Typography>
        )}

        <Box sx={{ width: '100%' }}>
          {links.map(link => {
            const platformInfo = platformIcons[link.platform]

            return (
              <Button
                key={link.id}
                variant='contained'
                fullWidth
                startIcon={platformInfo.icon}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                sx={{
                  mb: 2,
                  bgcolor: platformInfo.bgColor,
                  color: platformInfo.color,
                  '&:hover': {
                    bgcolor: platformInfo.color,
                    color: '#fff'
                  },
                  justifyContent: 'flex-start',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  ...theme.buttonStyle?.style
                }}
              >
                {link.title || link.platform}
              </Button>
            )
          })}

          {links.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography color='text.secondary'>No links added yet</Typography>
            </Box>
          )}
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
      </Box>
    </Paper>
  )
}
