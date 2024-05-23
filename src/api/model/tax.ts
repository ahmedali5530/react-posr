import { ID, Name, Priority } from "@/api/model/common.ts";

export interface Tax extends ID, Name, Priority{
  rate: number
}
