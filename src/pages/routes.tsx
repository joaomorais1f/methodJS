import { Route, Routes } from 'react-router-dom'

import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { ContentLabel } from './app/contents-and-label'
import { Dashboard } from './app/dashboard'
import { Profile } from './app/profile'
import { SignIn } from './auth/sign-in'
import { SignUp } from './auth/sign-up'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contents" element={<ContentLabel />} />
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
    </Routes>
  )
}
