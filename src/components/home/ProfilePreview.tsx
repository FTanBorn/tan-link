'use client'
import { Paper, Box, Button } from '@mui/material'
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
  Mail,
  Store,
  Code
} from '@mui/icons-material'

interface LinkItem {
  id: string
  type: string
  title: string
  url: string
}

interface ProfilePreviewProps {
  links?: LinkItem[]
}

const linkStyles = {
  instagram: { color: '#E1306C', bgColor: '#FCE4EC' },
  github: { color: '#333333', bgColor: '#F5F5F5' },
  youtube: { color: '#FF0000', bgColor: '#FFEBEE' },
  whatsapp: { color: '#25D366', bgColor: '#E8F5E9' },
  twitter: { color: '#1DA1F2', bgColor: '#E3F2FD' },
  facebook: { color: '#1877F2', bgColor: '#E3F2FD' },
  website: { color: '#9C27B0', bgColor: '#F3E5F5' },
  linkedin: { color: '#0077B5', bgColor: '#E3F2FD' },
  store: { color: '#FF9800', bgColor: '#FFF3E0' },
  telegram: { color: '#0088cc', bgColor: '#E3F2FD' },
  email: { color: '#EA4335', bgColor: '#FFEBEE' },
  portfolio: { color: '#607D8B', bgColor: '#ECEFF1' }
}

const defaultLinks = [
  { id: '1', type: 'instagram', title: 'Instagram', url: '#', color: '#E1306C', bgColor: '#FCE4EC' },
  { id: '2', type: 'github', title: 'Github', url: '#', color: '#333333', bgColor: '#F5F5F5' },
  { id: '3', type: 'youtube', title: 'YouTube', url: '#', color: '#FF0000', bgColor: '#FFEBEE' },
  { id: '4', type: 'whatsapp', title: 'WhatsApp', url: '#', color: '#25D366', bgColor: '#E8F5E9' },
  { id: '5', type: 'twitter', title: 'Twitter', url: '#', color: '#1DA1F2', bgColor: '#E3F2FD' },
  { id: '6', type: 'facebook', title: 'Facebook', url: '#', color: '#1877F2', bgColor: '#E3F2FD' },
  { id: '7', type: 'website', title: 'Website', url: '#', color: '#9C27B0', bgColor: '#F3E5F5' },
  { id: '8', type: 'linkedin', title: 'LinkedIn', url: '#', color: '#0077B5', bgColor: '#E3F2FD' },
  { id: '10', type: 'telegram', title: 'Telegram', url: '#', color: '#0088cc', bgColor: '#E3F2FD' },
  { id: '11', type: 'email', title: 'Email', url: '#', color: '#EA4335', bgColor: '#FFEBEE' }
]

const getIcon = (type: string) => {
  const icons = {
    instagram: <Instagram />,
    github: <GitHub />,
    youtube: <YouTube />,
    whatsapp: <WhatsApp />,
    twitter: <Twitter />,
    facebook: <Facebook />,
    website: <Language />,
    linkedin: <LinkedIn />,
    store: <Store />,
    telegram: <Telegram />,
    email: <Mail />,
    portfolio: <Code />
  }
  return icons[type as keyof typeof icons] || <Language />
}

export default function ProfilePreview({ links = defaultLinks }: ProfilePreviewProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        height: 'auto',
        borderRadius: 4,
        position: 'relative'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box>
          {links.map(link => {
            const style = linkStyles[link.type as keyof typeof linkStyles] || linkStyles.website

            return (
              <Button
                key={link.id}
                variant='contained'
                fullWidth
                startIcon={getIcon(link.type)}
                sx={{
                  mb: 2,
                  bgcolor: style.bgColor,
                  color: style.color,
                  '&:hover': {
                    bgcolor: style.color,
                    color: '#fff'
                  },
                  justifyContent: 'center',
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              >
                {link.title}
              </Button>
            )
          })}
        </Box>
      </Box>
    </Paper>
  )
}
