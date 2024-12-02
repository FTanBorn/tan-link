'use client'
import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { SentimentVeryDissatisfied } from '@mui/icons-material'

export default function NotFound() {
  const router = useRouter()

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
        <SentimentVeryDissatisfied sx={{ fontSize: 80, color: 'primary.main', mb: 4 }} />

        <Typography
          variant='h1'
          component='h1'
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            mb: 2
          }}
        >
          404
        </Typography>

        <Typography variant='h4' gutterBottom sx={{ mb: 3 }}>
          Oops! Page not found
        </Typography>

        <Typography color='text.secondary' sx={{ mb: 4, maxWidth: '600px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Button variant='contained' size='large' onClick={() => router.push('/')} sx={{ borderRadius: '20px' }}>
          Back to Home
        </Button>
      </Box>
    </Container>
  )
}
