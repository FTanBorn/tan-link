'use client'
import { Box, Paper, Typography, Button, Avatar } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { platformIcons } from './constants'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
}

interface LinkPreviewProps {
  links: Link[]
}

export default function LinkPreview({ links }: LinkPreviewProps) {
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

  return (
    <Paper
      elevation={3}
      sx={{
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
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
        <Typography variant='h6' gutterBottom>
          {username || user?.email?.split('@')[0]}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {links.map(link => {
          const platformInfo = platformIcons[link.platform]
          return (
            <Button
              key={link.id}
              fullWidth
              variant='contained'
              startIcon={platformInfo.icon}
              sx={{
                mb: 1,
                bgcolor: platformInfo.bgColor,
                color: platformInfo.color,
                '&:hover': {
                  bgcolor: platformInfo.color,
                  color: '#fff'
                },
                justifyContent: 'center',
                py: 1,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              {link.title || link.platform}
            </Button>
          )
        })}

        {links.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              color: 'text.secondary',
              bgcolor: 'background.default',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant='body2'>Add links to see preview</Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant='caption' color='text.secondary'>
          Powered by TanLink
        </Typography>
      </Box>
    </Paper>
  )
}
