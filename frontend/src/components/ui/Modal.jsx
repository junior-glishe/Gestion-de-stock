import { IconClose, IconEdit } from '../../lib/icons'

/* Fenêtre modale réutilisée pour les formulaires et les confirmations. */
export default function Modal({ modal, onClose }) {
  if (!modal) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    const shouldClose = await modal.onSubmit?.(event.currentTarget)
    if (shouldClose !== false) onClose()
  }

  return (
    <div className="mdl on">
      <div className="mdl-bd" onClick={onClose} />
      <div
        className={`mdl-cd${modal.danger ? ' warn' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={modal.title}
      >
        <header className="mdl-hd">
          <span className="ic">{modal.icon || <IconEdit />}</span>
          <div>
            <h3>{modal.title}</h3>
            {modal.sub ? <p>{modal.sub}</p> : null}
          </div>
          <button type="button" className="ic-btn" onClick={onClose} aria-label="Fermer">
            <IconClose />
          </button>
        </header>

        <form className="mdl-form" onSubmit={handleSubmit}>
          {modal.body}

          <div className="mdl-ft">
            <button type="button" className="btn btn-g btn-md" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={`btn btn-${modal.danger ? 'd' : 'p'} btn-md`}>
              {modal.ok || 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
