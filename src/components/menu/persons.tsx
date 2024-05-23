import { useAtom } from "jotai";
import { appState } from "@/store/jotai.ts";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";

export const MenuPersons = () => {
  const [state, setState] = useAtom(appState);
  const [error, setError] = useState(false);

  const onKey = (key: string) => {
    setState(prev => ({
      ...prev,
      persons: parseInt(prev.persons ? prev.persons + key : key).toString()
    }));
  }

  const onOk = () => {
    if( !state.persons || state.persons.trim() === '' || state.persons.trim() === '0' ) {
      setError(true);
      return;
    }

    setState(prev => ({
      ...prev,
      showPersons: false
    }))
  }

  useEffect(() => {
    if( error ) {
      setTimeout(() => setError(false), 400);
    }
  }, [error]);

  return (
    <div className="flex h-full w-full justify-center items-center flex-col gap-5">
      <h3 className={
        cn("text-4xl", error && 'login-error')
      }>Choose number of persons</h3>
      <div
        className="bg-neutral-300 w-[380px] h-[75px] flex items-center justify-center text-3xl font-bold">{state.persons}</div>
      <div className="grid grid-cols-3 gap-3">
        <button type="button" onClick={() => onKey('1')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">1
        </button>
        <button type="button" onClick={() => onKey('2')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">2
        </button>
        <button type="button" onClick={() => onKey('3')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">3
        </button>
        <button type="button" onClick={() => onKey('4')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">4
        </button>
        <button type="button" onClick={() => onKey('5')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">5
        </button>
        <button type="button" onClick={() => onKey('6')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">6
        </button>
        <button type="button" onClick={() => onKey('7')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">7
        </button>
        <button type="button" onClick={() => onKey('8')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">8
        </button>
        <button type="button" onClick={() => onKey('9')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">9
        </button>
        <button type="button" onClick={() => setState(prev => ({
          ...prev,
          persons: undefined
        }))}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-danger-500 active:bg-danger-900 rounded-full text-3xl">C
        </button>
        <button type="button" onClick={() => onKey('0')}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-neutral-500 active:bg-neutral-900 rounded-full text-3xl">0
        </button>
        <button type="button" onClick={onOk}
                className="size-[85px] sm:size-[100px] md:size-[120px] p-0 text-white active:scale-[0.95] transition-all duration-75 bg-success-500 active:bg-success-900 rounded-full text-3xl">OK
        </button>
      </div>
    </div>
  );
}
