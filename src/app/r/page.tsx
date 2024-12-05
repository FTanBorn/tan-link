'use client'
import { Box, Container } from '@mui/material'
import { TourProvider } from '@/context/TourContext'
import TourContainer from '@/components/tour/TourContainer'

export default function OnboardingPage() {
  return (
    <TourProvider>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: { xs: 2, md: 4 },
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Container maxWidth='lg'>
          <TourContainer />
        </Container>
      </Box>
    </TourProvider>
  )
}
