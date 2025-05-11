import { DateTime, ToHumanDurationOptions } from "luxon";
import { useEffect, useState } from "react";

interface Props{
  time: Date
  showAll?: boolean
}

export const Countdown = ({time, showAll}: Props) => {
  const [diff, setDiff] = useState('-, -, -');

  const calculateDiff = () => {
    const humanFormatSettings: ToHumanDurationOptions = {
      unitDisplay: 'narrow',
      maximumFractionDigits: 0
    };

    if(showAll){
      setDiff(DateTime.now().diff(DateTime.fromJSDate(time)).shiftTo('hours', 'minutes', 'seconds').toHuman(humanFormatSettings));
    }else {
      const diff = DateTime.now().diff(DateTime.fromJSDate(time)).as('hours');
      if( diff < 1 ) {
        setDiff(DateTime.now().diff(DateTime.fromJSDate(time)).shiftTo('minutes', 'seconds').toHuman(humanFormatSettings));
      } else {
        setDiff(DateTime.now().diff(DateTime.fromJSDate(time)).shiftTo('hours', 'minutes').toHuman(humanFormatSettings));
      }
    }
  }

  useEffect(() => {
    calculateDiff();
    const timer = setInterval(() => {
     calculateDiff();
    }, 1000);

    return () => clearInterval(timer);
  }, [time, showAll]);

  return (
    <span className="tabular-nums">{diff}</span>
  )
}
