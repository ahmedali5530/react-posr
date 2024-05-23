import {forwardRef, HTMLProps, Ref} from "react";
import { cn } from "@/lib/utils.ts";

interface InputProps extends HTMLProps<HTMLTextAreaElement>{}

export const Textarea = forwardRef((props: InputProps, ref: Ref<HTMLTextAreaElement>) => {
  return (
    <textarea
      {...props}
      className={
        cn(
          'form-control mousetrap',
          props.className && props.className
        )
      }
      ref={ref}
    />
  );
});
