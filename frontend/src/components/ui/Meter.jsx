/* Ligne « libellé / valeur » des cartes de répartition. */

export default function Meter({ label, value, tone = '' }) {
  return (
    <div className={`mrow ${tone}`}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  )
}
