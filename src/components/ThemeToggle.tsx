import { useTheme } from './ThemeProvider'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded text-xs transition-terminal border border-border ${
        theme === 'dark' 
          ? 'bg-accent text-primary' 
          : 'bg-secondary text-terminal-muted hover:bg-muted'
      }`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}