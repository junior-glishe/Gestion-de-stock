import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'

/*
 * État global de l'application : produits, catégories, fournisseurs,
 * mouvements, alertes, inventaires et comptes.
 * Les données sont lues et modifiées via l'API NestJS.
 */

const StoreContext = createContext(null)

const EMPTY = {
  categories: [],
  products: [],
  suppliers: [],
  movements: [],
  alerts: [],
  inventories: [],
  users: [],
  journal: [],
}

export function StoreProvider({ children }) {
  const { user } = useAuth()
  const [data, setData] = useState(EMPTY)

  const refresh = useCallback(async () => {
    const [categories, products, suppliers, movements, alerts, inventories, users, journal] =
      await Promise.all([
        api.get('/categories'),
        api.get('/produits'),
        api.get('/fournisseurs'),
        api.get('/mouvements'),
        api.get('/alertes'),
        api.get('/inventaires'),
        api.get('/utilisateurs'),
        api.get('/journal-audit').catch(() => []),
      ])
    setData({ categories, products, suppliers, movements, alerts, inventories, users, journal })
  }, [])

  useEffect(() => {
    if (user) refresh().catch(() => {})
  }, [user, refresh])

  /* Effectue une action API puis recharge les données.
     Renvoie le message d'erreur à afficher, ou null si tout s'est bien passé. */
  const run = useCallback(
    async (action) => {
      try {
        await action()
        await refresh()
        return null
      } catch (error) {
        return error.message
      }
    },
    [refresh],
  )

  /* ---------- Produits ---------- */

  const addProduct = (product) => run(() => api.post('/produits', product))
  const updateProduct = (reference, product) =>
    run(() => api.put(`/produits/${encodeURIComponent(reference)}`, product))
  const deleteProduct = (reference) =>
    run(() => api.del(`/produits/${encodeURIComponent(reference)}`))

  /* ---------- Catégories ---------- */

  const addCategory = (name) => run(() => api.post('/categories', { nom: name }))
  const deleteCategory = (name) =>
    run(() => api.del(`/categories/${encodeURIComponent(name)}`))

  /* ---------- Fournisseurs ---------- */

  const addSupplier = (supplier) => run(() => api.post('/fournisseurs', supplier))
  const updateSupplier = (id, supplier) => run(() => api.put(`/fournisseurs/${id}`, supplier))
  const deleteSupplier = (id) => run(() => api.del(`/fournisseurs/${id}`))

  const nextSupplierId = () => {
    const last = data.suppliers.reduce((max, supplier) => {
      const number = Number(String(supplier.id).split('-')[1]) || 0
      return Math.max(max, number)
    }, 0)
    return `FRN-${String(last + 1).padStart(3, '0')}`
  }

  /* ---------- Mouvements (entrées / sorties) ---------- */

  const recordMovement = (movement) => run(() => api.post('/mouvements', movement))

  /* ---------- Alertes ---------- */

  const treatAlert = (id) => run(() => api.post(`/alertes/${id}/traiter`))

  /* ---------- Inventaire ---------- */

  const generateInventory = (counts) =>
    run(() =>
      api.post('/inventaires', {
        entries: counts.filter((entry) => entry.realQuantity !== ''),
      }),
    )

  /* ---------- Comptes utilisateurs ---------- */

  const addUser = (account) => run(() => api.post('/utilisateurs', account))
  const toggleUser = (email) =>
    run(() => api.patch(`/utilisateurs/${encodeURIComponent(email)}/actif`, {}))
  const deleteUser = (email) => run(() => api.del(`/utilisateurs/${encodeURIComponent(email)}`))

  /* ---------- Divers ---------- */

  const value = {
    data,
    refresh,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    nextSupplierId,
    recordMovement,
    treatAlert,
    generateInventory,
    addUser,
    toggleUser,
    deleteUser,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore doit être utilisé dans <StoreProvider>')
  return context
}
