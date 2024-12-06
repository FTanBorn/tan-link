'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  Alert,
  Snackbar,
  Fab
} from '@mui/material'
import { Check as CheckIcon, Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { themePresets, ThemePreset } from '@/types/theme'
import PreviewCard from './components/PreviewCard'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { platformIcons } from '../links/components/constants'

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
}

const DefaultThemeCard = ({ selected, onClick }: { selected: boolean; onClick: () => void }) => (
  <Grid item xs={6} sm={4}>
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: { xs: 180, md: 220 },
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <CheckIcon sx={{ color: 'white' }} />
        </Box>
      )}

      <Box sx={{ height: '60%', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '80%', height: '100%', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(platformIcons)
            .slice(0, 2)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([platform, info], i) => (
              <Box
                key={i}
                sx={{
                  height: 24,
                  bgcolor: info.bgColor,
                  color: info.color,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {info.icon}
              </Box>
            ))}
        </Box>
      </Box>

      <CardContent>
        <Typography align='center' sx={{ fontWeight: selected ? 'bold' : 'medium' }}>
          Default Style
        </Typography>
      </CardContent>
    </Card>
  </Grid>
)

export default function ThemeStep() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [links, setLinks] = useState<Link[]>([])

  useEffect(() => {
    if (!user) return

    const loadUserData = async () => {
      try {
        // Kullanıcı temasını çek
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.theme) {
            const userTheme = themePresets.find(t => t.id === userData.theme.id)
            setSelectedTheme(userTheme || null)
          }
        }

        // Linkleri çek
        const linksRef = collection(db, `users/${user.uid}/links`)
        const linksSnapshot = await getDocs(linksRef)
        const linksData = linksSnapshot.docs
          .map(
            doc =>
              ({
                id: doc.id,
                ...doc.data()
              } as Link)
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0))

        setLinks(linksData)
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Failed to load user settings')
      }
    }

    loadUserData()
  }, [user])

  const handleThemeChange = async (newTheme: ThemePreset | null) => {
    // Tema tiplerini kontrol et
    if (newTheme) {
      const isValidButtonType = ['solid', 'outline', 'soft', 'gradient', 'neon', 'glass'].includes(
        newTheme.buttonStyle.type
      )
      const isValidBackgroundType = ['solid', 'gradient', 'glass'].includes(newTheme.backgroundStyle.type)

      if (!isValidButtonType || !isValidBackgroundType) {
        console.error('Invalid theme type')
        setError('Invalid theme configuration')
        return
      }
    }

    setSelectedTheme(newTheme)

    if (!user) return
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        theme: newTheme ? { ...newTheme } : null
      })

      if (isMobile && newTheme) {
        setPreviewOpen(true)
      }
    } catch (err) {
      console.error('Error saving theme:', err)
      setError('Failed to save theme settings')
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom fontWeight='bold'>
          Choose Your Theme
        </Typography>
        <Typography variant='subtitle2' color='text.secondary'>
          Select a theme that represents your style
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Grid container spacing={1}>
              <DefaultThemeCard selected={selectedTheme === null} onClick={() => handleThemeChange(null)} />
              {themePresets.map(themeItem => (
                <Grid item xs={6} sm={4} key={themeItem.id}>
                  <Card
                    onClick={() => handleThemeChange(themeItem)}
                    sx={{
                      cursor: 'pointer',
                      height: { xs: 180, md: 220 },
                      position: 'relative',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      border: selectedTheme?.id === themeItem.id ? 2 : 1,
                      borderColor: selectedTheme?.id === themeItem.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    {selectedTheme?.id === themeItem.id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}
                      >
                        <CheckIcon sx={{ color: 'white' }} />
                      </Box>
                    )}

                    <Box
                      sx={{
                        height: '60%',
                        background: themeItem.backgroundStyle.value,
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          width: '80%',
                          height: '100%',
                          bgcolor: themeItem.cardBackground,
                          borderRadius: themeItem.buttonStyle.style.borderRadius,
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}
                      >
                        {[...Array(2)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              height: 24,
                              ...themeItem.buttonStyle.style,
                              '&:hover': undefined
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <CardContent>
                      <Typography
                        align='center'
                        sx={{
                          fontWeight: selectedTheme?.id === themeItem.id ? 'bold' : 'medium'
                        }}
                      >
                        {themeItem.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {!isMobile && (
            <Grid item md={5}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Typography variant='h6' gutterBottom>
                  Preview
                </Typography>
                <PreviewCard links={links} theme={selectedTheme} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {isMobile && (
        <Fab color='primary' sx={{ position: 'fixed', bottom: 80, right: 16 }} onClick={() => setPreviewOpen(true)}>
          <VisibilityIcon />
        </Fab>
      )}

      <Dialog fullScreen={isMobile} open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth='sm' fullWidth>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <PreviewCard links={links} theme={selectedTheme} />
        </DialogContent>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity='error' onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
