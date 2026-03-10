import { ID, Name, Priority } from "@/api/model/common.ts";
import { RecordId } from "surrealdb";

export interface Tax extends Name, Priority{
  id?: RecordId
  rate: number
}
