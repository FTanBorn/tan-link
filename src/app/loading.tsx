// src/app/loading.tsx
import { Box, CircularProgress, Container } from '@mui/material'

export default function Loading() {
  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    </Container>
  )
}
