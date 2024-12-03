'use client'
import { Box, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material'
import { Share, Visibility, Analytics, Palette } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ProfilePreview from '@/components/home/ProfilePreview'
import { useTheme } from '@mui/material/styles'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const theme = useTheme()

  const features = [
    {
      icon: <Share fontSize='large' color='primary' />,
      title: 'Single Link',
      description: 'Combine all your social media profiles under one link'
    },
    {
      icon: <Visibility fontSize='large' color='primary' />,
      title: 'View Tracking',
      description: 'Monitor your profile visits and link clicks in real-time'
    },
    {
      icon: <Analytics fontSize='large' color='primary' />,
      title: 'Analytics',
      description: 'Get detailed insights about your audience and interactions'
    },
    {
      icon: <Palette fontSize='large' color='primary' />,
      title: 'Custom Themes',
      description: 'Personalize your profile with custom themes and styles'
    }
  ]

  return (
    <Box>
      <Box
        sx={{
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #F0F4FF 0%, #F5F7FF 100%)'
              : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          py: 15
        }}
      >
        <Container maxWidth='lg'>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} md={6}>
              <Typography variant='h2' component='h1' gutterBottom fontWeight='bold'>
                All Your Links
                <Box component='span' sx={{ color: 'primary.main' }}>
                  {' '}
                  In One Place
                </Box>
              </Typography>
              <Typography variant='h5' color='text.secondary' sx={{ mb: 4 }}>
                Share your social media profiles with a single customizable link
              </Typography>
              <Box>
                {!user ? (
                  <>
                    <Button
                      variant='contained'
                      size='large'
                      onClick={() => router.push('/auth/register')}
                      sx={{ mr: 2 }}
                    >
                      Start Free
                    </Button>
                    <Button variant='outlined' size='large' onClick={() => router.push('/auth/login')}>
                      Sign In
                    </Button>
                  </>
                ) : (
                  <Button variant='contained' size='large' onClick={() => router.push('/dashboard')}>
                    Go to Dashboard
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: '600px' }}>
                <ProfilePreview />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: 10 }}>
        <Typography variant='h3' component='h2' textAlign='center' gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant='h6' gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color='text.secondary'>{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        component='footer'
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Container maxWidth='lg'>
          <Typography variant='body2' color='text.secondary' align='center'>
            © {new Date().getFullYear()} TanLink. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
