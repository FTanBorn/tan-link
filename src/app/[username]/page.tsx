// src/app/[username]/page.tsx
'use client'
import { useState, useEffect, use } from 'react'
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Snackbar
} from '@mui/material'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { ContentCopy as ContentCopyIcon, Share as ShareIcon } from '@mui/icons-material'
import { platformIcons } from '@/components/tour/steps/LinksStep/constants'
import { ThemePreset } from '@/types/theme'
import { analyticsService } from '@/services/analytics'

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

interface PageProps {
  params: Promise<{ username: string }>
}

const defaultStyles = {
  button: {
    mb: 2,
    py: 1.5,
    borderRadius: 2,
    justifyContent: 'center',
    textTransform: 'none',
    transition: 'all 0.2s ease'
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = use(params)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [copySnackbar, setCopySnackbar] = useState(false)
  const [shareSnackbar, setShareSnackbar] = useState(false)

  const theme = userData?.theme || null

  // Profile data and analytics recording
  useEffect(() => {
    let isSubscribed = true

    const fetchProfile = async () => {
      try {
        const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
        if (!usernameDoc.exists()) {
          setError('Profile not found')
          setLoading(false)
          return
        }

        const uid = usernameDoc.data().uid
        if (!isSubscribed) return
        setUserId(uid)

        const userDoc = await getDoc(doc(db, 'users', uid))
        if (!userDoc.exists()) {
          setError('User not found')
          setLoading(false)
          return
        }

        if (!isSubscribed) return
        setUserData(userDoc.data() as UserData)

        const linksRef = collection(db, `users/${uid}/links`)
        const linksSnapshot = await getDocs(linksRef)

        if (!isSubscribed) return
        const linksData = linksSnapshot.docs
          .map(
            doc =>
              ({
                id: doc.id,
                ...doc.data(),
                order: doc.data().order || 0
              } as Link)
          )
          .sort((a, b) => a.order - b.order)

        setLinks(linksData)

        // Record page view only after successful data fetch
        if (isSubscribed) {
          try {
            await analyticsService.recordPageView(uid, username)
          } catch (error) {
            console.error('Error recording page view:', error)
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err)
        if (isSubscribed) {
          setError('Error loading profile')
        }
      } finally {
        if (isSubscribed) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isSubscribed = false
    }
  }, [username])

  const handleLinkClick = async (e: React.MouseEvent, link: Link) => {
    e.preventDefault()

    if (!userId) {
      window.open(link.url, '_blank')
      return
    }

    try {
      await analyticsService.recordLinkClick(userId, username, link.id, link.platform, link.url)

      window.open(link.url, '_blank')
    } catch (error) {
      console.error('Error recording click:', error)
      window.open(link.url, '_blank')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopySnackbar(true)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${userData?.displayName}'s Profile`,
          url: window.location.href
        })
        setShareSnackbar(true)
      } else {
        handleCopyLink()
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const getButtonStyle = (platformInfo: (typeof platformIcons)[keyof typeof platformIcons]) => {
    if (!theme?.buttonStyle) {
      return {
        ...defaultStyles.button,
        bgcolor: platformInfo.bgColor,
        color: platformInfo.color,
        '&:hover': {
          bgcolor: platformInfo.color,
          color: '#fff',
          transform: 'translateY(-2px)'
        }
      }
    }

    return {
      ...theme.buttonStyle.style,
      mb: defaultStyles.button.mb,
      transition: defaultStyles.button.transition,
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }
  }

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
          elevation={theme?.cardBackground === 'transparent' ? 0 : 3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: theme?.cardBackground || '#ffffff',
            color: theme?.textColor || '#000000',
            borderRadius: theme?.buttonStyle?.style.borderRadius || '16px',
            backdropFilter:
              theme?.backgroundStyle.type === 'glass' ? `blur(${theme.backgroundStyle.blur}px)` : undefined,
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
            <Tooltip title='Copy Link'>
              <IconButton onClick={handleCopyLink} size='small'>
                <ContentCopyIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Share Profile'>
              <IconButton onClick={handleShare} size='small'>
                <ShareIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>

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
                  variant={theme?.buttonStyle?.type === 'outline' ? 'outlined' : 'contained'}
                  startIcon={platformInfo.icon}
                  onClick={e => handleLinkClick(e, link)}
                  sx={getButtonStyle(platformInfo)}
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

      <Snackbar
        open={copySnackbar}
        autoHideDuration={2000}
        onClose={() => setCopySnackbar(false)}
        message='Link copied to clipboard'
      />
      <Snackbar
        open={shareSnackbar}
        autoHideDuration={2000}
        onClose={() => setShareSnackbar(false)}
        message='Thanks for sharing!'
      />
    </Box>
  )
}
