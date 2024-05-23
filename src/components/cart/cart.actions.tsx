import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faPause, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownItem } from "@/components/common/react-aria/dropdown.tsx";
import React, { useMemo, useState } from "react";
import { useAtom } from "jotai/index";
import { appState } from "@/store/jotai.ts";
import { nanoid } from "nanoid";

export const CartActions = () => {
  const [state, setState] = useAtom(appState);
  const [selected, setSelected] = useState(false);

  const holdOrFire = useMemo(() => {
    return 1;
  }, [state.cart]);

  const onClickSeatItem = (seat: string) => {
    if( seat === 'new' ) {
      seat = nanoid();
      setState(prev => ({
        ...prev,
        seats: [
          ...prev.seats,
          seat
        ],
        seat: seat
      }));
    }

    setState(prev => ({
      ...prev,
      cart: prev.cart.map(cartItem => {
        if( cartItem.isSelected ) {
          cartItem.seat = seat;
          cartItem.isSelected = false;
        }

        return cartItem;
      })
    }))
  }

  const deleteSelectedCartItems = () => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => !item.isSelected)
    }))
  }

  const copySelectedCartItems = () => {
    const prevItems = [...state.cart];
    setState(prev => ({
      ...prev,
      cart: [
        ...state.cart.map(item => {
          if( item.isSelected ) {
            item.id = nanoid();
            item.isSelected = false;

            return item
          }
        }), // selected items
        ...prevItems.filter(item => !item.isSelected), // previous items
      ]
    }))
  }

  const toggleCartItems = () => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(cartItem => {
        cartItem.isSelected = !selected;
        return cartItem;
      })
    }))

    setSelected(!selected);
  }

  const toggleHoldSelectedCartItems = () => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(cartItem => {
        if( cartItem.isSelected ) {
          cartItem.isHold = !cartItem.isHold;
          cartItem.isSelected = false;
        }

        return cartItem;
      })
    }))
  }

  return (
    <div className="flex gap-3">
      <Button size="lg" iconButton variant="primary" onClick={toggleCartItems}>
        <FontAwesomeIcon icon={faSquareCheck} size="lg"/>
      </Button>
      <span className="bg-neutral-400 h-[48px] w-[2px]"></span>
      <Button size="lg" iconButton variant="primary" onClick={copySelectedCartItems}>
        <FontAwesomeIcon icon={faCopy} size="lg"/>
      </Button>
      <Button size="lg" iconButton variant="danger" onClick={deleteSelectedCartItems}>
        <FontAwesomeIcon icon={faTrash} size="lg"/>
      </Button>
      <Button size="lg" iconButton variant="warning" onClick={toggleHoldSelectedCartItems}>
        <FontAwesomeIcon icon={faPause} size="lg"/>
      </Button>
      <Dropdown label={
        "Seat"
      } btnSize="lg" onAction={onClickSeatItem}>
        {state.seats.map((seat, index) => (
          <DropdownItem id={seat} key={seat} className="min-w-[50px]">{index + 1}</DropdownItem>
        ))}
        <DropdownItem id="new" key="new" className="min-w-[50px]">New Seat</DropdownItem>
      </Dropdown>
    </div>
  )
}
