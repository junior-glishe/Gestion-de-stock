import { IconSearch } from '../../lib/icons'

/*
 * Tableau générique.
 * - `columns` : tableau de titres de colonnes
 * - `rows` : [{ key, cells: [noeudReact, …] }]
 */

export default function DataTable({ columns, rows, empty = 'Aucun résultat pour ces critères.', icon }) {
  return (
    <div className="tw">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column} className={index === 0 ? 'sticky-col' : ''}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td key={index} className={index === 0 ? 'sticky-col' : ''}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr className="empty">
              <td colSpan={columns.length}>
                <span className="em">
                  {icon || <IconSearch />}
                  {empty}
                </span>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
