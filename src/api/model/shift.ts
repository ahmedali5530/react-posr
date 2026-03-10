import { ID, Name } from "@/api/model/common.ts";

export interface Shift extends ID, Name {
  start_time: string
  end_time: string
  ends_next_day?: boolean
}
