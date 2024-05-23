import { Table } from "@/api/model/table.ts";
import React, { CSSProperties, useEffect, useState } from "react";
import { useMove } from 'react-aria';
import { cn, withCurrency } from "@/lib/utils.ts";
import { useDB } from "@/api/db/db.ts";
import { Button } from "@/components/common/input/button.tsx";
import { Popover } from "@/components/common/react-aria/popover.tsx";
import { DialogTrigger } from "react-aria-components";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slider } from "@/components/common/react-aria/slider.tsx";
import { Order } from "@/api/model/order.ts";
import { Clock } from "@/components/common/input/clock.tsx";
import { useOrderTotal } from "@/lib/cart.ts";

interface Props {
  table: Table
  order?: Order
  isEditing: boolean
  onClick?: () => void
  onRemove?: () => void
}

export const FloorTable = ({
  table, isEditing, onClick, onRemove, order
}: Props) => {
  const db = useDB();

  const minHeightWidth = 150;

  const [position, setPosition] = useState({
    x: table.x || 0,
    y: table.y || 0
  });

  const [dimension, setDimension] = useState({
    height: table.height || minHeightWidth,
    width: table.width || minHeightWidth
  });

  const clamp = (pos) => pos;
  const { moveProps } = useMove({
    onMove(e) {
      if( isEditing ) {
        setPosition(({ x, y }) => {
          if( e.pointerType === 'keyboard' ) {
            x = clamp(x);
            y = clamp(y);
          }

          x += e.deltaX;
          y += e.deltaY;
          return { x, y };
        });
      }
    },
    onMoveEnd() {
      if( isEditing ) {
        setPosition(({ x, y }) => {
          x = clamp(x);
          y = clamp(y);
          return { x, y };
        });
      }
    }
  });

  const saveTableInfo = async () => {
    await db.merge(table.id, {
      x: position.x,
      y: position.y,
      height: dimension.height,
      width: dimension.width
    });
  }

  useEffect(() => {
    if( isEditing ) {
      saveTableInfo();
    }
  }, [position, dimension, isEditing]);

  const removeTable = async () => {
    await db.merge(table.id, {
      floor: null
    });

    onRemove && onRemove();
  }

  const total = useOrderTotal(order);

  return (
    <div
      {...moveProps}
      tabIndex={0}
      style={{
        background: table.background,
        color: table.color,
        height: dimension.height,
        width: dimension.width,
        left: clamp(position.x),
        top: clamp(position.y),
        borderColor: table.color,
        '--scale': 0.95,
      } as CSSProperties}
      className={cn(
        "border absolute flex flex-col justify-center items-center pt-2 z-0 cursor-pointer",
      )}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {order && (
        <>
          <span className="text-sm font-bold rounded-2xl py-[2px] px-2" style={{
            color: table.background,
            background: table.color
          }}>
            <Clock time={order.created_at}/>
          </span>
          <div>({order?.user?.first_name})</div>
        </>
      )}
      <span className="text-2xl">{table.name}{table.number}</span>
      {order && (
        <span className="text-sm font-bold rounded-2xl py-[2px] px-2" style={{
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
                '--background': 'transparent',
                '--color': table.color,
                '--border': 'transparent'
              } as CSSProperties}
              className="absolute top-0 right-0"
            >
              <FontAwesomeIcon icon={faEllipsisVertical}/>
            </Button>
            <Popover>
              <div className="w-[250px] p-3 flex gap-5 flex-col">
                <Slider value={dimension.height} label="Height" onChange={(value) => setDimension(prev => ({
                  ...prev,
                  height: value
                }))} step={5} maxValue={500} minValue={minHeightWidth}/>
                <Slider value={dimension.width} label="Width" onChange={(value) => setDimension(prev => ({
                  ...prev,
                  width: value
                }))} step={5} maxValue={500} minValue={minHeightWidth}/>

                <Button variant="danger" onClick={removeTable}>Remove</Button>
              </div>
            </Popover>
          </DialogTrigger>
        </>
      )}
    </div>
  );
}
