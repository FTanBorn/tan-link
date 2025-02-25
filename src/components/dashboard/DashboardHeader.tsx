// src/components/dashboard/DashboardHeader.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Divider,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Brightness4, Brightness7, KeyboardArrowDown, Translate, Person, Logout } from '@mui/icons-material'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/config/firebase'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

export default function DashboardHeader() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const { user } = useAuth()
  const { toggleTheme } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const isDarkMode = theme.palette.mode === 'dark'
  const textColor = isDarkMode ? 'white' : 'black'

  // Detect scroll for subtle header appearance change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
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

  const handleProfileClick = () => {
    router.push('/dashboard/profile')
    handleClose()
  }

  return (
    <AppBar
      position='fixed'
      elevation={scrolled ? 4 : 0}
      sx={{
        width: { md: `calc(100% - 280px)` },
        ml: { md: '280px' },
        backdropFilter: 'blur(20px)',
        backgroundColor: isDarkMode
          ? scrolled
            ? 'rgba(17, 25, 40, 0.9)'
            : 'rgba(17, 25, 40, 0.7)'
          : scrolled
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s ease',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar
          sx={{
            py: scrolled ? 0.5 : 1,
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                '& .logo-text': {
                  transform: 'scale(1.05)'
                }
              }
            }}
            onClick={() => router.push('/')}
          >
            {/* Logo */}
            <Box
              sx={{
                position: 'relative',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image src='/logo.svg' alt='TanLink Logo' width={36} height={36} priority />
            </Box>

            {/* Text Logo */}
            <Typography
              variant='h5'
              component='div'
              className='logo-text'
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                transition: 'transform 0.2s ease'
              }}
            >
              TanLink
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: textColor,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {isDarkMode ? <Brightness7 sx={{ color: 'orange' }} /> : <Brightness4 sx={{ color: '#6366F1' }} />}
            </IconButton>

            {/* Language Switch (Disabled but styled better) */}
            <IconButton
              sx={{
                color: textColor,
                opacity: 0.5,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
              }}
              disabled
            >
              <Translate />
            </IconButton>

            {/* User Menu */}
            <Button
              onClick={handleMenu}
              endIcon={<KeyboardArrowDown sx={{ color: textColor }} />}
              sx={{
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                color: textColor,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
                }
              }}
              startIcon={
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    border: '2px solid',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                  }}
                  src={user?.photoURL || undefined}
                >
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
              }
            >
              {!isMobile && (
                <Typography
                  sx={{
                    fontWeight: 500,
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user?.displayName || user?.email?.split('@')[0]}
                </Typography>
              )}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
              PaperProps={{
                elevation: 4,
                sx: {
                  minWidth: '200px',
                  mt: 1.5,
                  overflow: 'visible',
                  borderRadius: '12px',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: -5,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    transform: 'rotate(45deg)',
                    borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderLeft: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    zIndex: 0
                  }
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 1,
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                  src={user?.photoURL || undefined}
                >
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
                <Typography fontWeight='bold'>{user?.displayName || 'User'}</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ wordBreak: 'break-all' }}>
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                <Person sx={{ mr: 2, fontSize: 20 }} />
                Profile
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white'
                  }
                }}
              >
                <Logout sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
