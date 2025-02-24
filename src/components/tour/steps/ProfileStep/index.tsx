// src/components/tour/steps/ProfileStep.tsx
'use client'
import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Avatar, IconButton, Alert, CircularProgress } from '@mui/material'
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material'
import { useTour } from '@/context/TourContext'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const MAX_BIO_LENGTH = 150
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function ProfileStep() {
  const { user, updateUserPhoto } = useAuth() // updateUserPhoto fonksiyonunu çekiyoruz
  const { nextStep, prevStep, markStepCompleted } = useTour()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    photoPublicId: '',
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

      // Mevcut verileri çek
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setFormData(prev => ({
              ...prev,
              bio: userData.bio || '',
              photoURL: userData.photoURL || '',
              photoPublicId: userData.photoPublicId || ''
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

    if (file.size > MAX_FILE_SIZE) {
      setError('File size should be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Eski fotoğraf varsa sil
      if (formData.photoPublicId) {
        try {
          await fetch('/api/cloudinary?action=delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ publicId: formData.photoPublicId })
          })
        } catch (err) {
          console.error('Error deleting old photo:', err)
        }
      }

      // Yeni fotoğrafı Cloudinary'ye yükle
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/cloudinary?action=upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()

      // AuthContext'i güncelle
      await updateUserPhoto(data.secure_url, data.public_id)

      // Yerel state'i güncelle
      setFormData(prev => ({
        ...prev,
        photoURL: data.secure_url,
        photoPublicId: data.public_id
      }))
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!user || !formData.photoURL || !formData.photoPublicId) return

    setUploading(true)
    try {
      // Cloudinary'den sil
      await fetch('/api/cloudinary?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicId: formData.photoPublicId })
      })

      // AuthContext'i güncelle
      await updateUserPhoto(null, null)

      // Yerel state'i güncelle
      setFormData(prev => ({ ...prev, photoURL: '', photoPublicId: '' }))
    } catch (err) {
      console.error('Error deleting photo:', err)
      setError('Failed to delete photo')
    } finally {
      setUploading(false)
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
        photoPublicId: formData.photoPublicId,
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
