// components/ShareButton.tsx
import { useState } from 'react'
import { IconButton, Tooltip, Box } from '@mui/material'
import { ShareOutlined } from '@mui/icons-material'
import ShareDialog from './ShareDialog'

interface ShareButtonProps {
  username: any
}

export default function ShareButton({ username }: ShareButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Tooltip title='Share Profile' arrow>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -1,
              background: 'linear-gradient(45deg, #6366F1, #8B5CF6)',
              borderRadius: '50%',
              opacity: 0.2,
              transition: 'opacity 0.3s ease'
            },
            '&:hover::before': {
              opacity: 0.4
            }
          }}
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: 'relative',
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              color: '#6366F1',
              border: '2px solid',
              borderColor: 'rgba(99, 102, 241, 0.2)',
              width: 44,
              height: 44,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#6366F1',
                color: 'white',
                transform: 'translateY(-2px)',
                borderColor: '#6366F1'
              },
              '&:active': {
                transform: 'translateY(0px)'
              },
              '& .MuiSvgIcon-root': {
                fontSize: 22,
                transition: 'all 0.3s ease'
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <ShareOutlined />
          </IconButton>
        </Box>
      </Tooltip>

      <ShareDialog open={open} onClose={() => setOpen(false)} username={username} />
    </>
  )
}
