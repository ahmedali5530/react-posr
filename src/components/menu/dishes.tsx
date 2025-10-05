import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";
import { cn } from "@/lib/utils.ts";
import { useAtom } from "jotai/index";
import { appState } from "@/store/jotai.ts";
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { MenuDish } from "@/components/menu/dish.tsx";
import { CartModifierGroup, MenuItem } from "@/api/model/cart_item.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Dish } from "@/api/model/dish.ts";
import { Tables } from "@/api/db/tables.ts";

export const MenuDishes = () => {
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const ITEMS_PER_SLIDE = useMemo(() => {
    return isTablet ? 15 : 24;
  }, [isTablet]);

  const [state, setState] = useAtom(appState);

  const {
    data: allDishes,
  } = useApi<SettingsData<Dish>>(Tables.dishes, [], ['priority asc'], 0, 99999, ['categories', 'modifier_groups']);

  const dishes = useMemo(() => {
    if( state.category ) {
      return allDishes?.data.filter(item => item.categories.filter(cat => cat.id.toString() === state?.category?.id.toString()).length > 0);
    }

    return allDishes?.data || [];
  }, [allDishes?.data, state.category]);

  const slides = Math.ceil(dishes?.length / (ITEMS_PER_SLIDE));

  const onClick = (item: MenuItem, selectedGroups?: CartModifierGroup[]) => {
    setState(prev => ({
      ...prev,
      cart: [
        {
          ...item,
          selectedGroups
        },
        ...prev.cart,
      ]
    }));
  }

  useEffect(() => {
    return () => {
      setState(prev => ({
        ...prev,
        category: undefined
      }))
    }
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={1}
        className="dishes-swiper"
        direction="vertical"
      >
        {_.range(0, slides).map(rowId => (
          <SwiperSlide
            key={rowId}
            className={cn(
              "!grid grid-cols-3 lg:grid-cols-4 grid-rows-5 lg:grid-rows-6"
            )}
          >
            {dishes.slice(rowId * ITEMS_PER_SLIDE, ((rowId * ITEMS_PER_SLIDE) + ITEMS_PER_SLIDE)).map((item, index) => (
              <MenuDish
                onClick={onClick}
                item={item}
                key={index}
                level={0}
                price={item.price}
              />
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
