'use client'
import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Box,
  CircularProgress
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { db } from '@/config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'

export default function SetupUsername() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/r')
      return
    }

    const checkExistingUsername = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists() && userDoc.data().username) {
        router.push('/dashboard')
      }
    }

    checkExistingUsername()
  }, [user, router])

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      return 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores'
    }
    return ''
  }

  const checkUsernameAvailability = async (username: string) => {
    const usernameDoc = doc(db, 'usernames', username.toLowerCase())
    const usernameSnapshot = await getDoc(usernameDoc)
    return !usernameSnapshot.exists()
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

      await setDoc(doc(db, 'users', user.uid), {
        username: username.toLowerCase(),
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date().toISOString()
      })

      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: user.uid
      })

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant='h4'
          align='center'
          gutterBottom
          fontWeight='bold'
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Choose Your Username
        </Typography>

        <Typography color='text.secondary' align='center' sx={{ mb: 4 }}>
          Choose a unique username for your profile
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
            InputProps={{
              startAdornment: <InputAdornment position='start'>@</InputAdornment>
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant='caption' color='text.secondary'>
              Your profile will be available at: website.com/{username}
            </Typography>
          </Box>

          <Button
            fullWidth
            type='submit'
            variant='contained'
            size='large'
            disabled={loading || !!usernameError}
            sx={{ mt: 3, borderRadius: '20px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Continue'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
