import { ID, Name, Priority } from "@/api/model/common.ts";

export interface Printer extends ID, Name, Priority{
  ip_address: string
  port: number
  prints: number
  type: string
}
