import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaProtegida from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'

// Páginas públicas
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Termos from './pages/Termos'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import PaginaNaoEncontrada from './pages/NotFound'

// Páginas protegidas
import Usuarios from './pages/Users'
import UserForm from './pages/UserForm'
import PasswordEditForm from './pages/PasswordEditForm'
import Setores from './pages/Setores'
import SetorForm from './pages/SetorForm'
import AbrirChamado from './pages/AbrirChamado'
import MeusChamados from './pages/MeusChamados'
import DetalheChamado from './pages/DetalheChamado'
import EditarChamado from './pages/EditarChamado'
import Kanban from './pages/Kanban'
import ConfigurarKanban from './pages/ConfigurarKanban'
import ConfigurarCampos from './pages/ConfigurarCampos'
import Notificacoes from './pages/Notificacoes'
import ConfigurarPerfil from './pages/ConfigurarPerfil'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login"           element={<Login />} />
        <Route path="/cadastro"        element={<Cadastro />} />
        <Route path="/termos"          element={<Termos />} />
        <Route path="/esqueci-senha"   element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        {/* Rotas protegidas */}
        <Route path="/" element={<RotaProtegida><Layout /></RotaProtegida>}>
          <Route index element={<Navigate to="/kanban" replace />} />

          {/* Usuários — Admin */}
          <Route path="usuarios"                           element={<AdminRoute><Usuarios /></AdminRoute>} />
          <Route path="usuarios/cadastrar"                 element={<AdminRoute><UserForm /></AdminRoute>} />
          <Route path="usuarios/editar-senha/:email"       element={<AdminRoute><PasswordEditForm /></AdminRoute>} />

          {/* Setores — Gerência+ */}
          <Route path="setores"                            element={<Setores />} />
          <Route path="setores/novo"                       element={<SetorForm />} />
          <Route path="setores/editar/:id"                 element={<SetorForm />} />

          {/* Chamados — todos os autenticados */}
          <Route path="chamados"                           element={<MeusChamados />} />
          <Route path="chamados/novo"                      element={<AbrirChamado />} />
          <Route path="chamados/:id"                       element={<DetalheChamado />} />
          <Route path="chamados/:id/editar"                element={<EditarChamado />} />

          {/* Kanban — Funcionário+ */}
          <Route path="kanban"                             element={<Kanban />} />

          {/* Configurações — Gerência+ */}
          <Route path="configurar/kanban"                  element={<ConfigurarKanban />} />
          <Route path="configurar/campos"                  element={<ConfigurarCampos />} />

          {/* Notificações e Perfil — todos */}
          <Route path="notificacoes"                       element={<Notificacoes />} />
          <Route path="perfil"                             element={<ConfigurarPerfil />} />
        </Route>

        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
