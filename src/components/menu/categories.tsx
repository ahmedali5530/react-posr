import { cn } from "@/lib/utils.ts";
import { useAtom } from "jotai";
import { appSettings, appState } from "@/store/jotai.ts";
import ScrollContainer from 'react-indiana-drag-scroll'
import { CSSProperties } from "react";


export const MenuCategories = () => {
  const [settings] = useAtom(appSettings);
  const [state, setState] = useAtom(appState);

  const categories = settings.categories;

  const categoryClasses = 'flex-auto whitespace-nowrap !h-[56px] pressable rounded-full px-5';
  const categoryStyles = {
    '--padding': '0 1.25rem'
  } as CSSProperties;

  return (
    <ScrollContainer className="flex flex-row gap-1 p-1" mouseScroll>
      <button
        className={cn(
          categoryClasses,
          !state?.category?.id ? 'bg-gradient' : 'bg-neutral-300'
        )}
        onClick={() => setState(prev => ({
          ...prev,
          category: undefined
        }))}
        style={categoryStyles}
      >
        All Dishes
      </button>
      {categories.map((item, index) => (
        <button
          key={index}
          className={cn(
            categoryClasses,
            state?.category?.id === item?.id ? 'bg-gradient' : 'bg-neutral-300'
          )}
          onClick={() => setState(prev => ({
            ...prev,
            category: item
          }))}
          style={categoryStyles}
        >
          {item.name}
        </button>
      ))}
    </ScrollContainer>
  )
}
