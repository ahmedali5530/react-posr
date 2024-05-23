import { PropsWithChildren } from "react";
import { Sidebar } from "@/screens/partials/sidebar.tsx";

interface Props extends PropsWithChildren {
  gap?: boolean;
}

export const Layout = (props: Props) => {
  return (
    <div className="max-h-[100vh] h-[100vh]">
      <div className="flex">
        <div className="flex-grow-0 flex-shrink-0 w-[100px]">
          <Sidebar/>
        </div>
        <div className="overflow-auto flex-1">
          <div className="">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
