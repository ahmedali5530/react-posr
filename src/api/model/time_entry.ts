import {User} from "@/api/model/user.ts";

export interface TimeEntry {
  id: string
  clock_in: string
  clock_out?: string
  duration_seconds?: number
  user: User
}