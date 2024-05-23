import { ID, Name, Priority } from "@/api/model/common.ts";
import { Printer } from "@/api/model/printer.ts";
import { Dish } from "@/api/model/dish.ts";

export interface Kitchen extends ID, Name, Priority{
  items: Dish[]
  printers: Printer[]
}
