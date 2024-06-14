import type { ButtonProps } from 'react-aria-components';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as BaseDatePicker,
  DatePickerProps,
  DateSegment,
  DateValue,
  Group,
  Heading,
  Label,
  ValidationResult,
  DatePickerStateContext
} from 'react-aria-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@/components/common/react-aria/popover.tsx";
import { useContext } from "react";

interface Props<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  isClearable?: boolean
}

export function DatePicker<T extends DateValue>({
  label, description, errorMessage, isClearable, ...props
}: Props<T>) {
  return (
    <>
      <BaseDatePicker className="group flex flex-col gap-1" {...props}>
        {label && <Label>{label}</Label>}
        <Group className="flex rounded-lg text-neutral-500 border-2 border-neutral-900 h-[40px] gap-3">
          <DateInput className="flex flex-1 py-2 px-3">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:bg-neutral-900 focus:text-white caret-transparent placeholder-shown:italic"
              />
            )}
          </DateInput>
          {isClearable && props.value && (
            <DatePickerClearButton />
          )}
          <Button
            className="outline-none px-3 flex items-center text-gray-700 transition border-0 border-solid border-l border-l-purple-200 bg-transparent rounded-r-lg pressed:bg-purple-100 focus-visible:ring-2 ring-black">
            <FontAwesomeIcon icon={faChevronDown} size="xs"/>
          </Button>
        </Group>
        <Popover>
          <Calendar>
            <header className="flex items-center gap-1 pb-4 px-1 font-serif w-full">
              <Heading className="flex-1 font-semibold text-2xl ml-2"/>
              <RoundButton slot="previous">
                <FontAwesomeIcon icon={faChevronLeft}/>
              </RoundButton>
              <RoundButton slot="next">
                <FontAwesomeIcon icon={faChevronRight}/>
              </RoundButton>
            </header>
            <CalendarGrid className="border-spacing-1 border-separate">
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className="text-xs text-gray-500 font-semibold">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className="react-aria-CalendarCell w-9 h-9 outline-none cursor-default rounded-full flex items-center justify-center outside-month:text-gray-300 hover:bg-gray-100 pressed:bg-gray-200 selected:bg-neutral-700 selected:text-white focus-visible:ring ring-violet-600/70 ring-offset-2"
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Popover>
      </BaseDatePicker>
    </>
  );
}

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="w-9 h-9 outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full flex items-center justify-center hover:bg-gray-100 pressed:bg-gray-200 focus-visible:ring ring-violet-600/70 ring-offset-2"
    />
  );
}

function DatePickerClearButton() {
  const state = useContext(DatePickerStateContext)!;
  return (
    <Button
      // Don't inherit default Button behavior from DatePicker.
      slot={null}
      className="clear-button"
      aria-label="Clear"
      onPress={() => state.setValue(null)}>
      ✕
    </Button>
  );
}
