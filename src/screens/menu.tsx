import { Layout } from "@/screens/partials/layout.tsx";
import { MenuCategories } from "@/components/menu/categories.tsx";
import { MenuDishes } from "@/components/menu/dishes.tsx";
import { MenuActions } from "@/components/menu/actions.tsx";
import { MenuCart } from "@/components/cart/cart.tsx";
import { useMemo } from "react";
import { FloorLayout } from "@/components/floor/floor.layout.tsx";
import { MenuHeader } from "@/components/menu/header.tsx";
import { useAtom } from "jotai";
import { appState } from "@/store/jotai.ts";
import { MenuPersons } from "@/components/menu/persons.tsx";

import 'swiper/css';

export const Menu = () => {
  const [state] = useAtom(appState);

  const screen = useMemo(() => {
    if( state.showFloor ) {
      return <FloorLayout/>;
    }

    if( state.showPersons ) {
      return <MenuPersons/>;
    }

    return (
      <div className="grid grid-cols-11 gap-3 pl-3">
        <div className="col-span-7">
          <div className="h-[70px] flex items-center gap-3 mb-3">
            <MenuHeader/>
          </div>
          <div className="mb-3 bg-white rounded-xl">
            <MenuCategories/>
          </div>
          <div className="bg-white rounded-xl">
            <MenuDishes/>
          </div>
          <div className="mt-3 hidden">
            <MenuActions/>
          </div>
        </div>
        <div className="col-span-4 bg-white rounded-xl">
          <MenuCart/>
        </div>
      </div>
    )

  }, [state.showFloor, state.showPersons]);

  return (
    <Layout>
      {screen}
    </Layout>
  );
}
