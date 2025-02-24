'use client'
import { useState, useEffect, useRef } from 'react'
import { NextSeo } from 'next-seo'
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
  Snackbar,
  Fade,
  Dialog,
  DialogContent,
  Link
} from '@mui/material'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import {
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { platformIcons } from '@/components/tour/steps/LinksStep/constants'
import { ThemePreset } from '@/types/theme'
import { analyticsService } from '@/services/analytics'
import { QRCodeCanvas } from 'qrcode.react'

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
  params: {
    username: string
  }
}

const downloadQRCode = (qrCodeRef: React.RefObject<HTMLDivElement>, username: string) => {
  if (!qrCodeRef.current) return

  const canvas = qrCodeRef.current.querySelector('canvas')
  if (!canvas) return

  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${username}-qrcode.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const QRCodeModal = ({
  open,
  onClose,
  url,
  username
}: {
  open: boolean
  onClose: () => void
  url: string
  username: string
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0 }}>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>

        <Typography variant='h6' sx={{ mt: 1, fontWeight: 500 }}>
          Scan QR Code
        </Typography>

        <Box ref={qrCodeRef} sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
          <QRCodeCanvas value={url} size={200} level='H' includeMargin={true} />
        </Box>

        <Button
          variant='contained'
          startIcon={<DownloadIcon />}
          onClick={() => downloadQRCode(qrCodeRef, username)}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Download QR Code
        </Button>
      </DialogContent>
    </Dialog>
  )
}

const defaultStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    transition: 'all 0.5s ease'
  },
  paper: {
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    padding: { xs: 2, sm: 4 },
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
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
      backgroundColor: 'background.paper',
      transform: 'translateY(-2px)'
    }
  }
}

export default function ProfilePage({ params }: PageProps) {
  const { username } = params
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [copySnackbar, setCopySnackbar] = useState(false)
  const [shareSnackbar, setShareSnackbar] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

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

        setTimeout(() => {
          if (isSubscribed) setPageLoaded(true)
        }, 100)
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
    const button = e.currentTarget as HTMLElement
    button.style.transform = 'scale(0.98)'
    setTimeout(() => {
      button.style.transform = 'scale(1)'
    }, 100)

    if (!userId) return

    try {
      analyticsService
        .recordLinkClick(userId, username, link.id, link.platform, link.url)
        .catch(error => console.error('Error recording click:', error))
    } catch (error) {
      console.error('Error initiating click recording:', error)
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

  const handleWhatsAppShare = () => {
    const text = `Check out ${userData?.displayName}'s profile: `
    const url = encodeURIComponent(window.location.href)
    window.open(`https://wa.me/?text=${text}${url}`, '_blank')
  }

  const handleEmailShare = () => {
    const subject = `Check out ${userData?.displayName}'s profile`
    const body = `I thought you might like this profile: ${window.location.href}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const getButtonStyle = (platformInfo: (typeof platformIcons)[keyof typeof platformIcons]) => {
    if (!theme?.buttonStyle) {
      return {
        ...defaultStyles.button,
        bgcolor: platformInfo.bgColor,
        color: platformInfo.color,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: platformInfo.color,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 0
        },
        '& > *': {
          zIndex: 1,
          position: 'relative'
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          color: '#fff',
          '&:before': {
            opacity: 1
          }
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

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const defaultDescription = `Connect with ${userData?.displayName || 'this user'} through their TanLink profile`
  const metaImage = userData?.photoURL || '/default-avatar.png'

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
    <>
      <NextSeo
        title={`${userData?.displayName || 'Profile'} | TanLink`}
        description={userData?.bio || defaultDescription}
        canonical={pageUrl}
        openGraph={{
          type: 'profile',
          profile: {
            username: userData?.username
          },
          url: pageUrl,
          title: `${userData?.displayName || 'Profile'} | TanLink`,
          description: userData?.bio || defaultDescription,
          images: [
            {
              url: metaImage,
              width: 200,
              height: 200,
              alt: `${userData?.displayName}'s profile photo`
            }
          ]
        }}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@tanlink',
          site: '@tanlink'
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'social links, bio profile, link management, digital business card'
          }
        ]}
      />

      <Box
        sx={{
          ...defaultStyles.container,
          background: theme?.backgroundStyle.value || defaultStyles.container.backgroundColor,
          backdropFilter: theme?.backgroundStyle.blur ? `blur(${theme.backgroundStyle.blur}px)` : undefined,
          transition: 'background-color 0.3s ease'
        }}
      >
        <Container maxWidth='sm' sx={{ py: 4 }}>
          <Fade in={pageLoaded} timeout={800}>
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1,
                  zIndex: 2
                }}
              >
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

                <Tooltip title='QR Code' placement='left'>
                  <IconButton onClick={() => setQrDialogOpen(true)} size='small' sx={defaultStyles.shareButton}>
                    <QrCodeIcon fontSize='small' />
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
                  bgcolor: theme?.cardBackground || defaultStyles.paper.backgroundColor,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)'
                  }
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
                {links.map((link, index) => {
                  const platformInfo = platformIcons[link.platform]
                  return (
                    <Fade key={link.id} in timeout={300 + index * 100}>
                      <Button
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
                    </Fade>
                  )
                })}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 3,
                  mb: 2
                }}
              >
                <IconButton
                  onClick={handleWhatsAppShare}
                  sx={{
                    bgcolor: '#25D366',
                    color: '#fff',
                    '&:hover': { bgcolor: '#128C7E' }
                  }}
                >
                  <WhatsAppIcon />
                </IconButton>

                <IconButton
                  onClick={handleEmailShare}
                  sx={{
                    bgcolor: '#D44638',
                    color: '#fff',
                    '&:hover': { bgcolor: '#B23121' }
                  }}
                >
                  <EmailIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography
                  variant='caption'
                  sx={{
                    color: theme?.textColor || 'text.secondary',
                    opacity: 0.5,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    fontWeight: 300,
                    fontSize: '0.65rem'
                  }}
                >
                  Powered by TanLink
                </Typography>

                <Link
                  href='/r'
                  underline='hover'
                  sx={{
                    color: theme?.buttonStyle?.type === 'neon' ? theme.buttonStyle.style.color : 'primary.main',
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Create your own profile
                </Link>
              </Box>
            </Paper>
          </Fade>
        </Container>

        <QRCodeModal
          open={qrDialogOpen}
          onClose={() => setQrDialogOpen(false)}
          url={window.location.href}
          username={username}
        />

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
    </>
  )
}
