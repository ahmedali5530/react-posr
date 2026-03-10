import { ID } from "@/api/model/common.ts";
import { Shift } from "@/api/model/shift.ts";
import { User } from "@/api/model/user.ts";

export interface TipDistributionUserShare {
  id?: string
  tip_distribution?: TipDistribution
  user: User | string
  weight: number
  amount: number
}

export interface TipDistribution extends ID {
  shift?: Shift
  from_at: Date
  to_at: Date
  total_tips: number
  users: TipDistributionUserShare[]
  created_at?: Date
  created_by?: User
}
