import { Floor } from "@/api/model/floor.ts";
import useApi, { SettingsData } from "@/api/db/use.api.ts";
import { Table } from "@/api/model/table.ts";
import { Tables } from "@/api/db/tables.ts";
import { FloorTable } from "@/components/settings/floors/layout/table.tsx";
import React, { useState } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  floor: Floor;
}

export const AdminFloorLayout = ({
  floor,
}: Props) => {
  const {
    data: tables,
    fetchData: fetchTables
  } = useApi<SettingsData<Table>>(Tables.tables, [`floor = ${floor.id}`], ['priority asc'], 0, 99999, ['floor']);

  const [zoom, setZoom] = useState(1);

  const canZoomIn = () => zoom !== 1;
  const canZoomOut = () => zoom > 0.1;

  return (
    <div className="flex justify-center items-center">
      <div
        className="h-[calc(100vh_-_80px_-_100px)] bg-neutral-50 w-[calc(100vw_-_100px)] relative bg-grid overflow-hidden">
        <div className="flex-col items-end flex absolute top-0 right-0 z-10">
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
          {tables?.data?.map(table => (
            <FloorTable table={table} isEditing onRemove={() => fetchTables()}/>
          ))}
        </div>
      </div>
    </div>
  );
}
