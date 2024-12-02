// src/app/auth/register/page.tsx
'use client'
import { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, Google } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth } from '@/config/firebase'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      await updateProfile(userCredential.user, {
        displayName: formData.name
      })

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
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
          Create Account
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Full Name'
            margin='normal'
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label='Email'
            type='email'
            margin='normal'
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label='Password'
            type={showPassword ? 'text' : 'password'}
            margin='normal'
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
          />

          <Button
            fullWidth
            type='submit'
            variant='contained'
            size='large'
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <Button
          fullWidth
          variant='outlined'
          startIcon={<Google />}
          onClick={handleGoogleRegister}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant='body2' color='text.secondary'>
            Already have an account?{' '}
            <Link
              href='/auth/login'
              sx={{
                textDecoration: 'none',
                fontWeight: 'bold',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
