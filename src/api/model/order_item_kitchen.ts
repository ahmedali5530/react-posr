import { ID } from "@/api/model/common.ts";
import { Kitchen } from "@/api/model/kitchen.ts";
import { OrderItem } from "@/api/model/order_item.ts";
import { DateTime } from "surrealdb";

export interface OrderItemKitchen extends ID {
  created_at: DateTime
  completed_at?: DateTime
  kitchen: Kitchen
  order_item: OrderItem
}
