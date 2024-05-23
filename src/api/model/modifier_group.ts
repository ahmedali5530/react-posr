import { ID, Name, Priority } from "@/api/model/common.ts";
import { Modifier } from "@/api/model/modifier.ts";

export interface ModifierGroup extends ID, Name, Priority {
  background?: string
  color?: string
  modifiers: Modifier[]
}
