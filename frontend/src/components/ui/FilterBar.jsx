import { IconReset, IconSearch } from '../../lib/icons'

/* Barre de recherche, filtres de liste et compteur de lignes. */

export default function FilterBar({
  searchPlaceholder = 'Rechercher…',
  selects = [],
  filters,
  onSearch,
  onSelect,
  onReset,
  shown,
  total,
}) {
  return (
    <div className="fb">
      <label className="fb-search">
        <IconSearch />
        <input
          className="inp"
          type="search"
          value={filters.q}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Rechercher"
        />
      </label>

      {selects.map((select) => (
        <select
          key={select.key}
          className="sel"
          value={filters[select.key]}
          onChange={(event) => onSelect(select.key, event.target.value)}
          aria-label={select.label}
        >
          {select.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      <span className={`fb-count${shown ? '' : ' zero'}`}>
        {shown} / {total} {total > 1 ? 'lignes' : 'ligne'}
      </span>

      <button type="button" className="btn btn-g btn-sm" onClick={onReset}>
        <IconReset />
        Réinitialiser
      </button>
    </div>
  )
}
