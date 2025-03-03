import { useAtom } from "jotai";
import { appPage } from "@/store/jotai.ts";
import { Login } from "@/screens/login.tsx";
import { Menu } from "@/screens/menu";
import { useMemo } from "react";
import { Orders } from "@/screens/orders.tsx";
import { Summary } from "@/screens/summary.tsx";
import { Closing } from "@/screens/closing.tsx";
import { KitchenScreen } from "@/screens/kitchen.tsx";
import { Delivery } from "@/screens/delivery.tsx";
import { Admin } from "@/screens/admin";
import { Reports } from "@/screens/reports.tsx";


export const Index = () => {
  const [state] = useAtom(appPage);

  return useMemo(() => {
    const pages = {
      "Login": <Login/>,
      "Menu": <Menu/>,
      "Orders": <Orders/>,
      "Summary": <Summary/>,
      "Kitchen": <KitchenScreen/>,
      "Delivery": <Delivery/>,
      "Closing": <Closing/>,
      "Reports": <Reports/>,
      "Admin": <Admin/>
    };

    return pages[state.page];
  }, [state.page]);
}
