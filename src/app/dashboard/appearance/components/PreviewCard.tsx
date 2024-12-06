'use client'
import { Box, Paper, Typography, Button, Avatar } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { ThemePreset } from '@/types/theme'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { platformIcons } from '../../links/components/constants'

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
  backgroundColor: '#f8fafc', // Daha soft bir arka plan
  cardBackground: '#ffffff',
  textColor: '#1e293b', // Koyu slate rengi
  container: {
    borderRadius: 3,
    p: 2,
    transition: 'background-color 0.3s ease',
    minHeight: '100%'
  },
  button: {
    mb: 1.5,
    py: 1.5,
    px: 3,
    borderRadius: '12px',
    justifyContent: 'center',
    textTransform: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'none'
  },
  card: {
    p: 4,
    borderRadius: '24px',
    height: '100%',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  }
}

export default function PreviewCard({ theme, links = [] }: PreviewCardProps) {
  const { user } = useAuth()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUsername(userDoc.data().username)
        }
      } catch (error) {
        console.error('Error fetching username:', error)
      }
    }

    fetchUsername()
  }, [user])

  const getButtonStyle = (platformInfo: (typeof platformIcons)[keyof typeof platformIcons]) => {
    if (!theme) {
      return {
        ...defaultStyles.button,
        bgcolor: platformInfo.bgColor,
        color: platformInfo.color,
        '&:hover': {
          bgcolor: platformInfo.color,
          color: '#fff',
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${platformInfo.bgColor}`
        }
      }
    }
    return {
      ...theme.buttonStyle.style,
      mb: defaultStyles.button.mb,
      py: defaultStyles.button.py,
      px: defaultStyles.button.px,
      transition: defaultStyles.button.transition,
      boxShadow: theme.buttonStyle.type === 'glass' ? 'none' : undefined,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.buttonStyle.type === 'glass' ? 'none' : undefined
      }
    }
  }

  const containerStyles = {
    background: theme?.backgroundStyle.value || defaultStyles.backgroundColor,
    ...defaultStyles.container,
    minHeight: theme ? '600px' : 'auto',
    backdropFilter: theme?.backgroundStyle.blur ? `blur(${theme.backgroundStyle.blur}px)` : undefined
  }

  const cardStyles = {
    ...defaultStyles.card,
    bgcolor: theme?.cardBackground || defaultStyles.cardBackground,
    color: theme?.textColor || defaultStyles.textColor,
    borderRadius: theme?.buttonStyle?.style.borderRadius || defaultStyles.card.borderRadius,
    boxShadow: theme?.buttonStyle.type === 'glass' ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.08)'
  }

  const avatarStyles = {
    width: 88,
    height: 88,
    mx: 'auto',
    mb: 2,
    border: '4px solid',
    borderColor: theme?.buttonStyle.type === 'neon' ? theme.buttonStyle.style.color : 'primary.main',
    boxShadow: theme?.buttonStyle.type === 'neon' ? `0 0 12px ${theme.buttonStyle.style.color}` : 'none',
    transition: 'all 0.3s ease'
  }

  return (
    <Box sx={containerStyles}>
      <Paper elevation={3} sx={cardStyles}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar src={user?.photoURL || undefined} sx={avatarStyles}>
            {user?.email?.[0].toUpperCase()}
          </Avatar>
          <Typography variant='h6' fontWeight='bold'>
            {username || user?.email?.split('@')[0]}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: theme?.textColor ? `${theme.textColor}99` : 'text.secondary',
              opacity: 0.8,
              mb: 1
            }}
          >
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
            borderColor: theme?.buttonStyle.type === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'divider'
          }}
        >
          <Typography
            variant='caption'
            sx={{
              color: theme?.textColor ? `${theme.textColor}88` : 'text.secondary',
              opacity: 0.7
            }}
          >
            Powered by TanLink
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
