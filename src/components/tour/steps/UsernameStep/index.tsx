'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, InputAdornment, Alert, Paper, CircularProgress } from '@mui/material'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import { useTour } from '@/context/TourContext'

export default function UsernameStep() {
  const { user } = useAuth()
  const { nextStep, prevStep, markStepCompleted } = useTour()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState('')

  useEffect(() => {
    const fetchCurrentUsername = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setCurrentUsername(userData.username)
          setUsername(userData.username)
        }
      } catch (err) {
        console.error('Error fetching username:', err)
      }
    }

    fetchCurrentUsername()
  }, [user])

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      return 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores'
    }
    return ''
  }

  const checkUsernameAvailability = async (username: string) => {
    if (username === currentUsername) return true
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()))
    return !usernameDoc.exists()
  }

  const handleUsernameChange = async (username: string) => {
    setUsername(username)
    const validationError = validateUsername(username)
    if (validationError) {
      setUsernameError(validationError)
      return
    }

    try {
      const isAvailable = await checkUsernameAvailability(username)
      setUsernameError(isAvailable ? '' : 'Username is already taken')
    } catch (error) {
      setUsernameError('Error checking username availability')
      console.log(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const validationError = validateUsername(username)
      if (validationError) {
        setError(validationError)
        return
      }

      const isAvailable = await checkUsernameAvailability(username)
      if (!isAvailable) {
        setError('Username is already taken')
        return
      }

      if (currentUsername && currentUsername !== username.toLowerCase()) {
        await deleteDoc(doc(db, 'usernames', currentUsername))
      }

      await setDoc(
        doc(db, 'users', user.uid),
        {
          username: username.toLowerCase(),
          email: user.email,
          displayName: user.displayName,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      )

      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid
      })

      markStepCompleted('username')
      nextStep()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', width: '100%' }}>
      <Typography variant='h6' align='center' gutterBottom fontWeight='bold'>
        {currentUsername ? 'Update Username' : 'Choose Username'}
      </Typography>

      <Typography variant='subtitle2' color='text.secondary' align='center' sx={{ mb: 4 }}>
        {currentUsername ? 'Your current username is: @' + currentUsername : 'Pick a unique username for your profile'}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label='Username'
          value={username}
          onChange={e => handleUsernameChange(e.target.value)}
          error={!!usernameError}
          helperText={usernameError}
          required
          size='small'
          InputProps={{
            startAdornment: <InputAdornment position='start'>@</InputAdornment>
          }}
          sx={{ mb: 3 }}
        />

        <Paper
          variant='outlined'
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'background.default',
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant='subtitle2' gutterBottom>
            Preview your profile URL:
          </Typography>
          <Typography
            sx={{
              wordBreak: 'break-all',
              color: username ? 'text.primary' : 'text.disabled'
            }}
          >
            {`tanlink.me/${username || 'username'}`}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button size='small' variant='outlined' onClick={prevStep} sx={{ flex: 1 }}>
            Back
          </Button>
          <Button
            size='small'
            type='submit'
            variant='contained'
            disabled={loading || !!usernameError || !username}
            sx={{ flex: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : currentUsername ? 'Update' : 'Continue'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
