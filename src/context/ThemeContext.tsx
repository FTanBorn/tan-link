'use client'
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface ThemeContextType {
  toggleTheme: () => void
  isDarkMode: boolean
  theme: ReturnType<typeof createTheme>
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDarkMode: false,
  theme: createTheme()
})

const lightPalette = {
  primary: {
    main: '#2563EB', // Daha canlı mavi
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#EC4899', // Pembe
    light: '#F472B6',
    dark: '#DB2777',
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#F0F4FF', // Açık mavi-gri
    paper: '#FFFFFF' // Beyaz
  },
  text: {
    primary: '#1E293B', // Koyu slate
    secondary: '#64748B' // Orta slate
  },
  divider: 'rgba(0, 0, 0, 0.1)',
  success: { main: '#10B981' }, // Yeşil
  error: { main: '#EF4444' }, // Kırmızı
  warning: { main: '#F59E0B' }, // Turuncu
  info: { main: '#3B82F6' } // Mavi
}

const darkPalette = {
  primary: {
    main: '#6366F1', // İndigo
    light: '#818CF8',
    dark: '#4F46E5',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#EC4899', // Pembe (aynı)
    light: '#F472B6',
    dark: '#DB2777',
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#0F172A', // Çok koyu lacivert
    paper: '#1E293B' // Koyu lacivert
  },
  text: {
    primary: '#E2E8F0', // Açık gri
    secondary: '#94A3B8' // Orta gri
  },
  divider: 'rgba(255, 255, 255, 0.1)',
  success: { main: '#10B981' }, // Yeşil (aynı)
  error: { main: '#EF4444' }, // Kırmızı (aynı)
  warning: { main: '#F59E0B' }, // Turuncu (aynı)
  info: { main: '#3B82F6' } // Mavi (aynı)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(() => {
    const currentPalette = mode === 'light' ? lightPalette : darkPalette

    return createTheme({
      palette: {
        mode,
        ...currentPalette
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 }
      },
      shape: {
        borderRadius: 12
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background:
                mode === 'light'
                  ? 'linear-gradient(135deg, #F0F4FF 0%, #F5F7FF 100%)'
                  : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              minHeight: '100vh',
              transition: 'background-color 0.3s ease'
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '10px',
              fontWeight: 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)'
              }
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '16px',
              transition: 'all 0.2s ease-in-out'
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              transition: 'all 0.2s ease-in-out'
            }
          }
        }
      }
    })
  }, [mode])

  const contextValue = useMemo(
    () => ({
      toggleTheme,
      isDarkMode: mode === 'dark',
      theme
    }),
    [mode, theme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
