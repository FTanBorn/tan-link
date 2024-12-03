// src/context/ProfileThemeContext.tsx
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface ProfileTheme {
  backgroundColor: string
  cardBackground: string
  textColor: string
}

interface ProfileThemeContextType {
  theme: ProfileTheme
  updateTheme: (newTheme: Partial<ProfileTheme>) => void
}

const defaultTheme: ProfileTheme = {
  backgroundColor: '#f0f2f5',
  cardBackground: '#ffffff',
  textColor: '#000000'
}

const ProfileThemeContext = createContext<ProfileThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {}
})

export function ProfileThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ProfileTheme>(defaultTheme)

  const updateTheme = (newTheme: Partial<ProfileTheme>) => {
    setTheme(prev => ({ ...prev, ...newTheme }))
  }

  const muiTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: theme.backgroundColor,
            color: theme.textColor
          }
        }
      }
    }
  })

  return (
    <ProfileThemeContext.Provider value={{ theme, updateTheme }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ProfileThemeContext.Provider>
  )
}

export const useProfileTheme = () => useContext(ProfileThemeContext)
