import {
  Menu,
  MenuItem,
  MenuItemProps,
  MenuProps,
  MenuTrigger,
  MenuTriggerProps,
  Popover
} from 'react-aria-components';
import { ReactNode } from "react";
import { Button } from "@/components/common/input/button.tsx";
import { cn } from "@/lib/utils.ts";

interface DropdownProps<T>
  extends MenuProps<T>, Omit<MenuTriggerProps, 'children'> {
  label?: ReactNode;
  btnSize?: "lg" | "xl" | "sm";
  btnFlat?: boolean
  btnIconButton?: boolean
}

export function Dropdown<T extends object>(
  { label, children, btnSize, btnFlat, btnIconButton, ...props }: DropdownProps<T>
) {
  return (
    <MenuTrigger {...props}>
      <Button className={cn('btn btn-primary', props.className)} size={btnSize} flat={btnFlat} iconButton={btnIconButton}>{label}</Button>
      <Popover className="bg-white p-1 shadow-xl rounded-lg border">
        <Menu {...props}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function DropdownItem(props: MenuItemProps) {
  const textValue = props.textValue ||
    (typeof props.children === 'string' ? props.children : undefined);
  return (
    <MenuItem
      {...props}
      textValue={textValue}
      className={({ isFocused, isOpen }) =>
        `cursor-pointer text-center bg-white hover:bg-neutral-900 hover:text-warning-500 p-3 rounded-lg ${isFocused ? 'focused' : ''} ${isOpen ? 'open' : ''} ${props.className}`}
    >
      {({ hasSubmenu }) => (
        <>
          {props.children}
          {hasSubmenu && (
            <svg className="chevron" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </>
      )}
    </MenuItem>
  );
}
