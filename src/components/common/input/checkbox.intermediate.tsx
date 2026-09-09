import React, { HTMLProps } from "react";

export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if( typeof indeterminate === 'boolean' ) {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer tw-h-[24px] tw-w-[24px]'}
      {...rest}
    />
  )
}
