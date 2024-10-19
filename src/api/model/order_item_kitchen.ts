import { ID } from "@/api/model/common.ts";
import { Kitchen } from "@/api/model/kitchen.ts";
import { OrderItem } from "@/api/model/order_item.ts";

export interface OrderItemKitchen extends ID {
  created_at: Date
  completed_at?: Date
  kitchen: Kitchen
  order_item: OrderItem
}
