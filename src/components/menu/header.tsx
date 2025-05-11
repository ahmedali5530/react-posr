import { useAtom } from "jotai/index";
import { appSettings, appState } from "@/store/jotai.ts";
import { Button } from "@/components/common/input/button.tsx";
import { faArrowLeft, faChevronDown, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils.ts";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogTrigger } from "react-aria-components";
import { Popover } from "@/components/common/react-aria/popover.tsx";
import { Dropdown, DropdownItem } from "@/components/common/react-aria/dropdown.tsx";
import { useDB } from "@/api/db/db.ts";
import { MenuItemType } from "@/api/model/cart_item.ts";
import { Payment } from "@/components/payment/payment.tsx";
import { Customers } from "@/components/customer/customer.tsx";

export const MenuHeader = () => {
  const db = useDB();

  const [state, setState] = useAtom(appState);
  const [setting] = useAtom(appSettings);
  const [customerModal, setCustomerModal] = useState(false);
  const [confirmCartAction, setConfirmCartAction] = useState(false);

  useEffect(() => {
    if( !state.orderType ) {
      setState(prev => ({
        ...prev,
        orderType: setting?.order_types[0]
      }))
    }
  }, [setting?.order_types, state.orderType]);

  useEffect(() => {
    if( state?.order?.id !== 'new' && state.orders.length > 0 ) {
      onOrderClick(state?.order?.id);
    }
  }, [state.orders, state?.order?.id]);

  const reset = async () => {
    if( state.order.id === 'new' && state.cart.length > 0 ) {
      setConfirmCartAction(true);
      return false;
    }

    await db.merge(state.table.id, {
      is_locked: false,
      locked_at: null,
      locked_by: null
    });

    setState(prev => ({
      ...prev,
      orderType: undefined,
      showFloor: true,
      persons: '1'
    }));
  }

  const onOrderClick = (key: string) => {
    if( key === 'new' ) {
      setState(prev => ({
        ...prev,
        order: {
          id: 'new',
          order: undefined
        },
        cart: []
      }))
    } else {
      const order = state.orders.find(item => item.id === key);
      const seats = new Map();
      order?.items.forEach(item => {
        if( item.seat ) {
          seats.set(item.seat, item.seat);
        }
      });

      setState(prev => ({
        ...prev,
        order: {
          order,
          id: order.id,
        },
        cart: [
          ...order.items.map(item => ({
            dish: item.item,
            level: item.level,
            quantity: item.quantity,
            seat: item.seat,
            id: item.id,
            selectedGroups: item.modifiers || [] as any,
            newOrOld: MenuItemType.old,
          }))
        ],
        seats: Array.from(seats.values()),
      }));
    }
  }

  const switchTable = async () => {
    setState(prev => ({
      ...prev,
      showFloor: true,
      switchTable: true
    }));

    // release table
    await db.merge(state.table.id, {
      is_locked: false,
      locked_at: null,
      locked_by: null
    });
  }

  const openPersons = async () => {
    setState(prev => ({
      ...prev,
      showPersons: true,
    }));
  }

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={faArrowLeft} onClick={reset} size="lg">{state?.floor?.name}</Button>
          {state.orders.length > 0 ? (
            <Dropdown
              label={state?.order?.order ? 'Order# ' + state?.order?.order?.invoice_number : 'New Order'} btnSize="lg"
              btnFlat={true}
              onAction={onOrderClick}
            >
              {state?.orders?.map((order, index) => (
                <DropdownItem
                  id={order.id}
                  key={index}
                  className="min-w-[50px]"
                >Order# {order.invoice_number}</DropdownItem>
              ))}
              <DropdownItem id="new" key="new" className="min-w-[50px]">New Order</DropdownItem>
            </Dropdown>
          ) : (
            <Button variant="primary" flat size="lg">New Order</Button>
          )}

          <button type="button"
                  className="btn btn-primary lg btn-flat min-w-[50px]"
                  onClick={switchTable}
          >{state?.table?.name}{state?.table?.number}</button>
          <Button type="button"
                  className="btn btn-primary lg btn-flat"
                  onClick={openPersons}
                  icon={faUsers}
          >
            {state?.persons} PAX
          </Button>

          <div className="input-group">
            <Button flat variant="primary" size="lg" icon={faUser} onClick={() => setCustomerModal(true)}>
              {state?.customer ? state.customer?.name : 'Customer'}
            </Button>
          </div>
        </div>

        <div className="flex input-group rounded-full">
          {setting?.order_types?.map((item, index) => (
            <Button
              variant="primary"
              size="lg"
              className={cn(
                "flex-1",
                index === 0 && '!rounded-l-lg',
                index === setting?.order_types?.length - 1 && ' !rounded-r-lg'
              )}
              active={item.id === state?.orderType?.id}
              onClick={() => {
                setState(prev => ({
                  ...prev,
                  orderType: item
                }))
              }}
              key={index}
              flat
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      <Modal
        open={customerModal}
        onClose={() => {
          setCustomerModal(false)
        }}
        title={state?.customer?.name || 'Select a customer'}
        size="md"
      >
        <Customers onAttach={() => {
          setCustomerModal(false)
        }} />
      </Modal>

      {confirmCartAction && (
        <Modal
          open={confirmCartAction}
          onClose={() => {
            setConfirmCartAction(false)
          }}
          title="Please confirm"
          size="sm"
        >
          <div className="alert alert-danger">
            There {state.cart.length > 1 ? 'are' : 'is'} {state.cart.length} item{state.cart.length > 1 ? 's' : ''} in
            cart, choose an action
          </div>
          <Payment/>
        </Modal>
      )}
    </>
  )
}
