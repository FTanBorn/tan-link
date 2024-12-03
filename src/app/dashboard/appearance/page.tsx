// src/app/dashboard/appearance/page.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Slider
} from '@mui/material'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import { ColorLens, Palette, FormatPaint, Save as SaveIcon } from '@mui/icons-material'
import { ButtonStyle, BackgroundStyle, ThemeSettings, buttonPresets, backgroundPresets } from '@/types/theme'

const defaultTheme: ThemeSettings = {
  backgroundColor: '#f0f2f5',
  cardBackground: '#ffffff',
  textColor: '#000000',
  buttonStyle: {
    type: 'solid',
    style: {
      borderRadius: '8px',
      background: 'primary.main'
    }
  },
  backgroundStyle: {
    type: 'solid',
    value: '#f0f2f5'
  }
}

export default function AppearancePage() {
  const { user } = useAuth()
  const [currentTheme, setCurrentTheme] = useState<ThemeSettings>(defaultTheme)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Gradient ayarları için state
  const [gradientColors, setGradientColors] = useState(['#6366F1', '#818CF8'])
  const [gradientAngle, setGradientAngle] = useState(135)

  // Background blur için state
  const [backgroundBlur, setBackgroundBlur] = useState(0)

  useEffect(() => {
    const loadTheme = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists() && userDoc.data().theme) {
          setCurrentTheme(userDoc.data().theme)
        }
      } catch (err) {
        console.error('Error loading theme:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTheme()
  }, [user])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleBackgroundStyleChange = (style: BackgroundStyle) => {
    setCurrentTheme(prev => ({
      ...prev,
      backgroundStyle: style
    }))
  }

  const handleButtonStyleChange = (style: ButtonStyle) => {
    setCurrentTheme(prev => ({
      ...prev,
      buttonStyle: style
    }))
  }

  const updateGradientBackground = () => {
    const gradientValue = `linear-gradient(${gradientAngle}deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`
    handleBackgroundStyleChange({
      type: 'gradient',
      value: gradientValue
    })
  }

  const saveTheme = async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        theme: currentTheme
      })
      setMessage({ type: 'success', text: 'Theme saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save theme' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Appearance Settings
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Controls */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab icon={<ColorLens />} label='Colors' />
              <Tab icon={<FormatPaint />} label='Background' />
              <Tab icon={<Palette />} label='Buttons' />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Background Color'
                    type='color'
                    value={currentTheme.backgroundColor}
                    onChange={e =>
                      setCurrentTheme(prev => ({
                        ...prev,
                        backgroundColor: e.target.value
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Card Background'
                    type='color'
                    value={currentTheme.cardBackground}
                    onChange={e =>
                      setCurrentTheme(prev => ({
                        ...prev,
                        cardBackground: e.target.value
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Text Color'
                    type='color'
                    value={currentTheme.textColor}
                    onChange={e =>
                      setCurrentTheme(prev => ({
                        ...prev,
                        textColor: e.target.value
                      }))
                    }
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant='h6' gutterBottom>
                  Background Style
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Gradient Colors</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        type='color'
                        value={gradientColors[0]}
                        onChange={e => {
                          setGradientColors([e.target.value, gradientColors[1]])
                          updateGradientBackground()
                        }}
                      />
                      <TextField
                        type='color'
                        value={gradientColors[1]}
                        onChange={e => {
                          setGradientColors([gradientColors[0], e.target.value])
                          updateGradientBackground()
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Gradient Angle</Typography>
                    <Slider
                      value={gradientAngle}
                      min={0}
                      max={360}
                      onChange={(_, value) => {
                        setGradientAngle(value as number)
                        updateGradientBackground()
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Background Blur</Typography>
                    <Slider
                      value={backgroundBlur}
                      min={0}
                      max={20}
                      onChange={(_, value) => {
                        setBackgroundBlur(value as number)
                        if (currentTheme.backgroundStyle.type === 'glass') {
                          handleBackgroundStyleChange({
                            ...currentTheme.backgroundStyle,
                            blur: value as number
                          })
                        }
                      }}
                    />
                  </Grid>
                  {/* Background style presets */}
                  <Grid item xs={12}>
                    <Typography variant='subtitle1' gutterBottom>
                      Background Presets
                    </Typography>
                    <Grid container spacing={1}>
                      {Object.entries(backgroundPresets).map(([key, preset]) => (
                        <Grid item xs={4} key={key}>
                          <Card
                            onClick={() => handleBackgroundStyleChange(preset)}
                            sx={{
                              cursor: 'pointer',
                              height: 100,
                              background: preset.value,
                              '&:hover': { opacity: 0.9 }
                            }}
                          >
                            <CardContent>
                              <Typography variant='caption' sx={{ color: 'white' }}>
                                {key}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant='h6' gutterBottom>
                  Button Style
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(buttonPresets).map(([key, preset]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Button
                        fullWidth
                        variant='contained'
                        onClick={() => handleButtonStyleChange(preset)}
                        sx={{
                          ...preset.style,
                          height: '50px'
                        }}
                      >
                        {key}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant='contained' startIcon={<SaveIcon />} onClick={saveTheme} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Grid>

        {/* Preview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant='h6' gutterBottom>
              Preview
            </Typography>
            <Box
              sx={{
                height: 400,
                background: currentTheme.backgroundStyle?.value || currentTheme.backgroundColor,
                p: 2,
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Paper
                sx={{
                  bgcolor: currentTheme.cardBackground,
                  color: currentTheme.textColor,
                  p: 3,
                  height: '100%'
                }}
              >
                <Typography variant='h6' gutterBottom>
                  Sample Profile
                </Typography>
                {[1, 2, 3].map(i => (
                  <Button
                    key={i}
                    fullWidth
                    sx={{
                      ...currentTheme.buttonStyle.style,
                      mb: 1
                    }}
                  >
                    Sample Button {i}
                  </Button>
                ))}
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
