import { ID, Name, Priority } from "@/api/model/common.ts";

export interface Discount extends ID, Name, Priority {
  rate: number
  type: string
}
