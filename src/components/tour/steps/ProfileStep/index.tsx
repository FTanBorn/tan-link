// src/components/tour/steps/ProfileStep.tsx
'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Avatar, IconButton, Alert, CircularProgress, Paper } from '@mui/material'
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material'
import { useTour } from '@/context/TourContext'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage, db } from '@/config/firebase'

const MAX_BIO_LENGTH = 150

export default function ProfileStep() {
  const { user } = useAuth()
  const { nextStep, prevStep, markStepCompleted } = useTour()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    bio: ''
  })
  const [uploading, setUploading] = useState(false)

  // Google ile giriş yapılıp yapılmadığını kontrol et
  const isGoogleUser = user?.providerData[0]?.providerId === 'google.com'

  useEffect(() => {
    if (user) {
      // Google kullanıcısı ise displayName'i otomatik al
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || '',
        photoURL: user.photoURL || ''
      }))

      // Mevcut bio'yu çek
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setFormData(prev => ({
              ...prev,
              bio: userData.bio || ''
            }))
          }
        } catch (err) {
          console.error('Error fetching user data:', err)
        }
      }

      fetchUserData()
    }
  }, [user])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const storageRef = ref(storage, `profile_photos/${user.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      setFormData(prev => ({ ...prev, photoURL: downloadURL }))
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!user || !formData.photoURL) return

    try {
      const storageRef = ref(storage, `profile_photos/${user.uid}`)
      await deleteObject(storageRef)
      setFormData(prev => ({ ...prev, photoURL: '' }))
    } catch (err) {
      console.error('Error deleting photo:', err)
      setError('Failed to delete photo')
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    // Email/password ile giriş yapıldıysa displayName zorunlu
    if (!isGoogleUser && !formData.displayName.trim()) {
      setError('Full Name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName.trim(),
        photoURL: formData.photoURL,
        bio: formData.bio.trim()
      })

      markStepCompleted('profile')
      nextStep()
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', width: '100%' }}>
      <Typography variant='h4' align='center' gutterBottom fontWeight='bold'>
        Complete Your Profile
      </Typography>

      <Typography color='text.secondary' align='center' sx={{ mb: 4 }}>
        Add some personal touches to your profile
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            src={formData.photoURL}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid',
              borderColor: 'primary.main'
            }}
          >
            {formData.displayName?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
          </Avatar>

          {uploading && (
            <CircularProgress
              size={120}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component='label' variant='contained' startIcon={<PhotoCamera />} disabled={uploading}>
            Upload Photo
            <input type='file' hidden accept='image/*' onChange={handleFileUpload} />
          </Button>

          {formData.photoURL && (
            <IconButton onClick={handleDeletePhoto} color='error' disabled={uploading}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Display Name alanını sadece email/password ile giriş yapanlara göster */}
      {!isGoogleUser && (
        <TextField
          fullWidth
          label='Full Name'
          value={formData.displayName}
          onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
          required
          sx={{ mb: 3 }}
        />
      )}

      <TextField
        fullWidth
        label='Bio'
        multiline
        rows={4}
        value={formData.bio}
        onChange={e =>
          setFormData(prev => ({
            ...prev,
            bio: e.target.value.slice(0, MAX_BIO_LENGTH)
          }))
        }
        helperText={`${formData.bio.length}/${MAX_BIO_LENGTH} characters`}
        sx={{ mb: 4 }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant='outlined' onClick={prevStep} sx={{ flex: 1 }}>
          Back
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={loading || (!isGoogleUser && !formData.displayName)}
          sx={{ flex: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Continue'}
        </Button>
      </Box>
    </Box>
  )
}
