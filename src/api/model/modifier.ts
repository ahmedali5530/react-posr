import { ID } from "@/api/model/common.ts";
import { Dish } from "@/api/model/dish.ts";

export interface Modifier extends ID {
  modifier: Dish
  price: number
}
