import React, { useState } from "react";
import { MenuItem } from "@/api/model/cart_item.ts";
import { useAtom } from "jotai/index";
import { appState } from "@/store/jotai.ts";
import { cn } from "@/lib/utils.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/common/input/button.tsx";
import { MenuDishModifiers } from "@/components/menu/modifiers.tsx";

interface Props {
  item: MenuItem
  index: number
}

export const CartItem = ({ item, index }: Props) => {
  const [_state, setState] = useAtom(appState);
  const [isModifiersOpen, setModifiersOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "px-3 py-2 flex rounded-2xl gap-3 cursor-pointer items-start pressable",
          item.isSelected ? 'bg-neutral-300' : (
            item.isHold ? 'bg-warning-100' : 'bg-neutral-100'
          ),
        )}
        style={{
          '--scale': 0.98
        } as any}
        onClick={() => {
          setState(prev => ({
            ...prev,
            cart: prev.cart.map(ci => {
              if( ci.id === item.id ) {
                ci.isSelected = !ci.isSelected;
              }

              return ci
            })
          }))
        }}
      >
        <div className="flex flex-col items-start gap-3">
          <div className="flex gap-1 items-center">
            <Button
              flat
              iconButton
              onClick={() => {
                setState(prev => ({
                  ...prev,
                  cart: prev.cart.map((_item) => {
                    if( item.id === _item.id ) {
                      _item.quantity++;
                    }
                    return _item;
                  })
                }))
              }}
            ><FontAwesomeIcon icon={faPlus}/></Button>
            <div className="text-center w-[24px]">{item.quantity}</div>
            {item.quantity <= 1 ? (
              <Button
                flat
                iconButton
                variant={'danger'}
                onClick={() => {
                  setState(prev => ({
                    ...prev,
                    cart: prev.cart.filter((_item) => {
                      if( item.id !== _item.id ) {
                        return _item;
                      }
                    })
                  }))
                }}
              ><FontAwesomeIcon icon={faTrash}/></Button>
            ) : (
              <Button
                flat
                iconButton
                onClick={() => {
                  setState(prev => ({
                    ...prev,
                    cart: prev.cart.map((_item) => {
                      if( item.id === _item.id ) {
                        if( _item.quantity === 1 ) {
                          return _item;
                        }

                        _item.quantity--;
                      }
                      return _item;
                    })
                  }))
                }}
              ><FontAwesomeIcon icon={faMinus}/></Button>
            )}
          </div>
          {item?.selectedGroups?.length > 0 && (
            <>
              <Button
                flat
                variant="primary"
                iconButton
                onClick={() => {
                  setModifiersOpen(true)
                }}
              ><FontAwesomeIcon icon={faPencil}/></Button>
            </>
          )}
        </div>
        <div className="flex-grow items-center">
          <CartItemName item={item}/>
        </div>
      </div>
      {isModifiersOpen && (
        <MenuDishModifiers
          isOpen={isModifiersOpen}
          dish={item.dish}
          groups={item.selectedGroups}
          level={item.level + 1}
          editing={true}
          onClose={(groups) => {
            setModifiersOpen(false);
            // update item
            setState(prev => ({
              ...prev,
              cart: prev.cart.map((cItem, cIndex) => {
                if(cIndex === index){
                  cItem.selectedGroups = groups;
                }

                return cItem;
              })
            }))
          }}
        />
      )}
    </>
  );
}

const CartItemName = ({ item }: Omit<Props, "index">) => {
  return (
    <>
      <div className={
        cn("pl-x flex justify-between", item.isModifier ? 'text-sm' : 'text-lg')
      } style={{
        '--padding': (item.level * 0.875) + 'rem'
      } as any}>
        <span>{item.dish.name}</span>
        <span>{item.dish.price * item.quantity}</span>
      </div>
      {item?.selectedGroups?.map(group =>
        <div className="border-[3px] border-l-warning-500 border-r-0 border-y-0 mb-2" key={group.out?.id}>
          {group.selectedModifiers.map(modifier => (
            <React.Fragment key={modifier.id}>
              {CartItemName({ item: modifier })}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}
