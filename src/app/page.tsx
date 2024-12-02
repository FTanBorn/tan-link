// src/app/page.tsx
'use client'
import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <Container maxWidth='md'>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4
        }}
      >
        <Typography variant='h2' component='h1' gutterBottom>
          Share Your Social Links
        </Typography>
        <Typography variant='h5' color='text.secondary'>
          Create your personalized profile and share all your social media links in one place
        </Typography>
        <Box sx={{ mt: 4 }}>
          {!user ? (
            <>
              <Button variant='contained' size='large' onClick={() => router.push('/auth/register')} sx={{ mr: 2 }}>
                Get Started
              </Button>
              <Button variant='outlined' size='large' onClick={() => router.push('/auth/login')}>
                Login
              </Button>
            </>
          ) : (
            <Button variant='contained' size='large' onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}
