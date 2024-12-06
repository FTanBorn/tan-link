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

    onAdd({
      ...(editingLink?.id ? { id: editingLink.id } : {}),
      platform: selectedPlatform,
      title: formData.title.trim(),
      url: formData.url.trim()
    })
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
