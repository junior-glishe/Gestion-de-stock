import { useState } from 'react'
import { normalize } from './format'

/*
 * Aide à la recherche/filtrage des tableaux.
 *
 * Chaque ligne filtrée est un objet du type :
 *   { searchText: 'informatique ordinateur', cat: 'Informatique', st: 'low' }
 * Les touches de `filters` (hors « q ») doivent correspondre exactement.
 */

export function useFilters(initialFilters) {
  const [filters, setFilters] = useState(initialFilters)

  const setSearch = (query) => setFilters((prev) => ({ ...prev, q: query }))
  const setSelect = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const reset = () => setFilters(initialFilters)

  return { filters, setSearch, setSelect, reset }
}

export const rowMatches = (row, filters) => {
  const query = normalize(filters.q).trim()
  if (query && !normalize(row.searchText).includes(query)) return false

  return Object.entries(filters).every(
    ([key, value]) => key === 'q' || !value || row[key] === value,
  )
}
