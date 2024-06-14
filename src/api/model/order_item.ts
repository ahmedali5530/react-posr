import { ID } from "@/api/model/common.ts";
import { Dish } from "@/api/model/dish.ts";
import { DishModifierGroup } from "@/api/model/dish_modifier_group.ts";
import { MenuItemType } from "@/api/model/cart_item.ts";

export interface OrderItem extends ID {
  comments?: string
  created_at: string
  updated_at?: string
  deleted_at?: string
  discount?: number
  item: Dish
  modifiers: OrderItemModifier[]
  position: number
  price: number
  quantity: number
  service_charges?: number
  tax?: number
  seat?: string
  is_suspended?: boolean
  level?: number
  category?: string
}

export interface OrderItemModifier extends ID, DishModifierGroup{
  modifiers?: OrderItemModifierItem[]
  selectedModifiers?: ({
    selectedGroups?: OrderItemModifier[]
  } & OrderItemModifierItem) []
}

export interface OrderItemModifierItem extends ID {
  dish: Dish
  level: number
  newOrOld: MenuItemType
  price: number
  quantity: number
}
