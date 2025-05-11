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
  faUtensils, faWrench
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/common/input/button.tsx";
import { CSSProperties } from "react";
import {NavLink} from "react-router";
import {ADMIN, CLOSING, DELIVERY, KITCHEN, MENU, ORDERS, REPORTS, SUMMARY} from "@/routes/posr.ts";

export const Sidebar = () => {
  const [page, setPage] = useAtom(appPage);

  const pathInfo = location.pathname;

  const logout = () => {
    setPage(prev => ({
      ...prev,
      page: 'Login',
      user: undefined
    }));
  }

  const lock = () => {
    setPage(prev => ({
      ...prev,
      page: 'Login',
      locked: true,
      lockedBy: prev.user
    }));
  }

  const settings = () => {

  }

  const sidebarItems = [
    { title: 'Menu', icon: <FontAwesomeIcon icon={faBars} size="lg"/>, link: MENU },
    { title: 'Orders', icon: <FontAwesomeIcon icon={faList} size="lg"/>, link: ORDERS },
    { title: 'Summary', icon: <FontAwesomeIcon icon={faClipboardList} size="lg"/>, link: SUMMARY },
    { title: 'Kitchen', icon: <FontAwesomeIcon icon={faUtensils} size="lg"/>, link: KITCHEN },
    { title: 'Delivery', icon: <FontAwesomeIcon icon={faMotorcycle} size="lg"/>, link: DELIVERY },
    { title: 'Closing', icon: <FontAwesomeIcon icon={faStore} size="lg"/>, link: CLOSING },
    { title: 'Reports', icon: <FontAwesomeIcon icon={faLineChart} size="lg"/>, link: REPORTS },
    { title: 'Admin', icon: <FontAwesomeIcon icon={faGear} size="lg"/>, link: ADMIN },
  ];

  return (
    <div className="flex flex-col justify-between h-screen items-center sidebar border border-y-0 border-white bg-white/50 backdrop-blur">
      <div className="w-full">
        <div className="p-2 flex flex-col">
          {sidebarItems.map(item => (
            <NavLink
              to={item.link}
              className={cn(
                'flex flex-col text-center cursor-pointer p-[0.5rem] gap-2 rounded-xl pressable no-underline',
                pathInfo === item.link ? 'shadow-xl bg-gradient' : 'text-neutral-900 border-[3px] border-transparent'
              )}
              key={item.title}
              style={{
                '--padding': '0.5rem'
              } as CSSProperties}
            >
              <span className="icon">{item.icon}</span>
              <span className="label text-[12px]">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button variant="warning" onClick={settings} flat>
          <FontAwesomeIcon icon={faWrench} />
        </Button>
        <Button variant="primary" onClick={lock} flat>
          <FontAwesomeIcon icon={faLock} />
        </Button>
        ----------
        <Button variant="danger" onClick={logout} flat>Logout</Button>
      </div>
    </div>
  )
}
