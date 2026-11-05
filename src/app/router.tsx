import { createBrowserRouter, type RouteObject } from 'react-router'
import { RequireAuth } from '../auth/RequireAuth'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { RouteErrorPage } from '../pages/RouteErrorPage'
import { RootLayout } from './RootLayout'
import { screens } from './screens'

const toRoute = (screen: (typeof screens)[number]): RouteObject => ({
  path: screen.path,
  element: <PlaceholderPage title={screen.title} ticket={screen.ticket} />,
})

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      ...screens.filter((screen) => !screen.auth).map(toRoute),
      {
        element: <RequireAuth />,
        children: [{ index: true, element: <HomePage /> }, ...screens.filter((screen) => screen.auth).map(toRoute)],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
