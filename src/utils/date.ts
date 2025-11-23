import { CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date';
import { DateValue } from 'react-aria-components';

/**
 * Converts a Date object to a CalendarDate (DateValue)
 */
export const dateToCalendarDate = (date: Date | string | undefined): CalendarDate | null => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return null;
  
  return new CalendarDate(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate()
  );
};

/**
 * Converts a CalendarDate (DateValue) to a Date object
 */
export const calendarDateToDate = (dateValue: DateValue | null | undefined): Date | null => {
  if (!dateValue) return null;
  
  return new Date(
    dateValue.year,
    dateValue.month - 1,
    dateValue.day
  );
};

/**
 * Gets today's date as a CalendarDate
 */
export const getToday = (): CalendarDate => {
  return today(getLocalTimeZone());
};

