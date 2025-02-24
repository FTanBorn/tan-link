// components/ShareDialog.tsx
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  useTheme,
  alpha
} from '@mui/material'
import {
  Close as CloseIcon,
  ShareOutlined,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Link as LinkIcon
} from '@mui/icons-material'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  username: string
}

export default function ShareDialog({ open, onClose, username }: ShareDialogProps) {
  const theme = useTheme()
  const [copied, setCopied] = useState(false)
  const profileUrl = `tanlink.me/${username}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: 'twitter' | 'facebook' | 'instagram') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=Check out my profile!&url=${encodeURIComponent(profileUrl)}`,
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      instagram: `https://instagram.com/share?url=${encodeURIComponent(profileUrl)}`
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10]
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            pb: 1
          }}
        >
          <ShareOutlined color='primary' />
          <Typography variant='h6' component='div' sx={{ flexGrow: 1, fontWeight: 600 }}>
            Share Profile
          </Typography>
          <IconButton
            onClick={onClose}
            size='small'
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.1) }
            }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          {/* Profile URL Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' gutterBottom sx={{ mb: 1, color: 'text.secondary' }}>
              Profile Link
            </Typography>
            <TextField
              fullWidth
              value={profileUrl}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleCopy}
                      size='small'
                      sx={{
                        bgcolor: copied ? 'success.light' : 'primary.light',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: copied ? 'success.main' : 'primary.main'
                        }
                      }}
                    >
                      {copied ? <CheckIcon fontSize='small' /> : <CopyIcon fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position='start'>
                    <LinkIcon fontSize='small' color='disabled' />
                  </InputAdornment>
                )
              }}
              size='small'
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                }
              }}
            />
          </Box>

          {/* Social Share Buttons */}
          <Typography variant='subtitle2' gutterBottom sx={{ mb: 1, color: 'text.secondary' }}>
            Share on Social Media
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant='contained'
              startIcon={<TwitterIcon />}
              onClick={() => handleShare('twitter')}
              sx={{
                flex: 1,
                bgcolor: '#1DA1F2',
                '&:hover': {
                  bgcolor: '#1a8cd8'
                }
              }}
            >
              Twitter
            </Button>
            <Button
              variant='contained'
              startIcon={<FacebookIcon />}
              onClick={() => handleShare('facebook')}
              sx={{
                flex: 1,
                bgcolor: '#1877F2',
                '&:hover': {
                  bgcolor: '#166fe5'
                }
              }}
            >
              Facebook
            </Button>
            <Button
              variant='contained'
              startIcon={<InstagramIcon />}
              onClick={() => handleShare('instagram')}
              sx={{
                flex: 1,
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e88a2e, #d45e36, #c6233c, #b61f5b, #a8167a)'
                }
              }}
            >
              Instagram
            </Button>
          </Box>

          {/* Profile Preview */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              textAlign: 'center'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Copy and share your profile link with your audience
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='success' variant='filled'>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}
