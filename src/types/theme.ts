export type ButtonStyleType = 'solid' | 'outline' | 'soft' | 'gradient' | 'neon' | 'glass'
export type BackgroundStyleType = 'solid' | 'gradient' | 'glass'

interface ButtonStyle {
  type: ButtonStyleType
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
  type: BackgroundStyleType
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
  },
  {
    id: 'sunset-bliss',
    name: 'Sunset Bliss',
    backgroundColor: '#ffecd2',
    cardBackground: '#ffffff',
    textColor: '#5d4037',
    buttonStyle: {
      type: 'gradient',
      style: {
        borderRadius: '12px',
        background: 'linear-gradient(45deg, #FF7E5F, #FEB47B)',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  },
  {
    id: 'forest-haven',
    name: 'Forest Haven',
    backgroundColor: '#e8f5e9',
    cardBackground: '#ffffff',
    textColor: '#2e7d32',
    buttonStyle: {
      type: 'solid',
      style: {
        borderRadius: '10px',
        background: '#81c784',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'solid',
      value: '#e8f5e9'
    }
  },
  {
    id: 'crimson-flare',
    name: 'Crimson Flare',
    backgroundColor: '#ffebee',
    cardBackground: '#ffffff',
    textColor: '#c62828',
    buttonStyle: {
      type: 'outline',
      style: {
        borderRadius: '6px',
        background: 'transparent',
        border: '2px solid #e57373',
        color: '#e57373'
      }
    },
    backgroundStyle: {
      type: 'solid',
      value: '#ffebee'
    }
  },
  {
    id: 'midnight-blues',
    name: 'Midnight Blues',
    backgroundColor: '#263238',
    cardBackground: '#37474f',
    textColor: '#ffffff',
    buttonStyle: {
      type: 'solid',
      style: {
        borderRadius: '8px',
        background: '#455a64',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'solid',
      value: '#263238'
    }
  },
  {
    id: 'amber-wave',
    name: 'Amber Wave',
    backgroundColor: '#fff8e1',
    cardBackground: '#ffffff',
    textColor: '#6d4c41',
    buttonStyle: {
      type: 'soft',
      style: {
        borderRadius: '10px',
        background: '#ffe082',
        color: '#6d4c41'
      }
    },
    backgroundStyle: {
      type: 'solid',
      value: '#fff8e1'
    }
  },
  {
    id: 'icy-calm',
    name: 'Icy Calm',
    backgroundColor: '#e3f2fd',
    cardBackground: '#ffffff',
    textColor: '#1e88e5',
    buttonStyle: {
      type: 'gradient',
      style: {
        borderRadius: '6px',
        background: 'linear-gradient(45deg, #64b5f6, #42a5f5)',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)'
    }
  },
  {
    id: 'cosmic-dream',
    name: 'Cosmic Dream',
    backgroundColor: '#2d2d44',
    cardBackground: '#3e3e5a',
    textColor: '#ffffff',
    buttonStyle: {
      type: 'neon',
      style: {
        borderRadius: '10px',
        background: 'transparent',
        border: '2px solid #7c4dff',
        color: '#7c4dff',
        boxShadow: '0 0 10px #7c4dff55'
      }
    },
    backgroundStyle: {
      type: 'solid',
      value: '#2d2d44'
    }
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    backgroundColor: '#fffde7',
    cardBackground: '#ffffff',
    textColor: '#f57f17',
    buttonStyle: {
      type: 'gradient',
      style: {
        borderRadius: '8px',
        background: 'linear-gradient(45deg, #ffb74d, #ffa726)',
        color: '#ffffff'
      }
    },
    backgroundStyle: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #fff9c4 0%, #ffecb3 100%)'
    }
  }
]

export type { ButtonStyle, BackgroundStyle }
