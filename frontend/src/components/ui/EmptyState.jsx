/* État vide d'une liste ou d'un tableau. */

export default function EmptyState({ icon, children }) {
  return (
    <div className="empty">
      {icon}
      <p>{children}</p>
    </div>
  )
}
