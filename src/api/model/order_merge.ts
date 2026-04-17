import {User} from "@/api/model/user.ts";
import {Order} from "@/api/model/order.ts";
import { DateTime } from "surrealdb";

export interface OrderMerge {
  id: string
  created_at: DateTime
  created_by: User
  new_order: Order
  old_orders: Order[]
}