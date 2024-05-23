import { ID } from "@/api/model/common.ts";
import { Dish } from "@/api/model/dish.ts";
import { ModifierGroup } from "@/api/model/modifier_group.ts";

export interface OrderItem extends ID {
  comments?: string
  created_at: string
  updated_at?: string
  deleted_at?: string
  discount?: number
  item: Dish
  modifiers: any[]
  position: number
  price: number
  quantity: number
  service_charges?: number
  tax?: number
  seat?: string
  is_suspended?: boolean
  level?: number
}
