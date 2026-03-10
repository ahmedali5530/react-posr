import { ID, Name } from "@/api/model/common.ts";

export interface UserRole extends ID, Name {
  roles: string[]
}
