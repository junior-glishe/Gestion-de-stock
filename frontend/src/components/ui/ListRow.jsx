/* Ligne de liste : icône, texte principal, sous-texte et élément à droite. */

export default function ListRow({ icon, tone = '', title, sub, right }) {
  return (
    <div className="lst-i">
      <span className={`ic ${tone}`}>{icon}</span>
      <span className="tx">
        <b>{title}</b>
        {sub ? <span>{sub}</span> : null}
      </span>
      {right}
    </div>
  )
}
