interface ButtonStyle {
  type: string
  style: {
    borderRadius: string
    background: string
    color: string
    border?: string
    backdropFilter?: string
    boxShadow?: string
  }
}

interface BackgroundStyle {
  type: string
  value: string
  blur?: number
}

export interface ThemePreset {
  id: string
  name: string
  backgroundColor: string
  cardBackground: string
  textColor: string
  buttonStyle: ButtonStyle
  backgroundStyle: BackgroundStyle
}

export const themePresets: ThemePreset[] = [
  {
    id: 'modern-light',
    name: 'Modern Light',
    backgroundColor: '#f0f2f5',
    cardBackground: '#ffffff',
    textColor: '#000000',
    buttonStyle: {
      type: 'gradient',
      style: {
        borderRadius: '8px',
        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #F0F4FF 0%, #F5F7FF 100%)'
    }
  },
  {
    id: 'dark-glass',
    name: 'Dark Glass',
    backgroundColor: '#1a1a1a',
    cardBackground: 'rgba(45,45,45,0.8)',
    textColor: '#ffffff',
    buttonStyle: {
      type: 'glass',
      style: {
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #2C3E50 0%, #000000 100%)',
      blur: 10
    }
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    backgroundColor: '#0a0a0a',
    cardBackground: 'rgba(20,20,20,0.9)',
    textColor: '#ffffff',
    buttonStyle: {
      type: 'neon',
      style: {
        borderRadius: '8px',
        background: 'transparent',
        border: '2px solid #00ff88',
        color: '#00ff88',
        boxShadow: '0 0 10px #00ff8855'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
    }
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    backgroundColor: '#fef6ff',
    cardBackground: '#ffffff',
    textColor: '#4a4a4a',
    buttonStyle: {
      type: 'soft',
      style: {
        borderRadius: '12px',
        background: '#ffecf8',
        color: '#d44d9c'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #ffecf8 0%, #f7e5ff 100%)'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    backgroundColor: '#e3f2fd',
    cardBackground: '#ffffff',
    textColor: '#1e3a5c',
    buttonStyle: {
      type: 'gradient',
      style: {
        borderRadius: '8px',
        background: 'linear-gradient(45deg, #4FC3F7, #29B6F6)',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
    }
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    backgroundColor: '#ffffff',
    cardBackground: '#fafafa',
    textColor: '#000000',
    buttonStyle: {
      type: 'outline',
      style: {
        borderRadius: '4px',
        background: 'transparent',
        border: '1px solid #000000',
        color: '#000000'
      }
    },
    backgroundStyle: {
      type: 'solid',
      value: '#ffffff'
    }
  }
]

export type { ButtonStyle, BackgroundStyle }
