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
  Tooltip
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { title: 'My Links', icon: <LinkIcon />, path: '/dashboard/links' },
    { title: 'Analytics', icon: <AnalyticsIcon />, path: '/dashboard/analytics' },
    { title: 'Appearance', icon: <PaletteIcon />, path: '/dashboard/appearance' },
    { title: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' }
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    if (onClose) onClose()
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {/* Close button for mobile */}
      {onClose && (
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}

      {/* User Profile Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar src={user?.photoURL || undefined} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
          {user?.email?.[0].toUpperCase()}
        </Avatar>
        <Typography variant='h6' noWrap component='div'>
          {user?.displayName || user?.email?.split('@')[0]}
        </Typography>
        <Typography variant='body2' color='text.secondary' noWrap>
          {user?.email}
        </Typography>

        {/* Share Profile Button */}
        <Tooltip title='Share your profile'>
          <IconButton sx={{ mt: 1 }} onClick={() => handleNavigation('/dashboard/share')}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List>
        {menuItems.map(item => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                mx: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText'
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
