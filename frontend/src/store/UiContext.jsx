import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Toast from '../components/ui/Toast'
import Modal from '../components/ui/Modal'

/*
 * Services d'interface partagés : notifications (toast) et fenêtres modales.
 * Utilisez `const { toast, openModal, confirmAction } = useUi()`.
 */

const UiContext = createContext(null)

export function UiProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)

  const showToast = useCallback((message, options = {}) => {
    setToast({ message, error: Boolean(options.error) })
  }, [])

  const openModal = useCallback((config) => setModal(config), [])
  const closeModal = useCallback(() => setModal(null), [])

  /* Boîte de confirmation : `confirmAction({... , onConfirm})` */
  const confirmAction = useCallback(
    ({ title, sub, message, ok = 'Confirmer', onConfirm }) =>
      openModal({
        title,
        sub,
        danger: true,
        ok,
        body: <p className="mdl-txt">{message}</p>,
        onSubmit: async () => {
          await onConfirm?.()
        },
      }),
    [openModal],
  )

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!modal) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModal(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [modal])

  return (
    <UiContext.Provider value={{ toast, showToast, openModal, closeModal, confirmAction }}>
      {children}
      <Toast toast={toast} />
      <Modal modal={modal} onClose={closeModal} />
    </UiContext.Provider>
  )
}

export function useUi() {
  const context = useContext(UiContext)
  if (!context) throw new Error('useUi doit être utilisé dans <UiProvider>')
  return context
}
