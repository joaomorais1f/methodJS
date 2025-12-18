import { Helmet, HelmetProvider } from 'react-helmet-async'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from './components/theme/theme-provider'
import { Router } from './pages/routes'

export function App() {
  return (
    <HashRouter>
      <HelmetProvider>
        <ThemeProvider storageKey="method-24/7/30:Theme" defaultTheme="dark">
          <Helmet titleTemplate="%s | Method 24/7/30" />
          <Toaster richColors />
            <Router />
        </ThemeProvider>
      </HelmetProvider>
    </HashRouter>
  )
}
