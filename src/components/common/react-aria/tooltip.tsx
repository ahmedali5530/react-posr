import {OverlayArrow, Tooltip as BaseTooltip} from 'react-aria-components';
import type {TooltipProps} from 'react-aria-components';
import { ReactNode } from "react";

interface MyTooltipProps extends Omit<TooltipProps, 'children'> {
  children: ReactNode;
}

export function Tooltip({ children, ...props }: MyTooltipProps) {
  return (
    <BaseTooltip {...props}>
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </BaseTooltip>
  );
}
