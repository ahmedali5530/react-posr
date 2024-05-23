import { ID, Name, Priority } from "@/api/model/common.ts";

export interface Category extends ID, Name, Priority{
  background?: string
  color?: string
  parent?: Category
}
