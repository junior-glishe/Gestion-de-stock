import { Route, Routes } from 'react-router-dom'
import SpaceLayout from './components/layout/SpaceLayout'
import SpacePage from './components/layout/SpacePage'
import Landing from './pages/marketing/Landing'
import Login from './pages/marketing/Login'
import Lockout from './pages/marketing/Lockout'
import Privacy from './pages/marketing/Privacy'
import Terms from './pages/marketing/Terms'
import { SPACES } from './data/navigation'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/acces-bloque" element={<Lockout />} />
      <Route path="/confidentialite" element={<Privacy />} />
      <Route path="/conditions" element={<Terms />} />

      {Object.keys(SPACES).map((role) => (
        <Route key={role} path={`/${role}`} element={<SpaceLayout role={role} />}>
          <Route index element={<SpacePage role={role} />} />
          <Route path=":page" element={<SpacePage role={role} />} />
        </Route>
      ))}

      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
