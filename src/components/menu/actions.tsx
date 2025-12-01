import { Button } from "@/components/common/input/button.tsx";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCodeBranch, faPencil, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { appState } from "@/store/jotai.ts";

export const MenuActions = () => {
  const [, setState] = useAtom(appState);

  return (
    <div className="flex gap-3 p-3 items-center border-t">
      <Button size="lg" variant="primary" icon={faCopy}>Repeat</Button>
      <Button size="lg" variant="primary" icon={faPencil}>Modify</Button>
      <span className="bg-neutral-400 h-[48px] w-[2px]"></span>
      <Button size="lg" variant="danger" icon={faTrash}>Delete</Button>
      <Button size="lg" variant="danger" icon={faTrash} onClick={() => setState(prev => ({
        ...prev,
        cart: []
      }))}>Delete All</Button>
      <span className="bg-neutral-400 h-[48px] w-[2px]"></span>
      <Button size="lg" variant="primary" icon={faSearch}>Search</Button>
      <Button size="lg" variant="success" icon={faCodeBranch}>Split</Button>
    </div>
  );
}
