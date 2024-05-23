import { ID } from "@/api/model/common.ts";

export interface User extends ID {
  clock_in_at?: string
  clock_out_at?: string
  first_name: string
  last_name: string
  login: string
  password: string
  roles?: string[]
}
