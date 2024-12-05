'use client'
import { Box, Container, Paper, LinearProgress } from '@mui/material'
import { useTour, StepType } from '@/context/TourContext'

import RegisterStep from './steps/RegisterStep'
import UsernameStep from './steps/UsernameStep'
import LinksStep from './steps/LinksStep'
import ThemeStep from './steps/ThemeStep'
import PreviewStep from './steps/PreviewStep'

const steps: { id: StepType; title: string }[] = [
  { id: 'register', title: 'Create Account' },
  { id: 'username', title: 'Choose Username' },
  { id: 'links', title: 'Add Links' },
  { id: 'theme', title: 'Customize Theme' },
  { id: 'preview', title: 'Preview & Share' }
]

export default function TourContainer() {
  const { currentStep } = useTour()

  const renderStep = () => {
    switch (currentStep) {
      case 'register':
        return <RegisterStep />
      case 'username':
        return <UsernameStep />
      case 'links':
        return <LinksStep />
      case 'theme':
        return <ThemeStep />
      case 'preview':
        return <PreviewStep />
      default:
        return null
    }
  }

  const getProgress = () => {
    return ((steps.findIndex(step => step.id === currentStep) + 1) / steps.length) * 100
  }

  return (
    <Container maxWidth='md' sx={{ py: { xs: 0, md: 4 }, px: { xs: 0, md: 2 } }}>
      <Box sx={{ mb: { xs: 0, md: 4 } }}>
        <LinearProgress
          variant='determinate'
          value={getProgress()}
          sx={{
            height: 8,
            borderRadius: 5,
            '& .MuiLinearProgress-bar': {
              borderRadius: 5
            }
          }}
        />
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {renderStep()}
      </Paper>
    </Container>
  )
}
