import { ThemeProvider } from '@/context/ThemeContext'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
