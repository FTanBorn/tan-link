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
  Stack
} from '@mui/material'
import { ContentCopy, Dashboard, Launch as LaunchIcon } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useTour } from '@/context/TourContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export default function PreviewStep() {
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

  const profileUrl = username ? `${window.location.origin}/${username}` : ''

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
    window.location.href = profileUrl
  }

  return (
    <Container maxWidth='lg' sx={{ py: 1, px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant='h4' gutterBottom fontWeight='bold'>
          Your Profile is Ready!
        </Typography>
        <Typography color='text.secondary'>Your profile has been created successfully</Typography>
      </Box>

      <Grid item xs={12} md={6}>
        <Typography variant='h6' gutterBottom>
          Your Profile Link
        </Typography>

        {/* Profile URL */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size='small'
            value={profileUrl}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Tooltip title='Copy Link'>
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              )
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Stack direction={'column-reverse'} spacing={2}>
          <Button size='small' fullWidth variant='outlined' onClick={prevStep}>
            Back
          </Button>
          <Button
            size='small'
            color='success'
            fullWidth
            variant='contained'
            onClick={handleFinish}
            startIcon={<Dashboard />}
          >
            View Dashboard
          </Button>
          <Button size='small' fullWidth variant='contained' onClick={handleFinish} startIcon={<LaunchIcon />}>
            View Your Profile
          </Button>
        </Stack>
      </Grid>

      {/* Notifications */}
      <Snackbar open={message !== null} autoHideDuration={3000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity={message?.type} elevation={6}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  )
}
