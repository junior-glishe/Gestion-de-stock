/* Champ de formulaire : libellé + contrôle (input, select, textarea…). */

export default function Field({ label, children }) {
  return (
    <label className="fld">
      <span>{label}</span>
      {children}
    </label>
  )
}
