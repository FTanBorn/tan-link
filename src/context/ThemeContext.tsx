// src/context/ThemeContext.tsx
'use client'
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeContext = createContext({
  toggleTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5'
          },
          secondary: {
            main: '#EC4899',
            light: '#F472B6',
            dark: '#DB2777'
          },
          background: {
            default: mode === 'light' ? '#F0F4FF' : '#0F172A',
            paper: mode === 'light' ? '#FFFFFF' : '#1E293B'
          },
          success: {
            main: '#10B981'
          },
          error: {
            main: '#EF4444'
          },
          warning: {
            main: '#F59E0B'
          },
          info: {
            main: '#3B82F6'
          }
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background:
                  mode === 'light'
                    ? 'linear-gradient(135deg, #F0F4FF 0%, #F5F7FF 100%)'
                    : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                minHeight: '100vh'
              }
            }
          }
        }
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
