// src/app/dashboard/settings/profile/page.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Divider
} from '@mui/material'
import { PhotoCamera, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const MAX_BIO_LENGTH = 150
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface UserProfile {
  displayName: string
  username: string
  bio: string
  photoURL: string | null
  photoPublicId: string | null
}

export default function ProfileSettingsPage() {
  const { user, updateUserPhoto } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    username: '',
    bio: '',
    photoURL: null,
    photoPublicId: null
  })

  useEffect(() => {
    if (!user) return
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setProfile({
          displayName: userData.displayName || '',
          username: userData.username || '',
          bio: userData.bio || '',
          photoURL: userData.photoURL || null,
          photoPublicId: userData.photoPublicId || null
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile data')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validations
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size should be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Eski fotoğraf varsa sil
      if (profile.photoPublicId) {
        try {
          await fetch('/api/cloudinary?action=delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ publicId: profile.photoPublicId })
          })
        } catch (err) {
          console.error('Error deleting old photo:', err)
        }
      }

      // Yeni fotoğrafı yükle
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/cloudinary?action=upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()

      // AuthContext üzerinden güncelle (bu Firestore'u ve context'i güncelleyecek)
      await updateUserPhoto(data.secure_url, data.public_id)

      // Yerel state'i güncelle
      setProfile(prev => ({
        ...prev,
        photoURL: data.secure_url,
        photoPublicId: data.public_id
      }))

      setSuccess('Profile photo updated successfully')
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!user || !profile.photoURL || !profile.photoPublicId) return

    setUploading(true)
    try {
      // Cloudinary'den sil
      const response = await fetch('/api/cloudinary?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicId: profile.photoPublicId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete image')
      }

      // AuthContext üzerinden güncelle (bu Firestore'u ve context'i güncelleyecek)
      await updateUserPhoto(null, null)

      // Yerel state'i güncelle
      setProfile(prev => ({ ...prev, photoURL: null, photoPublicId: null }))
      setSuccess('Profile photo removed successfully')
    } catch (err) {
      console.error('Error deleting photo:', err)
      setError('Failed to delete photo')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    setError('')

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: profile.displayName.trim(),
        bio: profile.bio.trim()
      })

      setSuccess('Profile updated successfully')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' gutterBottom fontWeight='bold'>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={profile.photoURL || undefined}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  mx: 'auto',
                  border: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                {profile.displayName?.[0] || user?.email?.[0].toUpperCase()}
              </Avatar>

              {uploading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%'
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button component='label' variant='contained' startIcon={<PhotoCamera />} disabled={uploading}>
                Upload Photo
                <input type='file' hidden accept='image/*' onChange={handleFileUpload} />
              </Button>

              {profile.photoURL && (
                <IconButton onClick={handleDeletePhoto} color='error' disabled={uploading}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
              Recommended: Square image, at least 400x400 pixels
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {error && (
              <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle2' gutterBottom>
                Username
              </Typography>
              <TextField fullWidth disabled value={profile.username} helperText='Username cannot be changed' />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle2' gutterBottom>
                Display Name
              </Typography>
              <TextField
                fullWidth
                value={profile.displayName}
                onChange={e => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder='Enter your display name'
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle2' gutterBottom>
                Bio
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={profile.bio}
                onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value.slice(0, MAX_BIO_LENGTH) }))}
                placeholder='Tell others about yourself'
                helperText={`${profile.bio.length}/${MAX_BIO_LENGTH} characters`}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='contained' startIcon={<SaveIcon />} onClick={handleSave} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} message={success} />
    </Box>
  )
}
