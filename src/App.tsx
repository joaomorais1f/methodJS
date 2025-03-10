import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Router } from './pages/routes'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Method 24/7/30" />
      <Toaster richColors />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </HelmetProvider>
  )
}
