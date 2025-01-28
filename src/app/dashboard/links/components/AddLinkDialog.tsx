'use client'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { platformIcons, PlatformType } from './constants'

interface AddLinkDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: { id?: string; platform: PlatformType; title: string; url: string }) => void
  editingLink?: {
    id: string
    platform: PlatformType
    title: string
    url: string
  } | null
}

export default function AddLinkDialog({ open, onClose, onAdd, editingLink }: AddLinkDialogProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('instagram')
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  })

  useEffect(() => {
    if (open && editingLink) {
      setSelectedPlatform(editingLink.platform)
      setFormData({
        title: editingLink.title || '',
        url: editingLink.url || ''
      })
    } else if (open) {
      setSelectedPlatform('instagram')
      setFormData({
        title: '',
        url: ''
      })
    }
  }, [open, editingLink])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.url.trim()) {
      return
    }

    let formattedUrl = formData.url.trim()

    // HTTP/HTTPS kontrolü için yardımcı fonksiyon
    const ensureHttps = (url: string) => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`
      }
      return url
    }

    // Platform bazlı URL formatlama
    switch (selectedPlatform) {
      case 'email':
        if (!formattedUrl.startsWith('mailto:')) {
          formattedUrl = `mailto:${formattedUrl}`
        }
        break

      case 'whatsapp':
        const cleanNumber = formattedUrl.replace(/[\s\-\(\)\+]/g, '')
        if (!cleanNumber.startsWith('https://wa.me/') && !cleanNumber.startsWith('wa.me/')) {
          const numberWithoutPlus = cleanNumber.startsWith('+') ? cleanNumber.slice(1) : cleanNumber
          const finalNumber = !numberWithoutPlus.startsWith('90') ? `90${numberWithoutPlus}` : numberWithoutPlus
          formattedUrl = `https://wa.me/${finalNumber}`
        }
        break

      case 'instagram':
        formattedUrl = formattedUrl.replace('@', '')
        if (formattedUrl.includes('instagram.com')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else {
          formattedUrl = `https://instagram.com/${formattedUrl}`
        }
        break

      case 'twitter':
        formattedUrl = formattedUrl.replace('@', '')
        if (formattedUrl.includes('twitter.com')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else {
          formattedUrl = `https://twitter.com/${formattedUrl}`
        }
        break

      case 'github':
        formattedUrl = formattedUrl.replace('@', '')
        if (formattedUrl.includes('github.com')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else {
          formattedUrl = `https://github.com/${formattedUrl}`
        }
        break

      case 'linkedin':
        if (formattedUrl.includes('linkedin.com')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else if (formattedUrl.startsWith('in/') || formattedUrl.startsWith('/in/')) {
          formattedUrl = `https://linkedin.com/${formattedUrl.replace(/^\//, '')}`
        } else {
          formattedUrl = `https://linkedin.com/in/${formattedUrl.replace(/^\//, '')}`
        }
        break

      case 'facebook':
        if (formattedUrl.includes('facebook.com')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else {
          formattedUrl = `https://facebook.com/${formattedUrl}`
        }
        break

      case 'youtube':
        if (formattedUrl.includes('youtube.com') || formattedUrl.includes('youtu.be')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else if (formattedUrl.startsWith('@')) {
          formattedUrl = `https://youtube.com/${formattedUrl}`
        } else {
          formattedUrl = `https://youtube.com/@${formattedUrl}`
        }
        break

      case 'telegram':
        if (formattedUrl.includes('t.me')) {
          formattedUrl = ensureHttps(formattedUrl)
        } else {
          formattedUrl = `https://t.me/${formattedUrl.replace('@', '')}`
        }
        break

      case 'website':
        formattedUrl = ensureHttps(formattedUrl)
        break
    }

    onAdd({
      ...(editingLink?.id ? { id: editingLink.id } : {}),
      platform: selectedPlatform,
      title: formData.title.trim(),
      url: formattedUrl
    })
  }

  const getPlaceholder = (platform: PlatformType) => {
    switch (platform) {
      case 'instagram':
      case 'twitter':
      case 'github':
        return '@username veya tam URL'
      case 'youtube':
        return '@channel veya tam URL'
      case 'linkedin':
        return 'username veya /in/username'
      case 'whatsapp':
        return '+90 5XX XXX XX XX'
      case 'email':
        return 'email@domain.com'
      default:
        return platformIcons[platform].placeholder
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          height: isMobile ? '100%' : 'auto'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' fontWeight='bold'>
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </Typography>
          <IconButton onClick={onClose} size='small' edge='end'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Typography variant='subtitle2' gutterBottom fontWeight='medium'>
            Choose Platform
          </Typography>

          <Grid container spacing={1} sx={{ mb: 3 }}>
            {(Object.keys(platformIcons) as PlatformType[]).map(key => (
              <Grid item xs={4} sm={3} key={key}>
                <Paper
                  elevation={selectedPlatform === key ? 4 : 0}
                  onClick={() => setSelectedPlatform(key)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    bgcolor: selectedPlatform === key ? platformIcons[key].bgColor : 'background.paper',
                    border: '2px solid',
                    borderColor: selectedPlatform === key ? platformIcons[key].color : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: platformIcons[key].bgColor,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: platformIcons[key].color,
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {platformIcons[key].icon}
                  </Box>
                  <Typography
                    variant='caption'
                    sx={{
                      display: 'block',
                      fontWeight: selectedPlatform === key ? 'bold' : 'normal'
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            label='Title (Optional)'
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='URL'
            value={formData.url}
            placeholder={getPlaceholder(selectedPlatform)}
            onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
            helperText={`Example: ${platformIcons[selectedPlatform].placeholder}`}
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='contained' type='submit' disabled={!formData.url.trim()}>
            {editingLink ? 'Save Changes' : 'Add Link'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
