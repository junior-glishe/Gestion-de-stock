/* Graphiques de la page Statistiques, thématisés à la charte StockPro. */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export const PALETTE = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d']

const AXIS = { fontSize: 11, fill: '#9aa3af', fontFamily: 'inherit' }
const GRID = { stroke: '#eef1f4', strokeDasharray: '3 3' }
const LINE = { stroke: '#e5e9ee' }

function Tip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      {label !== undefined && label !== null ? <p className="tl">{label}</p> : null}
      {payload.map((entry, index) => (
        <p className="tr" key={entry.dataKey || entry.name || index}>
          <span className="dot" style={{ background: entry.color || entry.fill }} />
          {entry.name}
          <b>
            {entry.value}
            {unit ? ` ${unit}` : ''}
          </b>
        </p>
      ))}
    </div>
  )
}

/* Camembert troué : part de chaque catégorie. */
export function Donut({ data, height = 230, centerValue, centerLabel, unit = '' }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div className="donut">
      <div className="donut-box" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<Tip unit={unit} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <b>{centerValue ?? total}</b>
          <span>{centerLabel}</span>
        </div>
      </div>
      <ul className="chart-legend">
        {data.map((item, index) => (
          <li key={item.name}>
            <i style={{ background: PALETTE[index % PALETTE.length] }} />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Histogramme vertical simple. */
export function Bars({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 230,
  color = '#16a34a',
  name = 'Valeur',
  unit = '',
}) {
  return (
    <div className="chrt" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 14, right: 8, left: -14, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} {...GRID} />
          <XAxis dataKey={nameKey} tickLine={false} axisLine={LINE} tick={AXIS} interval={0} minTickGap={8} />
          <YAxis tickLine={false} axisLine={false} tick={AXIS} width={46} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(22, 163, 74, .06)' }} content={<Tip unit={unit} />} />
          <Bar dataKey={dataKey} name={name} fill={color} radius={[7, 7, 0, 0]} maxBarSize={46} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Activité : entrées et sorties jour par jour. */
export function Activity({ data, height = 270 }) {
  return (
    <div className="chrt" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 14, right: 8, left: -14, bottom: 0 }} barGap={4} barCategoryGap="26%">
          <CartesianGrid vertical={false} {...GRID} />
          <XAxis dataKey="label" tickLine={false} axisLine={LINE} tick={AXIS} minTickGap={14} />
          <YAxis tickLine={false} axisLine={false} tick={AXIS} width={46} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(17, 24, 39, .04)' }} content={<Tip unit="unités" />} />
          <Bar dataKey="entree" name="Entrées" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={18} />
          <Bar dataKey="sortie" name="Sorties" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="chart-legend chart-legend-inline">
        <li>
          <i style={{ background: '#16a34a' }} />
          Entrées
        </li>
        <li>
          <i style={{ background: '#dc2626' }} />
          Sorties
        </li>
      </ul>
    </div>
  )
}
