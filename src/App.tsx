import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from './components/theme/theme-provider'
import { Router } from './pages/routes'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="method-24/7/30:Theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | Method 24/7/30" />
        <Toaster richColors />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
