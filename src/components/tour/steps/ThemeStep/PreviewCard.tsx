'use client'
import { Box, Paper, Typography, Button, Avatar } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { ThemePreset } from '@/types/theme'
import { platformIcons } from '../LinksStep/constants'

interface PreviewCardProps {
  theme?: ThemePreset | null
  links?: Array<{
    id: string
    platform: keyof typeof platformIcons
    title: string
    url: string
    order: number
  }>
}

const defaultStyles = {
  backgroundColor: '#f0f2f5',
  cardBackground: '#ffffff',
  textColor: '#000000',
  container: {
    borderRadius: 2,
    p: 2
  },
  button: {
    mb: 1,
    py: 1,
    borderRadius: 2,
    justifyContent: 'center',
    textTransform: 'none',
    transition: 'all 0.2s ease'
  }
}

export default function PreviewCard({ theme, links = [] }: PreviewCardProps) {
  debugger
  const { user } = useAuth()

  const getButtonStyle = (platformInfo: (typeof platformIcons)[keyof typeof platformIcons]) => {
    if (!theme) {
      return {
        ...defaultStyles.button,
        bgcolor: platformInfo.bgColor,
        color: platformInfo.color,
        '&:hover': {
          bgcolor: platformInfo.color,
          color: '#fff',
          transform: 'translateY(-2px)'
        }
      }
    }
    return {
      ...theme.buttonStyle.style,
      mb: defaultStyles.button.mb,
      transition: defaultStyles.button.transition
    }
  }

  const containerStyles = {
    background: theme?.backgroundStyle.value || defaultStyles.backgroundColor,
    ...defaultStyles.container,
    minHeight: theme ? '600px' : 'auto',
    backdropFilter: theme?.backgroundStyle.blur ? `blur(${theme.backgroundStyle.blur}px)` : undefined
  }

  const cardStyles = {
    bgcolor: theme?.cardBackground || defaultStyles.cardBackground,
    color: theme?.textColor || defaultStyles.textColor,
    p: 3,
    borderRadius: 2,
    height: '100%'
  }

  return (
    <Box sx={containerStyles}>
      <Paper elevation={3} sx={cardStyles}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            src={user?.photoURL || undefined}
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              border: '4px solid',
              borderColor: 'primary.main'
            }}
          >
            {user?.email?.[0].toUpperCase()}
          </Avatar>
          <Typography variant='h6' fontWeight='bold'>
            {user?.displayName || user?.email?.split('@')[0]}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Your Bio Here
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {links.map(link => {
            const platformInfo = platformIcons[link.platform]
            return (
              <Button
                key={link.id}
                fullWidth
                variant='contained'
                startIcon={platformInfo.icon}
                sx={getButtonStyle(platformInfo)}
              >
                {link.title || platformInfo.placeholder}
              </Button>
            )
          })}

          {(!links || links.length === 0) && (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                color: theme?.textColor || 'text.secondary',
                bgcolor: 'transparent',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant='body2' sx={{ color: theme?.textColor || 'inherit' }}>
                Add links to see preview
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mt: 3,
            pt: 2,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant='caption' sx={{ color: theme?.textColor || 'text.secondary' }}>
            Powered by TanLink
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
