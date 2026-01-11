import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Check for required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('- VITE_SUPABASE_URL is not set');
  if (!supabaseKey) console.error('- VITE_SUPABASE_ANON_KEY is not set');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="terminal-ui-theme">
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
