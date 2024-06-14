import { ID } from "@/api/model/common.ts";
import { Kitchen } from "@/api/model/kitchen.ts";
import { OrderItem } from "@/api/model/order_item.ts";

export interface OrderItemKitchen extends ID {
  created_at: string
  completed_at?: string
  kitchen: Kitchen
  order_item: OrderItem
}
