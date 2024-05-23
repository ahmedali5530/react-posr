import React, { useMemo } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { appState } from "@/store/jotai.ts";
import ScrollContainer from "react-indiana-drag-scroll";
import { CartItem } from "@/components/cart/cart.item.tsx";
import { Payment } from "@/components/payment/payment.tsx";
import { Seats } from "@/components/cart/seats.tsx";
import { CartActions } from "@/components/cart/cart.actions.tsx";

export const MenuCart = () => {
  const [state, setState] = useAtom(appState);

  const cartItems = useMemo(() => {
    return state.cart.filter(item => item.seat === state.seat);
  }, [state.cart, state.seat]);

  const isSelected = useMemo(() => {
    return state.cart.find(item => item.isSelected) !== undefined;
  }, [state.cart]);

  return (
    <>
      <div className="flex flex-col gap-3 p-3">
        {isSelected ? (
          <CartActions/>
        ) : (
          <Seats/>
        )}
        <div className="flex flex-col gap-1 h-[calc(100vh_-_216px_-_110px)] overflow-auto">
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
            {cartItems.map((item, index) => (
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
