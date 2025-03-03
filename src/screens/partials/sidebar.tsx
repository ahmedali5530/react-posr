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

export const Sidebar = () => {
  const [page, setPage] = useAtom(appPage);

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
    { title: 'Menu', icon: <FontAwesomeIcon icon={faBars} size="lg"/> },
    { title: 'Orders', icon: <FontAwesomeIcon icon={faList} size="lg"/> },
    { title: 'Summary', icon: <FontAwesomeIcon icon={faClipboardList} size="lg"/> },
    { title: 'Kitchen', icon: <FontAwesomeIcon icon={faUtensils} size="lg"/> },
    { title: 'Delivery', icon: <FontAwesomeIcon icon={faMotorcycle} size="lg"/> },
    { title: 'Closing', icon: <FontAwesomeIcon icon={faStore} size="lg"/> },
    { title: 'Reports', icon: <FontAwesomeIcon icon={faLineChart} size="lg"/> },
    { title: 'Admin', icon: <FontAwesomeIcon icon={faGear} size="lg"/> },
  ];

  return (
    <div className="flex flex-col justify-between h-screen items-center sidebar border border-y-0 border-white bg-white/50 backdrop-blur">
      <div className="w-full">
        <ul className="p-2 flex flex-col">
          {sidebarItems.map(item => (
            <li
              className={cn(
                'flex flex-col text-center cursor-pointer p-[0.5rem] gap-2 rounded-xl pressable',
                page.page === item.title ? 'shadow-xl bg-gradient' : 'text-neutral-900 border-[3px] border-transparent'
              )}
              key={item.title}
              onClick={() => setPage(prev => ({
                ...prev,
                page: item.title
              }))}
              style={{
                '--padding': '0.5rem'
              } as CSSProperties}
            >
              <span className="icon">{item.icon}</span>
              <span className="label text-[12px]">{item.title}</span>
            </li>
          ))}
        </ul>
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
