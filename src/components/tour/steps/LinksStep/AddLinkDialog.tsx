// src/components/tour/steps/LinksStep/AddLinkDialog.tsx
'use client'
import { useState } from 'react'
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
  Paper
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { platformIcons, PlatformType } from './constants'

interface AddLinkDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: { platform: PlatformType; title: string; url: string }) => void
  editingLink?: {
    platform: PlatformType
    title: string
    url: string
  } | null
}

export default function AddLinkDialog({ open, onClose, onAdd, editingLink }: AddLinkDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>(editingLink?.platform || 'website')
  const [formData, setFormData] = useState({
    title: editingLink?.title || '',
    url: editingLink?.url || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      platform: selectedPlatform,
      title: formData.title,
      url: formData.url
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editingLink ? 'Edit Link' : 'Add New Link'}
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant='subtitle2' gutterBottom>
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
                  <Box sx={{ color: platformIcons[key].color, mb: 1 }}>{platformIcons[key].icon}</Box>
                  <Typography variant='caption' sx={{ display: 'block' }}>
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
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='URL'
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            required
            helperText={`Example: ${platformIcons[selectedPlatform].placeholder}`}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='contained' type='submit' disabled={!formData.url}>
            {editingLink ? 'Save Changes' : 'Add Link'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
