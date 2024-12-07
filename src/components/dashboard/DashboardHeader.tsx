// src/components/dashboard/DashboardHeader.tsx
'use client'
import { useState } from 'react'
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
  Fade
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Brightness4, Brightness7, KeyboardArrowDown, Translate } from '@mui/icons-material'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/config/firebase'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export default function DashboardHeader() {
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()
  const { toggleTheme } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isDarkMode = theme.palette.mode === 'dark'
  const textColor = isDarkMode ? 'white' : 'black'

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

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        width: { md: `calc(100% - 280px)` },
        ml: { md: '280px' },
        backdropFilter: 'blur(20px)',
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
          <Typography
            variant='h5'
            component='div'
            sx={{
              cursor: 'pointer',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            onClick={() => router.push('/')}
          >
            TanLink
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                mr: 1,
                color: textColor
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Language Switch (Disabled) */}
            <IconButton sx={{ color: textColor, opacity: 0.5 }} disabled>
              <Translate />
            </IconButton>

            {/* User Menu */}
            <Button
              onClick={handleMenu}
              endIcon={<KeyboardArrowDown sx={{ color: textColor }} />}
              sx={{
                borderRadius: '20px',
                px: 2,
                color: textColor
              }}
              startIcon={
                <Avatar sx={{ width: 24, height: 24 }} src={user?.photoURL || undefined}>
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
              }
            >
              {user?.displayName || user?.email?.split('@')[0]}
            </Button>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} TransitionComponent={Fade}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
