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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '@/config/firebase'

const MAX_BIO_LENGTH = 150
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface UserProfile {
  displayName: string
  username: string
  bio: string
  photoURL: string | null
}

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    username: '',
    bio: '',
    photoURL: null
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
          photoURL: userData.photoURL || null
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
      const storageRef = ref(storage, `profile_photos/${user.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL
      })

      setProfile(prev => ({ ...prev, photoURL: downloadURL }))
      setSuccess('Profile photo updated successfully')
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!user || !profile.photoURL) return

    try {
      const storageRef = ref(storage, `profile_photos/${user.uid}`)
      await deleteObject(storageRef)

      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: null
      })

      setProfile(prev => ({ ...prev, photoURL: null }))
      setSuccess('Profile photo removed successfully')
    } catch (err) {
      console.error('Error deleting photo:', err)
      setError('Failed to delete photo')
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
