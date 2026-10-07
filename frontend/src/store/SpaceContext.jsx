import { createContext, useContext } from 'react'
import { SPACES } from '../data/navigation'

/* Contexte de l'espace courant (gestionnaire, superviseur ou administration). */

const SpaceContext = createContext(null)

export function SpaceProvider({ role, children }) {
  return (
    <SpaceContext.Provider value={{ role, space: SPACES[role] }}>
      {children}
    </SpaceContext.Provider>
  )
}

export function useSpace() {
  const context = useContext(SpaceContext)
  if (!context) throw new Error('useSpace doit être utilisé dans <SpaceProvider>')
  return context
}
