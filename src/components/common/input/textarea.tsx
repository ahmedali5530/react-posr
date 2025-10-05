import {forwardRef, HTMLProps, Ref, useCallback, useRef, useState} from "react";
import { cn } from "@/lib/utils.ts";
import {VirtualKeyboard} from "@/components/common/input/virtual.keyboard.tsx";

interface InputProps extends HTMLProps<HTMLTextAreaElement>{
  label?: string;
  enableKeyboard?: boolean;
}

export const Textarea = forwardRef((
  props: InputProps, ref: Ref<HTMLTextAreaElement>
) => {
  const {enableKeyboard, ...rest} = props;

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardValue, setKeyboardValue] = useState((props.value as any)?.toString?.() || '');
  const inputElRef = useRef<HTMLTextAreaElement | null>(null);

  const assignRef = useCallback((node: HTMLTextAreaElement | null) => {
    inputElRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && typeof (ref as any) === 'object') {
      (ref as any).current = node;
    }
  }, [ref]);

  const handleMouseDownOpen = useCallback((e: any) => {
    if (props.onMouseDown) props.onMouseDown(e);
    if (!enableKeyboard) return;
    if (e.defaultPrevented) return;
    e.preventDefault();
    setKeyboardValue((props.value as any)?.toString?.() || '');
    setShowKeyboard(true);
  }, [enableKeyboard, props.onMouseDown, props.value]);

  const handleKeyboardClose = useCallback(() => {
    setShowKeyboard(false);
    if (inputElRef.current) {
      requestAnimationFrame(() => {
        if (inputElRef.current) inputElRef.current.blur();
      });
    }
  }, []);

  return (
    <>
      <textarea
        {...rest}
        className={
          cn(
            'form-control mousetrap',
            props.className && props.className
          )
        }
        ref={assignRef}
        value={enableKeyboard ? keyboardValue : rest.value}
        onChange={enableKeyboard ? undefined : rest.onChange}
        readOnly={enableKeyboard ? true : rest.readOnly}
        onMouseDown={handleMouseDownOpen}
      />
      {enableKeyboard && showKeyboard && (
        <VirtualKeyboard
          open={showKeyboard}
          onClose={handleKeyboardClose}
          type={undefined}
          placeholder={props.placeholder}
          value={keyboardValue}
          onChange={(v) => {
            setKeyboardValue(v);
            if (props.onChange) {
              props.onChange({ target: { value: v } } as any);
            }
          }}
        />
      )}
    </>
  );
});
