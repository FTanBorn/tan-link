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

export const platformIcons = {
  instagram: {
    icon: <Instagram />,
    color: '#E1306C',
    bgColor: '#FCE4EC',
    placeholder: 'instagram.com/username'
  },
  github: {
    icon: <GitHub />,
    color: '#333333',
    bgColor: '#F5F5F5',
    placeholder: 'github.com/username'
  },
  youtube: {
    icon: <YouTube />,
    color: '#FF0000',
    bgColor: '#FFEBEE',
    placeholder: 'youtube.com/@channel'
  },
  whatsapp: {
    icon: <WhatsApp />,
    color: '#25D366',
    bgColor: '#E8F5E9',
    placeholder: 'wa.me/number'
  },
  twitter: {
    icon: <Twitter />,
    color: '#1DA1F2',
    bgColor: '#E3F2FD',
    placeholder: 'twitter.com/username'
  },
  facebook: {
    icon: <Facebook />,
    color: '#1877F2',
    bgColor: '#E3F2FD',
    placeholder: 'facebook.com/username'
  },
  linkedin: {
    icon: <LinkedIn />,
    color: '#0077B5',
    bgColor: '#E3F2FD',
    placeholder: 'linkedin.com/in/username'
  },
  telegram: {
    icon: <Telegram />,
    color: '#0088cc',
    bgColor: '#E3F2FD',
    placeholder: 't.me/username'
  },
  email: {
    icon: <Mail />,
    color: '#EA4335',
    bgColor: '#FFEBEE',
    placeholder: 'email@example.com'
  },
  website: {
    icon: <Language />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    placeholder: 'https://your-website.com'
  }
} as const

export type PlatformType = keyof typeof platformIcons

export const availablePlatforms = Object.keys(platformIcons) as PlatformType[]
