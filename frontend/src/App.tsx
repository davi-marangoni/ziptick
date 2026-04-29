import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaProtegida from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Usuarios from './pages/Users'
import UserForm from './pages/UserForm'
import PasswordEditForm from './pages/PasswordEditForm'
import PaginaNaoEncontrada from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<AdminRoute><Usuarios /></AdminRoute>} />
          <Route path="usuarios/cadastrar" element={<AdminRoute><UserForm /></AdminRoute>} />
          <Route path="usuarios/editar-senha/:email" element={<AdminRoute><PasswordEditForm /></AdminRoute>} />
        </Route>
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
