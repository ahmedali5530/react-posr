import { Category } from "@/api/model/category.ts";
import { ID, Name, Priority } from "@/api/model/common.ts";
import { Tax } from "@/api/model/tax.ts";
import { DishModifierGroup } from "@/api/model/dish_modifier_group.ts";

export interface Dish extends ID, Name, Priority {
  allow_half?: boolean
  categories?: Category[]
  cost?: number
  number: string
  position?: number
  price: number
  photo?: string
  modifier_groups?: DishModifierGroup[]
  allow_service_charges?: boolean
  discount?: number
  tax?: Tax
}
