import {Dish} from "@/api/model/dish.ts";
import {Tax} from "@/api/model/tax.ts";

export interface Menu {
  id: string
  name: string
  end_time?: Date
  ends_on_next_day?: boolean
  items: MenuMenuItem[]
  start_from?: Date
  active?: boolean
}

export interface MenuMenuItem {
  id: string
  price?: number
  menu_item: Dish
  tax?: Tax
  active?: boolean
}