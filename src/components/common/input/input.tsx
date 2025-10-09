import {forwardRef, InputHTMLAttributes, ReactNode, Ref, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {NumericFormat} from "react-number-format";
import {cn} from "@/lib/utils.ts";
import {nanoid} from "nanoid";
import {VirtualKeyboard} from "@/components/common/input/virtual.keyboard.tsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "lg"
  selectable?: boolean;
  hasError?: boolean;
  label?: ReactNode;
  error?: any;
  enableKeyboard?: boolean;
  disableDirectInput?: boolean;
}

export const Input = forwardRef((props: InputProps, ref: Ref<any>) => {
  const {selectable, inputSize, hasError, label, error, enableKeyboard, disableDirectInput, ...rest} = props;
  const onClick = useCallback((event: any) => {
    if (selectable !== false) {
      event.currentTarget.select();
    }
  }, [selectable]);

  // Keyboard functionality
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardValue, setKeyboardValue] = useState(props.value?.toString() || '');

  const inputElRef = useRef<HTMLInputElement | null>(null);
  const suppressFocusRef = useRef<boolean>(false);

  const assignInputRef = useCallback((node: HTMLInputElement | null) => {
    inputElRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && typeof (ref as any) === 'object') {
      (ref as any).current = node;
    }
  }, [ref]);

  const handleInputFocus = useCallback(() => {
    if (!enableKeyboard) return;
    if (suppressFocusRef.current) {
      // Single-cycle suppression: consume once, then allow subsequent focuses immediately
      suppressFocusRef.current = false;
      return;
    }
    setKeyboardValue(props.value?.toString() || '');
    setShowKeyboard(true);
  }, [enableKeyboard, props.value]);

  const handleKeyboardClose = useCallback(() => {
    suppressFocusRef.current = true;
    setShowKeyboard(false);
    // Defer blur to the next frame so it doesn't generate extra sync focus churn
    if (inputElRef.current) {
      requestAnimationFrame(() => {
        if (inputElRef.current) inputElRef.current.blur();
      });
    }
  }, []);

  const handleMouseDownOpen = useCallback((e: any) => {
    if (!enableKeyboard) return;
    // prevent the input from gaining focus; we'll manage keyboard explicitly
    e.preventDefault();
    e.stopPropagation();
    setKeyboardValue(props.value?.toString() || '');
    setShowKeyboard(true);
  }, [enableKeyboard, props.value]);

  // Keep internal keyboardValue in sync with external value when keyboard is not open
  useEffect(() => {
    if (!enableKeyboard) return;
    if (!showKeyboard) {
      const next = props.value?.toString() || '';
      if (next !== keyboardValue) {
        setKeyboardValue(next);
      }
    }
  }, [props.value, enableKeyboard, showKeyboard]);

  const id = nanoid();

  const formattedHelp = useMemo(() => {
    return error && <InputError error={error}/>
  }, [error,]);

  if (props.type === 'number') {
    return (
      <>
        {label && <label htmlFor={id}>{label}</label>}
        <NumericFormat
          name={props.name}
          value={enableKeyboard ? keyboardValue : props.value as any}
          defaultValue={props.defaultValue as any}
          onChange={enableKeyboard ? undefined : props.onChange}
          autoComplete="off"
          className={
            cn(
              'input',
              inputSize === 'lg' && 'lg',
              props.className && props.className,
              hasError && 'error',
            )
          }
          getInputRef={assignInputRef}
          onClick={onClick}
          readOnly={enableKeyboard ? true : props.readOnly}
          disabled={props.disabled}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          onFocus={props.onFocus}
          onMouseDown={enableKeyboard ? handleMouseDownOpen : undefined}
          onBlur={props.onBlur}
          id={id}
        />
        {formattedHelp}
        {enableKeyboard && showKeyboard && (
          <VirtualKeyboard
            open={showKeyboard}
            onClose={handleKeyboardClose}
            type={props.type}
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
  } else {
    return (
      <>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          type="text"
          onClick={onClick}
          autoComplete="off"
          {...rest}
          value={enableKeyboard ? keyboardValue : rest.value}
          onChange={enableKeyboard ? undefined : rest.onChange}
          onFocus={rest.onFocus}
          onMouseDown={enableKeyboard ? handleMouseDownOpen : undefined}
          readOnly={enableKeyboard ? true : rest.readOnly}
          className={
            cn(
              'input',
              inputSize === 'lg' && 'lg',
              props.className && props.className,
              hasError && 'error'
            )
          }
          ref={assignInputRef}
          id={id}
        />
        {formattedHelp}
        {enableKeyboard && showKeyboard && (
          <VirtualKeyboard
            open={showKeyboard}
            onClose={handleKeyboardClose}
            type={props.type}
            placeholder={props.placeholder}
            value={keyboardValue}
            onChange={(v) => {
              setKeyboardValue(v);
              if (rest.onChange) {
                rest.onChange({ target: { value: v } } as any);
              }
            }}
          />
        )}
      </>
    );
  }
});

export const InputError = ({
  error
}: { error?: ReactNode }) => {
  return (
    <div className="text-danger-500 text-sm">{error}</div>
  );
}
