import {User} from "@/api/model/user.ts";
import {Order} from "@/api/model/order.ts";

export interface OrderMerge {
  id: string
  created_at: string
  created_by: User
  new_order: Order
  old_orders: Order[]
}