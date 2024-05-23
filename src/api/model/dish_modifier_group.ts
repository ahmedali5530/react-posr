import { Dish } from "@/api/model/dish.ts";
import { ModifierGroup } from "@/api/model/modifier_group.ts";

export interface DishModifierGroup {
  in: Dish
  out: ModifierGroup
  required_modifiers?: number
  should_auto_open?: boolean
  has_required_modifiers?: boolean
}
