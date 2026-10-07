/* Formatage et petites aides réutilisées partout dans l'application. */

export const formatNumber = (value) => Number(value).toLocaleString('fr-FR')

export const formatMoney = (value) => `${formatNumber(value)} FCFA`

export const today = () => new Date().toLocaleDateString('fr-FR')

export const isLowStock = (product) => product.quantite <= product.seuil

export const normalize = (text) =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const initials = (name) =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

export const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || ''

export const longDate = () => {
  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return date.charAt(0).toUpperCase() + date.slice(1)
}

export const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}
