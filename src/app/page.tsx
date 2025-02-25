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
  Stack,
  Chip,
  useTheme,
  alpha
} from '@mui/material'
import {
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  Palette as PaletteIcon,
  Share as ShareIcon,
  DevicesOther as DevicesIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ProfilePreviewShowcase from '@/components/home/ProfilePreviewShowcase'
import DashboardPreview from '@/components/home/DashboardPreview'

// Animated component wrappers using framer-motion
const MotionBox = motion(Box)
const MotionTypography = motion(Typography)
const MotionCard = motion(Card)

export default function Home() {
  const router = useRouter()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const features = [
    {
      icon: <LinkIcon fontSize='large' />,
      title: 'All Your Links',
      description: 'Combine your website, social profiles, and more into a single, easy-to-share link.'
    },
    {
      icon: <PaletteIcon fontSize='large' />,
      title: 'Custom Themes',
      description: 'Choose from beautiful pre-designed themes or create your own unique style.'
    },
    {
      icon: <AnalyticsIcon fontSize='large' />,
      title: 'Real-Time Analytics',
      description: 'Track visits, clicks, and engagement with comprehensive analytics.'
    },
    {
      icon: <DevicesIcon fontSize='large' />,
      title: 'Mobile Optimized',
      description: 'Your profile looks great on any device - mobile, tablet, or desktop.'
    },
    {
      icon: <SpeedIcon fontSize='large' />,
      title: 'Lightning Fast',
      description: 'Ultra-fast loading times to give your audience the best experience.'
    },
    {
      icon: <ShareIcon fontSize='large' />,
      title: 'Easy Sharing',
      description: 'Share your profile anywhere with a personalized, memorable URL.'
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
            : 'linear-gradient(135deg, #EEF2FF 0%, #F5F7FF 100%)',
          pt: { xs: 10, md: 12 },
          pb: { xs: 12, md: 16 }
        }}
      >
        {/* Background Decoration Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '5%', md: '15%' },
            right: { xs: '-10%', md: '5%' },
            width: { xs: 300, md: 500 },
            height: { xs: 300, md: 500 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(
              theme.palette.primary.main,
              0
            )} 70%)`,
            zIndex: 0
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '10%', md: '5%' },
            left: { xs: '-10%', md: '5%' },
            width: { xs: 200, md: 400 },
            height: { xs: 200, md: 400 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(
              theme.palette.secondary.main,
              0
            )} 70%)`,
            zIndex: 0
          }}
        />

        <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems='center' justifyContent='center'>
            <Grid item xs={12} md={7}>
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Hero Tagline */}
                <Chip
                  label='One Link For Everything'
                  color='primary'
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    px: 1.5,
                    py: 2.5,
                    borderRadius: '50px',
                    background: isDarkMode
                      ? 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)'
                      : 'linear-gradient(90deg, #3B82F6 0%, #6366F1 100%)'
                  }}
                />

                {/* Main Headline */}
                <MotionTypography
                  variant='h1'
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                    lineHeight: 1.2,
                    mb: 3,
                    background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Your Digital Identity,
                  <br />
                  One Link Away
                </MotionTypography>

                {/* Subheadline */}
                <Typography
                  variant='h6'
                  color='text.secondary'
                  sx={{
                    mb: 4,
                    fontWeight: 'normal',
                    lineHeight: 1.6
                  }}
                >
                  Create a beautiful, customizable link page to showcase all your important links, profiles, and
                  content. Share once, connect everywhere.
                </Typography>

                {/* CTA Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => router.push('/r')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                      borderRadius: '50px',
                      fontSize: '1rem',
                      background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
                      boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        boxShadow: '0 15px 30px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    Get Started Free
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '500px', md: '600px' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: '300px', sm: '320px', md: '340px' },
                    height: { xs: '550px', md: '550px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ProfilePreviewShowcase />
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: isDarkMode
            ? 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
            : 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)'
        }}
      >
        <Container maxWidth='lg'>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant='h2'
              fontWeight='bold'
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{
                mb: 2,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Get started in three simple steps
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems='center'>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Box sx={{ mb: 5 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? alpha(theme.palette.background.paper, 0.1)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDarkMode ? alpha(theme.palette.divider, 0.1) : theme.palette.divider
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        fontSize: '1.25rem',
                        fontWeight: 'bold'
                      }}
                    >
                      1
                    </Box>
                    <Typography variant='h6' gutterBottom fontWeight='bold'>
                      Sign Up Free
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      Create your account in seconds with email or Google. No credit card required.
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ mb: 5 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? alpha(theme.palette.background.paper, 0.1)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDarkMode ? alpha(theme.palette.divider, 0.1) : theme.palette.divider
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        fontSize: '1.25rem',
                        fontWeight: 'bold'
                      }}
                    >
                      2
                    </Box>
                    <Typography variant='h6' gutterBottom fontWeight='bold'>
                      Add Your Links
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      Add all your important social media profiles, websites, and content in one place.
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? alpha(theme.palette.background.paper, 0.1)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDarkMode ? alpha(theme.palette.divider, 0.1) : theme.palette.divider
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        fontSize: '1.25rem',
                        fontWeight: 'bold'
                      }}
                    >
                      3
                    </Box>
                    <Typography variant='h6' gutterBottom fontWeight='bold'>
                      Monitor Your Success
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      Track visits, clicks, and engagement with detailed analytics in your dashboard.
                    </Typography>
                  </Paper>
                </Box>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: '90%', md: '100%' },
                    maxWidth: '500px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <DashboardPreview />
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: isDarkMode ? '#0F172A' : '#FFFFFF'
        }}
      >
        <Container maxWidth='lg'>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant='h2'
              fontWeight='bold'
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{
                mb: 2,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Create, customize, and share your digital presence in minutes
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    height: '100%',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                    }
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
                        borderRadius: '12px',
                        mb: 2,
                        background: isDarkMode
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant='h5' gutterBottom fontWeight='bold'>
                      {feature.title}
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: isDarkMode
            ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          borderRadius: { xs: 0, md: '50px 50px 0 0' },
          mt: -4
        }}
      >
        <Container maxWidth='md'>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            sx={{
              textAlign: 'center',
              background: isDarkMode
                ? alpha(theme.palette.background.paper, 0.1)
                : alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(10px)',
              p: { xs: 4, md: 8 },
              borderRadius: 4,
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography
              variant='h3'
              fontWeight='bold'
              sx={{
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              Ready to Simplify Your Online Presence?
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{
                mb: 4,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Join thousands of creators and businesses who use TanLink to connect with their audience.
            </Typography>

            <Button
              variant='contained'
              size='large'
              endIcon={<ArrowForwardIcon />}
              onClick={() => router.push('/r')}
              sx={{
                py: 1.5,
                px: 4,
                fontWeight: 600,
                borderRadius: '50px',
                fontSize: '1rem',
                background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 15px 30px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              Get Started For Free
            </Button>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 3 }}>
              No credit card required. Set up in minutes.
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          background: isDarkMode ? '#0F172A' : '#FFFFFF',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth='lg'>
          <Grid container spacing={2} alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography
                variant='h6'
                fontWeight='bold'
                sx={{
                  background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TanLink
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body2' color='text.secondary'>
                © {new Date().getFullYear()} TanLink. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
