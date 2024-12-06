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
  useMediaQuery
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
  const { user } = useAuth()
  const { prevStep, markStepCompleted } = useTour()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUsername(userDoc.data().username)
        }
      } catch (error) {
        console.error('Error fetching username:', error)
      }
    }

    fetchUsername()
  }, [user])

  const profileUrl = username ? `${username}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setMessage({ type: 'success', text: 'Link copied to clipboard!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to copy link' })
      console.log(error)
    }
  }

  const handleFinish = () => {
    markStepCompleted('preview')
    router.push(`/${profileUrl}`)
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
              <Button fullWidth variant='outlined' onClick={prevStep} size={isMobile ? 'large' : 'medium'}>
                Back
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='contained'
                onClick={handleFinish}
                startIcon={<LaunchIcon />}
                size={isMobile ? 'large' : 'medium'}
              >
                View Profile
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant='contained'
                color='success'
                onClick={() => router.push('/dashboard/stats')}
                startIcon={<Dashboard />}
                size={isMobile ? 'large' : 'medium'}
              >
                Go to Dashboard
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
