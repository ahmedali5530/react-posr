import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faPause, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownItem } from "@/components/common/react-aria/dropdown.tsx";
import React, { useState } from "react";
import { useAtom } from "jotai/index";
import { appState } from "@/store/jotai.ts";
import { nanoid } from "nanoid";
import { MenuItemType } from "@/api/model/cart_item.ts";

export const CartActions = () => {
  const [state, setState] = useAtom(appState);
  const [selected, setSelected] = useState(false);

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
    const newItems = [];
    prevItems.forEach(item => {
      if( item.isSelected ) {
        item.isSelected = false;
        if(item.newOrOld === MenuItemType.new){
          item.id = nanoid();
          newItems.push(item);
        }
      }
    });

    setState(prev => ({
      ...prev,
      cart: [
        ...prevItems.map(item => ({
          ...item,
          isSelected: false,
          id: item.newOrOld === MenuItemType.old ? item.id : nanoid()
        })),
        ...newItems,
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
