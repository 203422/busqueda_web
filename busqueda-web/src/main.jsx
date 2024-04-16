import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './routes/Login.jsx'
import Dashboard from './routes/Dashboard.jsx'
import './assets/styles/index.css'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },

  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/busqueda",
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
