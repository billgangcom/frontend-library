import { reatomComponent, useAtom } from '@reatom/npm-react'
import { routeAtom } from '../../app/index.js'
import { Routes } from '../../app/routes.js'
import {
  Dollar,
  Heart,
  Home,
  Logout,
  Medal,
  Question,
  Wallet,
} from '../../assets/icons.js'
import { IconWrapper } from '../../common/icon-wrapper.js'

const sidebarItems: [Routes, React.FunctionComponent][] = [
  [Routes.Home, Home],
  [Routes.Favorites, Heart],
  [Routes.Orders, Dollar],
  [Routes.Rewards, Medal],
  [Routes.Balance, Wallet],
  [Routes.Tickets, Question],
]

interface NavItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const NavItem = ({ children, className = '', onClick }: NavItemProps) => (
  <button
    type="button"
    className={`xl:border-none flex cursor-pointer items-center py-3 pl-2 pr-4 xl:pr-0 border-b border-transparent ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

const NavList = reatomComponent(({ ctx }) => {
  const [route] = useAtom(routeAtom)

  const handleLogout = () => {
    // logout logic here
  }

  return (
    <div className="xl:block flex overflow-x-auto">
      {sidebarItems.map(([text, Icon]) => {
        const isActive = text === route
        return (
          <NavItem
            key={text}
            onClick={() => routeAtom(ctx, text)}
            className={`flex-1 ${
              isActive
                ? 'xl:rounded-xl xl:bg-surface0 text-textPrimary !border-textPrimary'
                : 'text-textSecondary'
            }`}
          >
            <div className="mr-2">
              <IconWrapper
                Icon={Icon}
                color={isActive ? 'textPrimary' : 'textSecondary'}
              />
            </div>
            <div>{text}</div>
          </NavItem>
        )
      })}
      <NavItem
        className="text-signalDanger lg:mt-[6px] text-nowrap"
        onClick={handleLogout}
      >
        <div className="mr-2">
          <IconWrapper Icon={Logout} color="signalDanger" size="s" />
        </div>
        <div>Log out</div>
      </NavItem>
    </div>
  )
})

export default NavList
