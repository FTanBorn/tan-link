'use client'
import { useState, useEffect, memo } from 'react'
import { Box, Paper, Avatar, Typography, Button } from '@mui/material'
import {
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon
} from '@mui/icons-material'

// Optimize edilmiş tema değişimi için basit temalar
const THEMES = [
  {
    id: 'light',
    bgColor: '#f8f9fd',
    cardBgColor: '#ffffff',
    textColor: '#333333',
    buttonBgColor: '#f5f7ff',
    buttonTextColor: '#3b82f6',
    borderColor: '#e0e7ff'
  },
  {
    id: 'dark',
    bgColor: '#1a1a2e',
    cardBgColor: '#2a2a4a',
    textColor: '#ffffff',
    buttonBgColor: 'rgba(255, 255, 255, 0.1)',
    buttonTextColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  {
    id: 'purple',
    bgColor: '#f5f3ff',
    cardBgColor: '#ffffff',
    textColor: '#4c1d95',
    buttonBgColor: '#ede9fe',
    buttonTextColor: '#6d28d9',
    borderColor: '#ddd6fe'
  },
  {
    id: 'blue',
    bgColor: '#eff6ff',
    cardBgColor: '#ffffff',
    textColor: '#1e40af',
    buttonBgColor: '#dbeafe',
    buttonTextColor: '#2563eb',
    borderColor: '#bfdbfe'
  }
]

// Basit statik linkler
const LINKS = [
  { title: 'Instagram', icon: <InstagramIcon /> },
  { title: 'YouTube', icon: <YouTubeIcon /> },
  { title: 'Twitter', icon: <TwitterIcon /> },
  { title: 'LinkedIn', icon: <LinkedInIcon /> },
  { title: 'My Website', icon: <LanguageIcon /> }
]

// Optimize edilmiş floating boxes
import { ReactNode } from 'react'

interface FloatingBoxProps {
  position: 'top' | 'bottom'
  children: ReactNode
}

const FloatingBox = memo(({ position, children }: FloatingBoxProps) => (
  <Paper
    elevation={2}
    sx={{
      position: 'absolute',
      zIndex: 30,
      p: 1.5,
      borderRadius: 2,
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      animation: position === 'top' ? 'floatTop 3s ease-in-out infinite' : 'floatBottom 3s ease-in-out infinite',
      '@keyframes floatTop': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' }
      },
      '@keyframes floatBottom': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(10px)' }
      },
      ...(position === 'top' ? { top: '15%', right: '-20px' } : { bottom: '15%', left: '-20px' })
    }}
  >
    {children}
  </Paper>
))

FloatingBox.displayName = 'FloatingBox'

// Ana bileşen
function ProfilePreviewShowcase() {
  const [themeIndex, setThemeIndex] = useState(0)

  // Optimize edilmiş tema değişimi - 7 saniyede bir değişecek şekilde
  useEffect(() => {
    const timer = setTimeout(() => {
      setThemeIndex(prevIndex => (prevIndex + 1) % THEMES.length)
    }, 7000)

    return () => clearTimeout(timer)
  }, [themeIndex])

  const currentTheme = THEMES[themeIndex]

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        width: 300,
        height: 550
      }}
    >
      {/* Floating boxes - telefon mockup'ın önünde */}
      <FloatingBox position='top'>
        <Typography variant='body2' fontWeight='600' color='#3b82f6'>
          +258 Visitors
        </Typography>
      </FloatingBox>

      <FloatingBox position='bottom'>
        <Typography variant='body2' fontWeight='600' color='#8b5cf6'>
          15 Clicks
        </Typography>
      </FloatingBox>

      {/* Phone mockup */}
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          zIndex: 20,
          width: 270,
          height: 530,
          borderRadius: '30px',
          overflow: 'hidden',
          border: '10px solid #111111',
          transition: 'background-color 0.5s ease'
        }}
      >
        {/* Notch */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '20px',
            bgcolor: '#111111',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            zIndex: 10
          }}
        />

        {/* Screen content with theme changes */}
        <Box
          sx={{
            height: '100%',
            bgcolor: currentTheme.bgColor,
            p: 2.5,
            pt: 6,
            transition: 'background-color 0.5s ease'
          }}
        >
          {/* Profile content */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              src='/api/placeholder/80/80'
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: currentTheme.buttonTextColor,
                transition: 'border-color 0.5s ease'
              }}
            />

            <Typography
              variant='h6'
              fontWeight='600'
              sx={{
                fontSize: '1.1rem',
                mb: 0.5,
                color: currentTheme.textColor,
                transition: 'color 0.5s ease'
              }}
            >
              Jane Smith
            </Typography>

            <Typography
              variant='body2'
              sx={{
                fontSize: '0.8rem',
                mb: 2,
                color: currentTheme.textColor,
                opacity: 0.7,
                transition: 'color 0.5s ease'
              }}
            >
              Digital Creator
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {LINKS.map((link, index) => (
              <Button
                key={index}
                variant='outlined'
                startIcon={link.icon}
                disableElevation
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  py: 1.2,
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.buttonTextColor,
                  bgcolor: currentTheme.buttonBgColor,
                  transition: 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease'
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 3,
              pt: 1.5,
              textAlign: 'center',
              borderTop: '1px solid',
              borderColor: currentTheme.borderColor,
              transition: 'border-color 0.5s ease'
            }}
          >
            <Typography
              variant='caption'
              sx={{
                opacity: 0.6,
                color: currentTheme.textColor,
                transition: 'color 0.5s ease'
              }}
            >
              Powered by TanLink
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

// Memo ile optimize ediyoruz
export default memo(ProfilePreviewShowcase)
