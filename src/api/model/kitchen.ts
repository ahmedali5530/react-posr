import { ID, Name, Priority } from "@/api/model/common.ts";
import { Printer } from "@/api/model/printer.ts";
import { Dish } from "@/api/model/dish.ts";
import { Order } from "@/api/model/order.ts";
import { OrderItemKitchen } from "@/api/model/order_item_kitchen.ts";

export interface Kitchen extends ID, Name, Priority{
  items: Dish[]
  printers: Printer[]
}

export interface KitchenOrder {
  order: Order
  items: OrderItemKitchen[]
}
