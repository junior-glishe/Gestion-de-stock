import { createContext, useContext, useState } from 'react'
import { api, clearToken, getToken, setToken } from '../lib/api'
import { SPACES } from '../data/navigation'

/*
 * Session de l'utilisateur connecté.
 * La connexion passe par l'API : POST /api/auth/login renvoie un jeton
 * conservé dans le localStorage. Sans identifiants, le compte de
 * démonstration de l'espace demandé est utilisé.
 */

export const DEMO_PASSWORD = 'demo1234'

const STORAGE_KEY = 'stockpro_user'
const AuthContext = createContext(null)

const readStoredUser = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    // ancienne clé d'espace conservée en localStorage : superviseur
    return data?.role === 'proprietaire' ? { ...data, role: 'superviseur' } : data
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = async (spaceKey, credentials = {}) => {
    const demo = spaceKey ? SPACES[spaceKey].demoUser : null
    const { token, user: compte } = await api.post('/auth/login', {
      email: credentials.email || demo?.email,
      motDePasse: credentials.motDePasse || DEMO_PASSWORD,
    })

    // L'espace est déduit du rôle stocké en base : aucun choix d'acteur côté client.
    const account = { nom: compte.nom, email: compte.email, role: compte.espace }
    setToken(token)
    setUser(account)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
    return account
  }

  const logout = async () => {
    try {
      if (getToken()) await api.post('/auth/logout')
    } catch {
      // le jeton peut déjà être expiré : on sort quand même
    }
    clearToken()
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return context
}
