import { ID, Name, Priority } from "@/api/model/common.ts";

export interface Floor extends ID, Name, Priority {
  background?: string
  color?: string
}
