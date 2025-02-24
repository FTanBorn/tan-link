'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Fade,
  Divider
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  KeyboardArrowDown,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  AddLink as AddLinkIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/config/firebase'
import { signOut } from 'firebase/auth'
import { useThemeContext } from '@/context/ThemeContext'

export default function Header() {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const { toggleTheme } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState(null)

  const isDarkMode = theme.palette.mode === 'dark'

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await signOut(auth)
    handleClose()
    router.push('/')
  }

  const navigateTo = (path: string) => {
    router.push(path)
    handleClose()
  }

  // Dark theme styles
  const darkModeStyles = {
    header: {
      background: 'rgba(17, 25, 40, 0.75)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    logo: {
      background: 'linear-gradient(45deg, #818CF8 30%, #6366F1 90%)',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 800,
      textShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
    },
    addButton: {
      background: 'linear-gradient(45deg, #4F46E5 30%, #6366F1 90%)',
      boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
    },
    avatarBorder: {
      borderColor: '#6366F1',
      boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
    },
    menu: {
      background: 'rgba(23, 25, 35, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
    },
    menuItem: {
      color: '#E2E8F0',
      '&:hover': {
        background: 'rgba(99, 102, 241, 0.1)'
      }
    }
  }

  // Light theme styles
  const lightModeStyles = {
    header: {
      background: 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
    },
    logo: {
      background: 'linear-gradient(45deg, #2563EB 30%, #3B82F6 90%)',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 800
    },
    addButton: {
      background: 'linear-gradient(45deg, #2563EB 30%, #3B82F6 90%)',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
    },
    avatarBorder: {
      borderColor: '#2563EB'
    },
    menu: {
      background: '#FFFFFF',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    },
    menuItem: {
      color: '#64748B',
      '&:hover': {
        background: 'rgba(37, 99, 235, 0.1)'
      }
    }
  }

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles

  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{
        backdropFilter: 'blur(16px)',
        ...currentStyles.header
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant='h5'
            component='div'
            onClick={() => router.push('/')}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                opacity: 0.9
              },
              ...currentStyles.logo
            }}
          >
            TanLink
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user && (
              <>
                {/* Add Link Button */}
                <Button
                  variant='contained'
                  size='small'
                  startIcon={<AddLinkIcon />}
                  onClick={() => router.push('/dashboard/links')}
                  sx={{
                    mr: 1,
                    display: { xs: 'none', sm: 'flex' },
                    color: '#FFFFFF',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    borderRadius: '10px',
                    py: 1,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isDarkMode ? '0 0 20px rgba(99, 102, 241, 0.5)' : '0 8px 15px rgba(37, 99, 235, 0.2)'
                    },
                    ...currentStyles.addButton
                  }}
                >
                  Add Link
                </Button>

                {/* Theme Toggle */}
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    mr: 1,
                    color: isDarkMode ? '#E2E8F0' : '#64748B',
                    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                {/* User Menu */}
                <Button
                  onClick={handleMenu}
                  endIcon={<KeyboardArrowDown sx={{ color: isDarkMode ? '#E2E8F0' : '#64748B' }} />}
                  sx={{
                    borderRadius: '20px',
                    px: 1,
                    color: isDarkMode ? '#E2E8F0' : '#64748B',
                    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  startIcon={
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        border: '2px solid',
                        transition: 'all 0.3s ease',
                        ...currentStyles.avatarBorder
                      }}
                      src={user.photoURL || undefined}
                    >
                      {user.email?.[0].toUpperCase()}
                    </Avatar>
                  }
                >
                  <Typography
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      maxWidth: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.displayName || user.email?.split('@')[0]}
                  </Typography>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '8px',
                      ...currentStyles.menu
                    }
                  }}
                >
                  <MenuItem
                    onClick={() => navigateTo('/dashboard/stats')}
                    sx={{ ...currentStyles.menuItem, borderRadius: '8px' }}
                  >
                    <DashboardIcon sx={{ mr: 2, fontSize: 20 }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => navigateTo('/dashboard/profile')}
                    sx={{ ...currentStyles.menuItem, borderRadius: '8px' }}
                  >
                    <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                    Profile
                  </MenuItem>
                  <Divider
                    sx={{
                      my: 1,
                      borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: '#EF4444',
                      borderRadius: '8px',
                      '&:hover': {
                        background: 'rgba(239, 68, 68, 0.1)'
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}

            {!user && (
              // Auth Buttons for non-logged in users
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant='outlined'
                  onClick={() => router.push('/r')}
                  sx={{
                    borderRadius: '10px',
                    color: isDarkMode ? '#E2E8F0' : '#64748B',
                    borderColor: isDarkMode ? '#6366F1' : '#2563EB',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: isDarkMode ? '#818CF8' : '#3B82F6',
                      backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant='contained'
                  onClick={() => router.push('/r?signup=true')}
                  sx={{
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    },
                    ...currentStyles.addButton
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
