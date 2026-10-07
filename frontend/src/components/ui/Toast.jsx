import { IconAlert, IconCheck } from '../../lib/icons'

/* Notification éphémère affichée en bas d'écran. */
export default function Toast({ toast }) {
  if (!toast) return null

  return (
    <div
      className={`toast show${toast.error ? ' err' : ''}`}
      role="status"
      aria-live="polite"
    >
      {toast.error ? <IconAlert /> : <IconCheck />}
      <span>{toast.message}</span>
    </div>
  )
}
