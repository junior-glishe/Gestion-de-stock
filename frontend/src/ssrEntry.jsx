import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import Landing from './pages/marketing/Landing'

export const renderLanding = () =>
  renderToString(
    <MemoryRouter initialEntries={['/']}>
      <Landing />
    </MemoryRouter>,
  )
