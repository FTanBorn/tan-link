'use client'
import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material'
import { Google, Visibility, VisibilityOff } from '@mui/icons-material'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useTour } from '@/context/TourContext'

export default function RegisterStep() {
  const { nextStep, markStepCompleted } = useTour()
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      markStepCompleted('register')
      nextStep()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      markStepCompleted('register')
      nextStep()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
      <Typography variant='h4' align='center' gutterBottom fontWeight='bold'>
        {isLogin ? 'Welcome Back!' : 'Create Account'}
      </Typography>

      <Typography color='text.secondary' align='center' sx={{ mb: 4 }}>
        {isLogin ? 'Sign in to continue building your profile' : 'Get started with your personalized link page'}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant='outlined'
        startIcon={<Google />}
        onClick={handleGoogleSignIn}
        disabled={loading}
        sx={{ mb: 3, height: 48 }}
      >
        Continue with Google
      </Button>

      <Divider sx={{ mb: 3 }}>
        <Typography color='text.secondary'>or</Typography>
      </Divider>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label='Email'
          type='email'
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label='Password'
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {!isLogin && (
          <TextField
            fullWidth
            label='Confirm Password'
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        )}

        <Button fullWidth type='submit' variant='contained' size='large' disabled={loading} sx={{ mb: 2, height: 48 }}>
          {loading ? <CircularProgress size={24} /> : isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Button variant='text' onClick={() => setIsLogin(!isLogin)} sx={{ textTransform: 'none' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Button>
        </Typography>
      </Box>
    </Box>
  )
}
