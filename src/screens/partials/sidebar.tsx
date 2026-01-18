import { useAtom } from "jotai";
import { appPage } from "@/store/jotai.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarChart,
  faBars,
  faClipboardList,
  faGear, faLineChart,
  faList, faLock,
  faMotorcycle,
  faStore,
  faUtensils, faWarehouse, faWrench,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/common/input/button.tsx";
import { CSSProperties } from "react";
import {NavLink, useNavigate} from "react-router";
import {
  ADMIN,
  CLOSING,
  CLOCK,
  DELIVERY,
  INVENTORY,
  KITCHEN,
  LOGIN,
  MENU,
  ORDERS,
  REPORTS,
  SETTINGS,
  SUMMARY
} from "@/routes/posr.ts";

export const Sidebar = () => {
  const [page, setPage] = useAtom(appPage);

  const pathInfo = location.pathname;

  const navigation = useNavigate();

  const logout = () => {
    setPage(prev => ({
      ...prev,
      page: 'Login',
      user: undefined
    }));

    navigation(LOGIN);
  }

  const lock = () => {
    setPage(prev => ({
      ...prev,
      page: 'Login',
      locked: true,
      lockedBy: prev.user
    }));

    navigation(LOGIN);
  }

  const allSidebarItems = [
    { title: 'Menu', icon: <FontAwesomeIcon icon={faBars} size="lg"/>, link: MENU, role: 'Menu' },
    { title: 'Orders', icon: <FontAwesomeIcon icon={faList} size="lg"/>, link: ORDERS, role: 'Orders' },
    { title: 'Summary', icon: <FontAwesomeIcon icon={faClipboardList} size="lg"/>, link: SUMMARY, role: 'Orders' },
    { title: 'Kitchen', icon: <FontAwesomeIcon icon={faUtensils} size="lg"/>, link: KITCHEN, role: 'Kitchen' },
    { title: 'Delivery', icon: <FontAwesomeIcon icon={faMotorcycle} size="lg"/>, link: DELIVERY, role: 'Delivery' },
    { title: 'Closing', icon: <FontAwesomeIcon icon={faStore} size="lg"/>, link: CLOSING, role: 'Closing' },
    { title: 'Inventory', icon: <FontAwesomeIcon icon={faWarehouse} size="lg"/>, link: INVENTORY, role: 'Admin' },
    { title: 'Manage', icon: <FontAwesomeIcon icon={faGear} size="lg"/>, link: ADMIN, role: 'Admin' },
    { title: 'Reports', icon: <FontAwesomeIcon icon={faLineChart} size="lg"/>, link: REPORTS, role: 'Reports' },
  ];

  // Filter sidebar items based on user roles
  const userRoles = page.user?.roles || [];
  const sidebarItems = allSidebarItems.filter(item => {
    // If user has no roles, show nothing (or you could show all if that's the desired behavior)
    if (userRoles.length === 0) {
      return false;
    }
    // Check if user has the required role for this item
    return userRoles.includes(item.role);
  });

  return (
    <div className="flex flex-col justify-between h-screen items-center sidebar border border-y-0 border-white bg-white/50 backdrop-blur">
      <div className="w-full">
        <div className="p-2 flex flex-col">
          {sidebarItems.map(item => (
            <NavLink
              to={item.link}
              className={cn(
                'flex flex-col text-center cursor-pointer p-[0.4rem] gap-1 rounded-xl pressable no-underline',
                pathInfo === item.link ? 'shadow-xl bg-gradient' : 'text-neutral-900 border-[3px] border-transparent'
              )}
              key={item.title}
              style={{
                '--padding': '0.4rem'
              } as CSSProperties}
            >
              <span className="icon">{item.icon}</span>
              <span className="label text-[12px]">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="input-group">
          <NavLink
            to={SETTINGS}
            className={cn(
              'btn btn-secondary',
            )}
            key={'settings'}
            style={{
              '--padding': '0.5rem'
            } as CSSProperties}
          >
            <FontAwesomeIcon icon={faWrench} />
          </NavLink>
          <NavLink
            to={CLOCK}
            className={cn(
              'btn btn-secondary',
            )}
            style={{
              '--padding': '0.5rem'
            } as CSSProperties}
          >
            <FontAwesomeIcon icon={faClock} />
          </NavLink>
        </div>
        <Button variant="primary" onClick={lock} flat>
          <FontAwesomeIcon icon={faLock} />
        </Button>
        <Button variant="danger" onClick={logout} flat>Logout</Button>
      </div>
    </div>
  )
}
