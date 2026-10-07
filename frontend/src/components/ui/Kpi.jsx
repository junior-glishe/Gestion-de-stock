/* Indicateur clé (KPI) avec icône, valeur et libellé. */

export default function Kpi({ label, value, sub, icon, tone = '', small = false, mini = false }) {
  if (mini) {
    return (
      <article className="kpi mini">
        <span className="ic">{icon}</span>
        <span className="tx">
          <span className="lb">{label}</span>
          <p className="vl">{value}</p>
        </span>
      </article>
    )
  }

  return (
    <article className={`kpi ${tone}`}>
      <div className="top">
        <span className="ic">{icon}</span>
        <span className="lb">{label}</span>
      </div>
      <p className={`vl${small ? ' sm' : ''}`}>{value}</p>
      {sub ? <p className="ks">{sub}</p> : null}
    </article>
  )
}
