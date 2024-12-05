'use client'
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Box,
  useTheme,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Fade
} from '@mui/material'
import { Brightness4, Brightness7, KeyboardArrowDown } from '@mui/icons-material'
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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

  const isDarkMode = theme.palette.mode === 'dark'
  const textColor = isDarkMode ? 'white' : 'black'

  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{
        backdropFilter: 'blur(20px)',
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant='h5'
            component='div'
            sx={{
              flexGrow: 1,
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
            {user && (
              <IconButton
                onClick={toggleTheme}
                sx={{
                  mr: 1,
                  color: textColor
                }}
              >
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            )}

            {user ? (
              <>
                <Button
                  onClick={handleMenu}
                  endIcon={<KeyboardArrowDown sx={{ color: textColor }} />}
                  sx={{
                    borderRadius: '20px',
                    px: 2,
                    color: textColor
                  }}
                  startIcon={
                    <Avatar sx={{ width: 24, height: 24 }} src={user.photoURL || undefined}>
                      {user.email?.[0].toUpperCase()}
                    </Avatar>
                  }
                >
                  {user.displayName || user.email?.split('@')[0]}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} TransitionComponent={Fade}>
                  <MenuItem
                    onClick={() => {
                      router.push('/dashboard')
                      handleClose()
                    }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  sx={{
                    color: textColor
                  }}
                  onClick={() => router.push('/r')}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
