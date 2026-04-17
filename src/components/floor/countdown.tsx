import {DateTime as LuxonDateTime, ToHumanDurationOptions} from "luxon";
import { useEffect, useState } from "react";
import { DateInput, toLuxonDateTime } from "@/lib/datetime.ts";

interface Props{
  time: DateInput
  showAll?: boolean
}

export const Countdown = ({time, showAll}: Props) => {
  const [diff, setDiff] = useState('-, -, -');


  const calculateDiff = () => {
    const humanFormatSettings: ToHumanDurationOptions = {
      unitDisplay: 'narrow',
      maximumFractionDigits: 0
    };
    const startedAt = toLuxonDateTime(time);

    if(showAll){
      setDiff(LuxonDateTime.now().diff(startedAt).shiftTo('hours', 'minutes', 'seconds').toHuman(humanFormatSettings));
    }else {
      const diff = LuxonDateTime.now().diff(startedAt).as('hours');
      if( diff < 1 ) {
        setDiff(LuxonDateTime.now().diff(startedAt).shiftTo('minutes', 'seconds').toHuman(humanFormatSettings));
      } else {
        setDiff(LuxonDateTime.now().diff(startedAt).shiftTo('hours', 'minutes').toHuman(humanFormatSettings));
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
