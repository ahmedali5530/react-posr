import { forwardRef, InputHTMLAttributes, ReactNode, Ref, useCallback, useMemo } from "react";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils.ts";
import { nanoid } from "nanoid";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "lg"
  selectable?: boolean;
  hasError?: boolean;
  label?: ReactNode;
  error?: any;
}

export const Input = forwardRef((props: InputProps, ref: Ref<any>) => {
  const { selectable, inputSize, hasError, label, error, ...rest } = props;
  const onClick = useCallback((event: any) => {
    if( selectable !== false ) {
      event.currentTarget.select();
    }
  }, [selectable]);

  const id = nanoid();

  const formattedHelp = useMemo(() => {
    return error && <InputError error={error} />
  }, [error,]);

  if( props.type === 'number' ) {
    return (
      <>
        {label && <label htmlFor={id}>{label}</label>}
        <NumericFormat
          name={props.name}
          value={props.value as any}
          defaultValue={props.defaultValue as any}
          onChange={props.onChange}
          autoComplete="off"
          className={
            cn(
              'input',
              inputSize === 'lg' && 'lg',
              props.className && props.className,
              hasError && 'error'
            )
          }
          getInputRef={ref}
          onClick={onClick}
          readOnly={props.readOnly}
          disabled={props.disabled}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          id={id}
        />
        {formattedHelp}
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
          className={
            cn(
              'input',
              inputSize === 'lg' && 'lg',
              props.className && props.className,
              hasError && 'error'
            )
          }
          ref={ref}
          id={id}
        />
        {formattedHelp}
      </>
    );
  }
});

export const InputError = ({
  error
}: {error?: ReactNode}) => {
  return (
    <div className="text-danger-500 text-sm">{error}</div>
  );
}
