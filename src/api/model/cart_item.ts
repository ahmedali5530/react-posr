import { Dish } from "@/api/model/dish.ts";
import { ModifierGroup } from "@/api/model/modifier_group.ts";
import { DishModifierGroup } from "@/api/model/dish_modifier_group.ts";

export interface MenuItem {
  quantity: number
  seat?: string
  comments?: string
  serviceCharges?: number
  dish: Dish
  id: string
  group?: ModifierGroup
  modifiers?: Dish[]
  selectedGroups?: CartModifierGroup[]
  isModifier?: boolean
  level: number
  isSelected?: boolean
  isHold?: boolean
}

export interface CartModifierGroup extends DishModifierGroup {
  selected_quantity?: number
  selectedModifiers: MenuItem[]
  modifiers: MenuItem[]
}
