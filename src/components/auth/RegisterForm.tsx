'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Box, TextField, Button, Typography, Alert, Container } from '@mui/material'

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(userCredential.user, { displayName: form.username })

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: form.username,
        email: form.email,
        createdAt: new Date().toISOString(),
        links: []
      })

      router.push('/dashboard')
    } catch (error) {
      setError('Registration failed. Please try again.')
      console.log(error)
    }
  }

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        {error && <Alert severity='error'>{error}</Alert>}
        <Box component='form' onSubmit={handleRegister} sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            label='Username'
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Email Address'
            type='email'
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Confirm Password'
            type='password'
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
