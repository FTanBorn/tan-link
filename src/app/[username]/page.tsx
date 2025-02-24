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
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  paper: {
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    padding: { xs: 2, sm: 4 }
  },
  avatar: {
    width: 120,
    height: 120,
    border: '4px solid',
    borderColor: 'primary.main',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    marginBottom: 3,
    transition: 'all 0.3s ease'
  },
  button: {
    marginBottom: 2,
    padding: '12px 20px',
    borderRadius: '12px',
    justifyContent: 'center',
    textTransform: 'none',
    transition: 'all 0.2s ease',
    fontWeight: 500
  },
  shareButton: {
    backgroundColor: 'background.paper',
    boxShadow: 1,
    '&:hover': {
      backgroundColor: 'background.paper'
    }
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
        console.log(userDoc)

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

  const handleLinkClick = (e: React.MouseEvent, link: Link) => {
    if (!userId) {
      return true
    }

    try {
      analyticsService
        .recordLinkClick(userId, username, link.id, link.platform, link.url)
        .catch(error => console.error('Error recording click:', error))
    } catch (error) {
      console.error('Error initiating click recording:', error)
    }

    return true
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
      ...defaultStyles.button,
      '&:hover': {
        transform: 'translateY(-2px)',
        ...(theme.buttonStyle.type === 'glass' && {
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        })
      }
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          ...defaultStyles.container,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme?.backgroundStyle.value || defaultStyles.container.backgroundColor
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
        ...defaultStyles.container,
        background: theme?.backgroundStyle.value || defaultStyles.container.backgroundColor,
        backdropFilter: theme?.backgroundStyle.blur ? `blur(${theme.backgroundStyle.blur}px)` : undefined,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Container maxWidth='sm' sx={{ py: 4 }}>
        <Paper
          elevation={theme?.buttonStyle.type === 'glass' ? 0 : 3}
          sx={{
            ...defaultStyles.paper,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: theme?.cardBackground || defaultStyles.paper.backgroundColor,
            color: theme?.textColor || 'inherit',
            borderRadius: theme?.buttonStyle?.style.borderRadius || defaultStyles.paper.borderRadius,
            backdropFilter:
              theme?.backgroundStyle.type === 'glass' ? `blur(${theme.backgroundStyle.blur || 10}px)` : undefined,
            border: theme?.buttonStyle.type === 'glass' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1, zIndex: 2 }}>
            <Tooltip title='Copy Link' placement='left'>
              <IconButton onClick={handleCopyLink} size='small' sx={defaultStyles.shareButton}>
                <ContentCopyIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Share Profile' placement='left'>
              <IconButton onClick={handleShare} size='small' sx={defaultStyles.shareButton}>
                <ShareIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>

          <Avatar
            src={userData?.photoURL}
            sx={{
              ...defaultStyles.avatar,
              borderColor: theme?.buttonStyle.type === 'neon' ? theme.buttonStyle.style.color : 'primary.main',
              boxShadow:
                theme?.buttonStyle.type === 'neon'
                  ? `0 0 20px ${theme.buttonStyle.style.color}`
                  : defaultStyles.avatar.boxShadow,
              bgcolor: theme?.cardBackground || defaultStyles.paper.backgroundColor
            }}
          >
            {userData?.displayName?.[0]}
          </Avatar>

          <Typography
            variant='h5'
            gutterBottom
            fontWeight='bold'
            sx={{
              background: theme?.buttonStyle.type === 'gradient' ? theme.buttonStyle.style.background : 'none',
              WebkitBackgroundClip: theme?.buttonStyle.type === 'gradient' ? 'text' : 'none',
              WebkitTextFillColor: theme?.buttonStyle.type === 'gradient' ? 'transparent' : 'inherit',
              color: theme?.textColor
            }}
          >
            {userData?.displayName}
          </Typography>

          {userData?.bio && (
            <Typography
              align='center'
              sx={{
                mb: 4,
                opacity: 0.8,
                color: theme?.textColor ? `${theme.textColor}CC` : 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                px: 2
              }}
            >
              {userData.bio}
            </Typography>
          )}

          <Box sx={{ width: '100%', px: { xs: 0, sm: 2 } }}>
            {links.map(link => {
              const platformInfo = platformIcons[link.platform]
              return (
                <Button
                  key={link.id}
                  component='a'
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
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
              borderColor: theme?.buttonStyle.type === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'divider',
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
