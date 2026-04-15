import { Floor } from "@/api/model/floor.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Table } from "@/api/model/table.ts";
import { Tables } from "@/api/db/tables.ts";
import { FloorTable } from "@/components/settings/floors/layout/table.tsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/common/input/input.tsx";
import { useDB } from "@/api/db/db.ts";
import { toast } from "sonner";

interface Props {
  floor: Floor;
}

export const AdminFloorLayout = ({
  floor,
}: Props) => {
  const db = useDB();
  const {
    data: tables,
    fetchData: fetchTables
  } = useApi<SettingsData<Table>>(Tables.tables, [`floor = ${floor.id}`], ['priority asc'], 0, 99999, ['floor']);

  const [zoom, setZoom] = useState(1);
  const [layoutGap, setLayoutGap] = useState<number>(20);
  const [layoutGridWidth, setLayoutGridWidth] = useState<number | undefined>(undefined);
  const [layoutGridHeight, setLayoutGridHeight] = useState<number | undefined>(undefined);

  const canZoomIn = () => zoom !== 1;
  const canZoomOut = () => zoom > 0.1;

  const safeNumber = (value: number, fallback: number, min = 0) => {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return fallback;
    }

    return Math.max(min, value);
  };

  const calculatedGrid = useMemo(() => {
    const floorTables = tables?.data || [];
    if (!floorTables.length) {
      return { width: 0, height: 0 };
    }

    let maxWidth = 0;
    let maxHeight = 0;
    for (const item of floorTables) {
      const x = Math.max(0, Number(item.x) || 0);
      const y = Math.max(0, Number(item.y) || 0);
      const width = Math.max(10, Number(item.width) || 50);
      const height = Math.max(10, Number(item.height) || 50);
      maxWidth = Math.max(maxWidth, x + width);
      maxHeight = Math.max(maxHeight, y + height);
    }

    return { width: maxWidth, height: maxHeight };
  }, [tables?.data]);

  useEffect(() => {
    setLayoutGridWidth(undefined);
    setLayoutGridHeight(undefined);
  }, [floor.id]);

  useEffect(() => {
    if (layoutGridWidth === undefined && calculatedGrid.width > 0) {
      setLayoutGridWidth(calculatedGrid.width);
    }

    if (layoutGridHeight === undefined && calculatedGrid.height > 0) {
      setLayoutGridHeight(calculatedGrid.height);
    }
  }, [calculatedGrid.height, calculatedGrid.width, layoutGridHeight, layoutGridWidth]);

  const effectiveGridWidth = safeNumber(
    layoutGridWidth ?? calculatedGrid.width,
    calculatedGrid.width || 1000,
    0
  );

  const effectiveGridHeight = safeNumber(
    layoutGridHeight ?? calculatedGrid.height,
    calculatedGrid.height || 600,
    0
  );

  const arrangeTablesByGrid = useCallback(async () => {
    if (!tables?.data?.length) {
      toast.info("No tables found to arrange");
      return;
    }

    const gap = safeNumber(layoutGap, 20, 0);
    const gridWidth = effectiveGridWidth;
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    let arrangedCount = 0;

    for (const item of tables.data) {
      const tableWidth = Math.max(10, Number(item.width) || 50);
      const tableHeight = Math.max(10, Number(item.height) || 50);

      if (currentX > 0 && (currentX + tableWidth) > gridWidth) {
        currentX = 0;
        currentY += rowHeight + gap;
        rowHeight = 0;
      }

      const nextX = Math.max(0, Math.min(currentX, Math.max(0, gridWidth - tableWidth)));
      const nextY = Math.max(0, currentY);
      await db.merge(item.id, { x: nextX, y: nextY });

      arrangedCount += 1;
      currentX += tableWidth + gap;
      rowHeight = Math.max(rowHeight, tableHeight);
    }

    await fetchTables();

    if (arrangedCount > 0) {
      toast.success(`Arranged ${arrangedCount} tables inside the grid`);
    }
  }, [db, effectiveGridWidth, fetchTables, layoutGap, tables?.data]);

  return (
    <div className="flex justify-center items-center">
      <div
        className="h-[calc(100vh_-_80px_-_100px)] bg-neutral-50 w-[calc(100vw_-_100px)] relative bg-grid overflow-hidden">
        <div className="absolute top-3 left-3 z-10 bg-white/90 rounded-lg p-3 flex items-end gap-3">
          <div className="w-[100px]">
            <label className="text-sm block mb-1">Gap</label>
            <Input
              type="number"
              value={layoutGap}
              onChange={(e) => setLayoutGap(safeNumber(Number(e.target.value), 20, 0))}
            />
          </div>
          <div className="w-[130px]">
            <label className="text-sm block mb-1">Grid Width</label>
            <Input
              type="number"
              value={layoutGridWidth ?? calculatedGrid.width}
              onChange={(e) => setLayoutGridWidth(safeNumber(Number(e.target.value), effectiveGridWidth, 0))}
            />
          </div>
          <div className="w-[130px]">
            <label className="text-sm block mb-1">Grid Height</label>
            <Input
              type="number"
              value={layoutGridHeight ?? calculatedGrid.height}
              onChange={(e) => setLayoutGridHeight(safeNumber(Number(e.target.value), effectiveGridHeight, 0))}
            />
          </div>
          <Button onClick={arrangeTablesByGrid} variant="primary">Arrange</Button>
        </div>
        <div className="flex-col items-end flex absolute top-3 right-3 z-10">
          <Button onClick={() => {
            setZoom(prev => prev + 0.1);
          }} aria-label="Zoom in" variant="primary" disabled={!canZoomIn()}><FontAwesomeIcon icon={faPlus}/></Button>
          <Button onClick={() => {
            setZoom(prev => prev - 0.1);
          }}  aria-label="Zoom out" variant="primary" disabled={!canZoomOut()}><FontAwesomeIcon icon={faMinus}/></Button>
          <Button onClick={() => {
            setZoom(1);
          }}  aria-label="Zoom reset" variant="primary" disabled={zoom === 1}><FontAwesomeIcon icon={faEquals}/></Button>
        </div>
        <div className="w-full h-full relative" style={{
          'transform': `scale(${zoom})`
        }}>
          <div
            className="relative border border-dashed border-gray-500"
            style={{
              width: effectiveGridWidth,
              height: effectiveGridHeight,
            }}
          >
            {tables?.data?.map(table => (
              <FloorTable
                key={table.id}
                table={table}
                isEditing
                boundaryWidth={effectiveGridWidth}
                boundaryHeight={effectiveGridHeight}
                onRemove={() => fetchTables()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
