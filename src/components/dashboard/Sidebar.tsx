'use client'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material'
import {
  Link as LinkIcon,
  Palette as PaletteIcon,
  Close as CloseIcon,
  VerifiedUser as UserIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ShareButton from './ShareButton'
import { useEffect } from 'react'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { userData, refreshUserData } = useAuth()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const menuItems = [
    {
      title: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/dashboard/stats',
      description: 'View your profile statistics'
    },
    {
      title: 'My Links',
      icon: <LinkIcon />,
      path: '/dashboard/links',
      description: 'Manage your social links'
    },
    {
      title: 'Profile',
      icon: <UserIcon />,
      path: '/dashboard/profile',
      description: 'Edit your profile details'
    },
    {
      title: 'Appearance',
      icon: <PaletteIcon />,
      path: '/dashboard/appearance',
      description: 'Customize your profile look'
    }
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    if (onClose) onClose()
  }

  useEffect(() => {
    refreshUserData()
  }, [])

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDarkMode ? 'rgba(17, 25, 40, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Close Button for Mobile */}
      {onClose && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 10,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* User Profile Section */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(99, 102, 241, 0.1))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))',
            zIndex: -1
          }
        }}
      >
        <Avatar
          src={userData?.photoURL || undefined}
          sx={{
            width: 90,
            height: 90,
            mx: 'auto',
            mb: 2,
            border: '4px solid',
            borderColor: 'primary.main',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {userData?.email?.[0].toUpperCase()}
        </Avatar>

        <Typography
          variant='h6'
          sx={{
            fontWeight: 600,
            mb: 0.5
          }}
        >
          {userData?.displayName || userData?.username}
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            mb: 1,
            opacity: 0.7
          }}
        >
          @{userData?.username}
        </Typography>

        {userData?.bio && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mt: 1,
              px: 2,
              opacity: 0.7,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {userData.bio}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <ShareButton username={userData?.username} />
        </Box>
      </Box>

      <Divider sx={{ my: 2, opacity: 0.6, mx: 2 }} />

      {/* Navigation Menu */}
      <List sx={{ px: 2, flex: 1, overflow: 'auto' }}>
        {menuItems.map(item => {
          const isActive = pathname === item.path

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <Tooltip title={item.description} placement='right' arrow>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    minHeight: 48,
                    position: 'relative',
                    overflow: 'hidden',
                    '&.Mui-selected': {
                      bgcolor: isDarkMode ? 'primary.dark' : alpha(theme.palette.primary.main, 0.8),
                      color: '#fff',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'primary.dark' : alpha(theme.palette.primary.main, 0.9)
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#fff'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: '60%',
                        bgcolor: '#fff',
                        borderRadius: '0 4px 4px 0'
                      }
                    },
                    '&:hover': {
                      bgcolor: isDarkMode
                        ? alpha(theme.palette.primary.main, 0.15)
                        : alpha(theme.palette.primary.main, 0.12),
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? '#fff' : 'primary.main'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant='body1'
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.95rem'
                        }}
                      >
                        {item.title}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          mt: 'auto'
        }}
      >
        <Typography variant='caption' color='text.secondary' sx={{ opacity: 0.7 }}>
          TanLink © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  )
}
