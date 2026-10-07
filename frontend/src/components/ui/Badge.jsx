/* Pastille de statut : ok, bad, info, warn ou off. */

export default function Badge({ tone = 'ok', children }) {
  return <span className={`bdg ${tone}`}>{children}</span>
}
