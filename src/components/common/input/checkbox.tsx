import {HTMLProps, useEffect, useRef} from "react";
import _ from "lodash";
import { cn } from "@/lib/utils.ts";
import {nanoid} from "nanoid";

interface InputProps extends HTMLProps<HTMLInputElement>{
  indeterminate?: boolean;
}

export const Checkbox = (props: InputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const {indeterminate, ...rest} = props;

  useEffect(() => {
    if(ref.current !== null){
      ref.current.indeterminate = false;
      if(_.isBoolean(indeterminate)) {
        ref.current.indeterminate = indeterminate;
      }
    }
  }, [indeterminate, props.checked]);

  const id = nanoid();

  return (
    <div className="inline-flex items-center gap-3">
      <input
        {...rest}
        id={id}
        ref={ref}
        type="checkbox"
        className={
          cn(
            'checkbox mousetrap',
            props.className && props.className
          )
        }
      />
      {props.label && <label htmlFor={id} className="font-bold cursor-pointer">{props.label}</label>}
    </div>
  );
};
