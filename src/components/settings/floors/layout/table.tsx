import { Table } from "@/api/model/table.ts";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { useMove } from 'react-aria';
import { cn, withCurrency } from "@/lib/utils.ts";
import { useDB } from "@/api/db/db.ts";
import { Button } from "@/components/common/input/button.tsx";
import { Popover } from "@/components/common/react-aria/popover.tsx";
import { DialogTrigger } from "react-aria-components";
import {
  faCircle,
  faEllipsisVertical,
  faExclamationCircle,
  faLock,
  faSquare,
  faSquareFull
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slider } from "@/components/common/react-aria/slider.tsx";
import { Order } from "@/api/model/order.ts";
import { calculateOrderTotal } from "@/lib/cart.ts";
import { Countdown } from "@/components/floor/countdown.tsx";
import { DateTime } from "luxon";
import { Input } from "@/components/common/input/input.tsx";

interface Props {
  table: Table
  order?: Order
  isEditing: boolean
  onClick?: () => void
  onRemove?: () => void
  isLocked?: boolean
}

export const FloorTable = ({
  table, isEditing, onClick, onRemove, order, isLocked
}: Props) => {
  const db = useDB();

  const minHeightWidth = 150;

  const [settings, setSettings] = useState({
    x: table.x || 0,
    y: table.y || 0,
    height: table.height || minHeightWidth,
    width: table.width || minHeightWidth,
    color: table.color || '#ffffff',
    background: table.background || '#000000',
    rounded: table.rounded || ''
  });

  const clamp = (pos) => pos;
  const { moveProps } = useMove({
    onMove(e) {
      if( isEditing ) {
        setSettings(prev => {
          return {
            ...prev,
            x: prev.x + e.deltaX,
            y: prev.y + e.deltaY
          }
        });
      }
    },
    onMoveEnd() {
      // if( isEditing ) {
      //
      // }
    }
  });

  const saveTableInfo = async () => {
    await db.merge(table.id, {
      ...settings
    });
  }

  useEffect(() => {
    if( isEditing ) {
      saveTableInfo();
    }
  }, [settings, isEditing]);

  const removeTable = async () => {
    await db.merge(table.id, {
      floor: null
    });

    onRemove && onRemove();
  }

  const total = calculateOrderTotal(order);
  const isLateOrder = useMemo(() => {
    if( order ) {
      const diff = DateTime.now().diff(DateTime.fromJSDate(order.created_at)).as('hours');
      return diff >= 2;
    }

    return false;
  }, [order]);

  return (
    <div
      {...moveProps}
      tabIndex={0}
      style={{
        background: settings.background,
        color: settings.color,
        height: settings.height,
        width: settings.width,
        left: clamp(settings.x),
        top: clamp(settings.y),
        borderColor: settings.color,
        '--scale': 0.95,
      } as CSSProperties}
      className={cn(
        "border absolute z-0 cursor-pointer flex flex-col justify-center items-center",
        settings.rounded
      )}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {isLocked && (
        <span
          className="absolute -top-3 -right-3 rounded-full h-6 w-6 flex items-center justify-center shadow"
          style={{
            color: table.background,
            background: table.color
          }}
        >
          <FontAwesomeIcon icon={faLock} size="sm"/>
        </span>
      )}
      {order && (
        <>
          {isLateOrder && (
            <span
              className="absolute -top-3 -left-3 rounded-full h-6 w-6 flex items-center justify-center bg-white text-danger-500 shadow"
              title="More then 2 hours"
            >
              <FontAwesomeIcon icon={faExclamationCircle} beat/>
            </span>
          )}
          <span className="text-xs font-bold rounded-2xl py-[2px] px-2 absolute -top-3 shadow-lg" style={{
            color: table.background,
            background: table.color
          }}>
            <Countdown time={order.created_at}/>
          </span>
          <div className="text-sm">({order?.user?.first_name})</div>
        </>
      )}
      <span className="text-2xl">{table.name}{table.number}</span>
      {order && (
        <span className="text-lg font-bold rounded-2xl py-[2px] px-2" style={{
          color: table.background,
          background: table.color
        }}>{withCurrency(total)}</span>
      )}
      {isEditing && (
        <>
          <DialogTrigger>
            <Button
              variant="custom"
              style={{
                '--background': 'black',
                '--color': 'white',
                '--border': 'transparent',
                '--height': '20px',
                '--padding': '0 8px'
              } as CSSProperties}
              className="absolute top-0 right-0"
            >
              <FontAwesomeIcon icon={faEllipsisVertical}/>
            </Button>
            <Popover>
              <div className="w-[250px] p-3 flex gap-5 flex-col">
                <Slider value={settings.height} label="Height" onChange={(value) => setSettings(prev => ({
                  ...prev,
                  height: value
                }))} step={5} maxValue={500} minValue={minHeightWidth}/>
                <Slider value={settings.width} label="Width" onChange={(value) => setSettings(prev => ({
                  ...prev,
                  width: value
                }))} step={5} maxValue={500} minValue={minHeightWidth}/>
                <div className="mb-3">
                  <div className="flex gap-3">
                    <Button variant="primary" flat active={settings.rounded === 'rounded-none'} onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        rounded: 'rounded-none'
                      }))
                    }}>
                      <FontAwesomeIcon icon={faSquareFull} size="2x"/>
                    </Button>
                    <Button variant="primary" flat active={settings.rounded === 'rounded-xl'} onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        rounded: 'rounded-xl'
                      }))
                    }}>
                      <FontAwesomeIcon icon={faSquare} size="2x"/>
                    </Button>
                    <Button variant="primary" flat active={settings.rounded === 'rounded-full'} onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        rounded: 'rounded-full'
                      }))
                    }}>
                      <FontAwesomeIcon icon={faCircle} size="2x"/>
                    </Button>
                  </div>
                </div>
                <div className="mb-3 flex flex-col gap-3">
                  <div>
                    <label htmlFor="color">Color</label>
                    <Input type="color" value={settings.color} id="color" onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        color: e.target.value
                      }));
                    }}/>
                  </div>
                  <div>
                    <label htmlFor="background">Background</label>
                    <Input type="color" value={settings.background} id="background" onChange={(e) => {
                      setSettings(prev => ({
                        ...prev,
                        background: e.target.value
                      }));
                    }}/>
                  </div>
                </div>
                <Button variant="danger" onClick={removeTable}>Remove</Button>
              </div>
            </Popover>
          </DialogTrigger>
        </>
      )}
    </div>
  );
}
