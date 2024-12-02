// src/app/error.tsx
'use client'
import { Box, Button, Container, Typography } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOutline } from '@mui/icons-material'


export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Container maxWidth='md'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 4 }} />

        <Typography variant='h2' component='h1' gutterBottom>
          Something went wrong!
        </Typography>

        <Typography color='text.secondary' sx={{ mb: 4, maxWidth: '600px' }}>
          We apologize for the inconvenience. Please try again later or contact support if the problem persists.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='outlined' size='large' onClick={reset} sx={{ borderRadius: '20px' }}>
            Try again
          </Button>
          <Button
            variant='contained'
            size='large'
            onClick={() => (window.location.href = '/')}
            sx={{ borderRadius: '20px' }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
