// src/components/layout/Header.tsx
'use client'
import { AppBar, Toolbar, Button, Typography, IconButton, Box, useTheme } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
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

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Typography
          variant='h6'
          component='div'
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => router.push('/')}
        >
          TanLink
        </Typography>

        <IconButton onClick={toggleTheme} color='inherit'>
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Box sx={{ ml: 2 }}>
          {user ? (
            <>
              <Button color='inherit' onClick={() => router.push('/dashboard')} sx={{ mr: 1 }}>
                Dashboard
              </Button>
              <Button color='inherit' onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color='inherit' onClick={() => router.push('/auth/login')} sx={{ mr: 1 }}>
                Login
              </Button>
              <Button color='inherit' onClick={() => router.push('/auth/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
