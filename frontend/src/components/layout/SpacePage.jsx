import { Navigate, useParams } from 'react-router-dom'
import { SPACES, findSpaceItem } from '../../data/navigation'
import { PAGE_COMPONENTS } from '../../pages/app'

/* Affiche la page demandée dans l'espace courant (sinon renvoie au tableau de bord). */
export default function SpacePage({ role }) {
  const { page } = useParams()
  const space = SPACES[role]

  if (!findSpaceItem(role, page)) {
    return <Navigate to={`/${role}/${space.defaultPage}`} replace />
  }

  const Page = PAGE_COMPONENTS[page]
  return <Page />
}
