// src/components/home/ProfilePreview.tsx
'use client'
import { Paper, Box, Typography, Button } from '@mui/material'
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  GitHub,
  YouTube,
  WhatsApp,
  Telegram,
  Language,
  Mail
} from '@mui/icons-material'

const socialLinks = [
  { icon: <Instagram />, name: 'Instagram', color: '#E1306C', bgColor: '#FCE4EC' },
  { icon: <GitHub />, name: 'Github', color: '#333333', bgColor: '#F5F5F5' },
  { icon: <YouTube />, name: 'YouTube', color: '#FF0000', bgColor: '#FFEBEE' },
  { icon: <WhatsApp />, name: 'WhatsApp', color: '#25D366', bgColor: '#E8F5E9' },
  { icon: <Twitter />, name: 'Twitter', color: '#1DA1F2', bgColor: '#E3F2FD' },
  { icon: <Facebook />, name: 'Facebook', color: '#1877F2', bgColor: '#E3F2FD' },
  { icon: <Language />, name: 'Website', color: '#9C27B0', bgColor: '#F3E5F5' },
  { icon: <LinkedIn />, name: 'LinkedIn', color: '#0077B5', bgColor: '#E3F2FD' },
  { icon: <Telegram />, name: 'Telegram', color: '#0088cc', bgColor: '#E3F2FD' },
  { icon: <Mail />, name: 'Email', color: '#EA4335', bgColor: '#FFEBEE' }
]

export default function ProfilePreview() {
  return (
    <Paper
      elevation={8}
      sx={{
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Profile Preview
        </Typography>
        {socialLinks.map((link, index) => (
          <Button
            key={index}
            variant='contained'
            fullWidth
            startIcon={link.icon}
            sx={{
              mb: 2,
              bgcolor: link.bgColor,
              color: link.color,
              '&:hover': {
                bgcolor: link.color,
                color: '#fff'
              }
            }}
          >
            {link.name}
          </Button>
        ))}
      </Box>
    </Paper>
  )
}
