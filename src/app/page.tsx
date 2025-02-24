'use client'

import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Rating,
  useTheme,
  alpha
} from '@mui/material'
import { Share, Visibility, Palette } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import ProfilePreview from '@/components/home/ProfilePreview'

export default function Home() {
  const router = useRouter()
  const theme = useTheme()

  const features = [
    {
      icon: <Share fontSize='large' color='primary' />,
      title: 'Single Link for All',
      description: 'Combine all your social profiles, websites, and landing pages into a single, easy-to-share link.'
    },
    {
      icon: <Visibility fontSize='large' color='primary' />,
      title: 'Real-Time Analytics',
      description: 'Track visits, clicks, and engagement patterns with comprehensive analytics.'
    },
    {
      icon: <Palette fontSize='large' color='primary' />,
      title: 'Custom Styling',
      description: 'Design your profile with our extensive theme library, custom colors, and fonts.'
    }
  ]

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Content Creator',
      avatar: '/api/placeholder/40/40',
      text: 'TanLink transformed my online presence. I increased my click-through rate by 40%!',
      rating: 5
    },
    {
      name: 'Sarah Williams',
      role: 'Digital Marketer',
      avatar: '/api/placeholder/40/40',
      text: 'The custom themes make my profile stand out from the crowd.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Entrepreneur',
      avatar: '/api/placeholder/40/40',
      text: 'TanLink has been a game changer for managing multiple businesses.',
      rating: 4
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #F0F4FF 0%, #F5F7FF 100%)'
              : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          py: 10,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth='lg'>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} md={6}>
              <Typography
                variant='h1'
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                One Link.
                <br />
                Endless Possibilities.
              </Typography>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 4 }}>
                Bring together your links, social profiles, and more. Share everything with just one link.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => router.push('/r')}
                  sx={{
                    borderRadius: '30px',
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #4F46E5 0%, #DB2777 100%)'
                    }
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant='outlined'
                  size='large'
                  onClick={() => router.push('/r')}
                  sx={{
                    borderRadius: '30px',
                    py: 1.5,
                    px: 4,
                    fontWeight: 600
                  }}
                >
                  See Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                  height: { xs: '400px', md: '600px' }
                }}
              >
                <ProfilePreview />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth='lg' sx={{ py: 10 }}>
        <Typography variant='h2' align='center' sx={{ fontWeight: 700, mb: 4 }}>
          Everything You Need
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '20px',
                      mb: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant='h5' gutterBottom fontWeight='bold'>
                    {feature.title}
                  </Typography>
                  <Typography variant='body1' color='text.primary'>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 10,
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)'
              : 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
        }}
      >
        <Container maxWidth='lg'>
          <Typography variant='h2' align='center' sx={{ fontWeight: 700, mb: 4 }}>
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={testimonial.avatar} alt={testimonial.name} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant='subtitle1' fontWeight='bold'>
                        {testimonial.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant='body1' color='text.primary'>
                    {testimonial.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
