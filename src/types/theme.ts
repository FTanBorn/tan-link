// src/types/theme.ts
interface ButtonStyle {
  type: 'solid' | 'outline' | 'soft' | 'gradient' | 'rounded' | 'glass'
  style: {
    borderRadius?: string
    background?: string
    border?: string
    backdropFilter?: string
    boxShadow?: string
  }
}

interface BackgroundStyle {
  type: 'solid' | 'gradient' | 'pattern' | 'image' | 'glass'
  value: string
  overlay?: string
  blur?: number
}
interface ThemeSettings {
  backgroundColor: string
  cardBackground: string
  textColor: string
  buttonStyle: ButtonStyle
  backgroundStyle: BackgroundStyle
  backgroundImage?: string
}

const buttonPresets: Record<string, ButtonStyle> = {
  solid: {
    type: 'solid',
    style: {
      borderRadius: '8px',
      background: 'primary.main'
    }
  },
  outline: {
    type: 'outline',
    style: {
      borderRadius: '8px',
      border: '2px solid',
      background: 'transparent'
    }
  },
  soft: {
    type: 'soft',
    style: {
      borderRadius: '8px',
      background: 'rgba(var(--primary-rgb), 0.1)'
    }
  },
  gradient: {
    type: 'gradient',
    style: {
      borderRadius: '8px',
      background: 'linear-gradient(45deg, var(--primary-light) 0%, var(--primary-main) 100%)'
    }
  },
  rounded: {
    type: 'rounded',
    style: {
      borderRadius: '50px',
      background: 'primary.main'
    }
  },
  glass: {
    type: 'glass',
    style: {
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  }
}

const backgroundPresets: Record<string, BackgroundStyle> = {
  solid: {
    type: 'solid',
    value: '#f0f2f5'
  },
  gradient: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)'
  },
  pattern: {
    type: 'pattern',
    value: 'url("data:image/svg+xml,...")'
  },
  image: {
    type: 'image',
    value: '',
    overlay: 'rgba(0,0,0,0.5)'
  },
  glass: {
    type: 'glass',
    value: 'rgba(255,255,255,0.1)',
    blur: 10
  }
}

const themePresets = [
  {
    name: 'Modern Light',
    backgroundColor: '#f0f2f5',
    cardBackground: '#ffffff',
    textColor: '#000000',
    buttonStyle: buttonPresets.gradient,
    backgroundStyle: backgroundPresets.gradient
  },
  {
    name: 'Glass Dark',
    backgroundColor: '#1a1a1a',
    cardBackground: 'rgba(45,45,45,0.8)',
    textColor: '#ffffff',
    buttonStyle: buttonPresets.glass,
    backgroundStyle: backgroundPresets.glass
  }
]

export type { ButtonStyle, BackgroundStyle, ThemeSettings }

export { buttonPresets, backgroundPresets, themePresets }
