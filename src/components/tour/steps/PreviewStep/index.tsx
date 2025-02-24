'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import { ContentCopy, Dashboard, Launch as LaunchIcon, Celebration as CelebrationIcon } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useTour } from '@/context/TourContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useRouter } from 'next/navigation'

export default function PreviewStep() {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, userData, refreshUserData } = useAuth()
  const { prevStep, markStepCompleted } = useTour()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return

      // Önce userData'ya bakıyoruz - AuthContext'ten gelen veri
      if (userData?.username) {
        setUsername(userData.username)
        return
      }

      // Eğer userData'da username yoksa Firestore'dan çekiyoruz
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const fetchedUsername = userDoc.data().username
          setUsername(fetchedUsername)

          // Tarayıcı storage'a kaydedelim (opsiyonel)
          sessionStorage.setItem('username', fetchedUsername)
        }
      } catch (error) {
        console.error('Error fetching username:', error)
      }
    }

    fetchUsername()

    // Tarayıcı storage'dan daha önce kaydedilmiş bir username var mı diye bakalım
    const storedUsername = sessionStorage.getItem('username')
    if (storedUsername && !username) {
      setUsername(storedUsername)
    }
  }, [user, userData])

  const profileUrl = username ? `${username}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`tanlink.me/${profileUrl}`)
      setMessage({ type: 'success', text: 'Link copied to clipboard!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to copy link' })
      console.log(error)
    }
  }

  const handleFinish = () => {
    markStepCompleted('preview')
    // Kullanıcı adını session storage'a kaydet
    if (username) {
      sessionStorage.setItem('username', username)
    }
    setNavigating(true)
    router.push(`/${profileUrl}`)
  }

  const goToDashboard = async () => {
    setNavigating(true)

    try {
      // AuthContext'teki refreshUserData fonksiyonunu çağır
      await refreshUserData()

      // Verilerin tamamen yüklenmesi için kısa bir gecikme
      setTimeout(() => {
        router.push('/dashboard/stats')
      }, 300)
    } catch (error) {
      console.error('Error refreshing data before navigation:', error)
      router.push('/dashboard/stats')
    }
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Paper
        elevation={isMobile ? 0 : 0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box
          sx={{
            mb: 6,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <CelebrationIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant='h5' fontWeight='bold'>
            Your Profile is Ready!
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Share your profile link with your audience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' gutterBottom fontWeight='medium'>
                Your Profile Link
              </Typography>
              <TextField
                fullWidth
                variant='outlined'
                size='medium'
                value={`tanlink.me/${profileUrl}`}
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: 'background.default' },
                  endAdornment: (
                    <Tooltip title='Copy Link' arrow>
                      <IconButton
                        onClick={handleCopyLink}
                        sx={{
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  )
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='outlined'
                onClick={prevStep}
                size={isMobile ? 'large' : 'medium'}
                disabled={navigating}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='contained'
                onClick={handleFinish}
                startIcon={navigating ? <CircularProgress size={20} color='inherit' /> : <LaunchIcon />}
                size={isMobile ? 'large' : 'medium'}
                disabled={navigating}
              >
                {navigating ? 'Loading...' : 'View Profile'}
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={goToDashboard}
                startIcon={navigating ? <CircularProgress size={20} color='inherit' /> : <Dashboard />}
                size={isMobile ? 'large' : 'medium'}
                disabled={navigating}
              >
                {navigating ? 'Loading...' : 'Go to Dashboard'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={message !== null}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage(null)} severity={message?.type} elevation={6} variant='filled'>
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  )
}
