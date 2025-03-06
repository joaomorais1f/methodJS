import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

import { Router } from './pages/routes'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Method" />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </HelmetProvider>
  )
}
