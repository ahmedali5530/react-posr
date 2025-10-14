import React, {useMemo} from "react";
import {Button} from "@/components/common/input/button.tsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useAtom} from "jotai";
import {appState} from "@/store/jotai.ts";
import ScrollContainer from "react-indiana-drag-scroll";
import {CartItem} from "@/components/cart/cart.item.tsx";
import {Payment} from "@/components/payment/payment.tsx";
import {Seats} from "@/components/cart/seats.tsx";
import {CartActions} from "@/components/cart/cart.actions.tsx";
import {MenuItemType} from "@/api/model/cart_item.ts";

export const MenuCart = () => {
  const [state, setState] = useAtom(appState);

  const cartItems = useMemo(() => {
    return state.cart.filter(item => item.seat === state.seat);
  }, [state.cart, state.seat]);

  const isSelected = useMemo(() => {
    return state.cart.find(item => item.isSelected) !== undefined;
  }, [state.cart]);

  const newItems = useMemo(() => {
    return cartItems.filter(item => item.newOrOld === MenuItemType.new);
  }, [cartItems]);

  const oldItems = useMemo(() => {
    return cartItems.filter(item => item.newOrOld === MenuItemType.old);
  }, [cartItems]);

  return (
    <>
      <div className="flex flex-col gap-3 p-3">
        {isSelected ? (
          <CartActions/>
        ) : (
          <Seats/>
        )}
        <div className="flex flex-col gap-1 h-[calc(100vh_-_216px_-_50px)] overflow-auto">
          {state.seat && cartItems.length === 0 && state.seats.length > 0 && (
            <div className="items-center flex justify-center h-[100px]">
              <Button variant="danger" size="lg" icon={faTrash} onClick={() => {
                setState(prev => ({
                  ...prev,
                  seats: prev.seats.filter(s => s !== state.seat),
                }));
                setState(prev => ({
                  ...prev,
                  seat: prev.seats.at(-1)
                }))
              }}>Seat ?</Button>
            </div>
          )}
          <ScrollContainer className="gap-1 flex flex-col">
            {newItems.map((item, index) => (
              <CartItem item={item} key={index} index={index}/>
            ))}
            {newItems.length > 0 && oldItems.length > 0 && (
              <div className="h-1 bg-neutral-500 my-3 rounded-full"></div>
            )}
            {oldItems.map((item, index) => (
              <CartItem item={item} key={index} index={index}/>
            ))}
          </ScrollContainer>
        </div>
      </div>
      <div className="">
        <div className="h-[2px] separator"></div>
        <Payment/>
      </div>
    </>
  );
}
