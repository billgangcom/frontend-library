import { atom } from '@reatom/framework'
import { useAtom } from '@reatom/npm-react'

import { Auth } from '../auth/index.js'
import { tokenAtom } from '../auth/model.js'
import { Sidebar } from '../components/sidebar/index.js'
import { Balance } from '../pages/balance/index.js'
import { Home } from '../pages/home/index.js'
import { Orders } from '../pages/orders/index.js'
import { Rewards } from '../pages/rewards/index.js'
import { Routes } from './routes.js'
import '../tailwind/index.css'
// const Template = () => <div>Template</div>

export const routeAtom = atom<Routes>(Routes.Home)
const RouteToRouteComponent: Record<Routes, React.FunctionComponent> = {
  [Routes.Home]: Home,
  // [Routes.Favorites]: Template,
  [Routes.Orders]: Orders,
  [Routes.Rewards]: Rewards,
  [Routes.Balance]: Balance,
  // [Routes.Tickets]: Template,
}

const App = () => {
  const [token] = useAtom(tokenAtom)
  const [route] = useAtom(routeAtom)
  const ContentComponent = RouteToRouteComponent[route]

  // if (!token) {
  //   return <Auth />
  // }

  return (
    <main className="h-full flex flex-grow flex-col xl:flex-row">
      <Sidebar />
      <div className="xl:p-6 xl:pr-10 px-4 py-6 flex flex-col max-w-[1120px] w-full flex-1">
        <ContentComponent />
      </div>
    </main>
  )
}
export default App
