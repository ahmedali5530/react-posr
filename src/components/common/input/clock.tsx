import { DateTime } from "luxon";
import { useEffect, useState } from "react";

interface Props{
  time: string
}

export const Clock = ({time}: Props) => {
  const [diff, setDiff] = useState('-,-');

  const calculateDiff = () => {
    setDiff(DateTime.now().diff(DateTime.fromISO(time)).shiftTo('hours', 'minutes').toHuman({
      unitDisplay: 'narrow',
      maximumFractionDigits: 0
    }));
  }

  useEffect(() => {
    calculateDiff();
    const timer = setInterval(() => {
     calculateDiff();
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [time]);

  return (
    <>{diff}</>
  )
}
