import { PropsWithChildren } from "react";
import { Sidebar } from "@/screens/partials/sidebar.tsx";
import { cn } from "@/lib/utils.ts";

interface Props extends PropsWithChildren {
  gap?: boolean
  overflowHidden?: boolean
  containerClassName?: string
}

export const Layout = (props: Props) => {
  return (
    <div className={
      cn(
        "max-h-[100vh] h-[100vh]",
        props.overflowHidden ? 'overflow-hidden' : 'overflow-auto'
      )
    }>
      <div className="flex">
        <div className="flex-grow-0 flex-shrink-0 w-[100px]">
          <Sidebar/>
        </div>
        <div className={
          cn(
            "flex-auto overflow-auto", props.containerClassName
          )
        }>
          {props.children}
        </div>
      </div>
    </div>
  );
}
