// src/components/LinkPreview.tsx
'use client'
import { Box, Paper, Typography, Button, Avatar } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { platformIcons } from './constants'

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
}

interface LinkPreviewProps {
  links: Link[]
}

export default function LinkPreview({ links }: LinkPreviewProps) {
  const { userData } = useAuth()

  return (
    <Paper
      elevation={3}
      sx={{
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src={userData?.photoURL || undefined}
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            border: '4px solid',
            borderColor: 'primary.main',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {userData?.displayName?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant='h6' gutterBottom>
          {userData?.displayName || userData?.username || userData?.email?.split('@')[0]}
        </Typography>
        {userData?.bio && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2, px: 2 }}>
            {userData.bio}
          </Typography>
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        {links.map(link => {
          const platformInfo = platformIcons[link.platform]
          return (
            <Button
              key={link.id}
              fullWidth
              variant='contained'
              startIcon={platformInfo.icon}
              sx={{
                mb: 1,
                bgcolor: platformInfo.bgColor,
                color: platformInfo.color,
                '&:hover': {
                  bgcolor: platformInfo.color,
                  color: '#fff'
                },
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {link.title || platformInfo.placeholder}
            </Button>
          )
        })}

        {links.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              color: 'text.secondary',
              bgcolor: 'background.default',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant='body2'>Add links to see preview</Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant='caption' color='text.secondary'>
          Powered by TanLink
        </Typography>
      </Box>
    </Paper>
  )
}
