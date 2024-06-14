import { atomWithStorage } from "jotai/utils";
import {atom} from 'jotai';
import { Dish } from "@/api/model/dish.ts";
import { Table } from "@/api/model/table.ts";
import { Category } from "@/api/model/category.ts";
import { ModifierGroup } from "@/api/model/modifier_group.ts";
import { ModifierGroupDish } from "@/api/model/modifier_group_dish.ts";
import { Floor } from "@/api/model/floor.ts";
import { Customer } from "@/api/model/customer.ts";
import { Order } from "@/api/model/order.ts";
import { MenuItem } from "@/api/model/cart_item.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { User } from "@/api/model/user.ts";
import { LabelValue } from "@/api/model/common.ts";
import { DateValue } from "react-aria-components";

export interface AppStateInterface {
  loggedIn: boolean
  floor?: Floor
  table?: Table
  customer?: Customer
  orderType?: OrderType
  persons?: string
  category?: Category
  dish?: Dish
  order?: {
    id?: string|'new'
    order?: Order
  }
  orders: Order[]
  showFloor?: boolean
  showPersons?: boolean
  cart: MenuItem[]
  seats: string[]
  seat?: string
}

export const appState = atomWithStorage<AppStateInterface>(
  "app-state",
  {
    loggedIn: false,
    persons: '1',
    orders: [],
    showFloor: true,
    cart: [],
    seats: [],
    seat: '1'
  }
);

export interface AppPageInterface {
  page: string
  locked?: boolean
  lockedBy?: User
  user?: User
}

export const appPage = atomWithStorage<AppPageInterface>(
  "app-page",
  {
    page: "Login"
  }
);

export interface AppSettingsInterface {
  order_types: OrderType[]
  categories: Category[]
  modifier_groups: ModifierGroup[]
  groups_dishes:  ModifierGroupDish[]
  ordersFilters: {
    users: LabelValue[]
    floors: LabelValue[]
    statuses: LabelValue[]
    orderTypes: LabelValue[],
  },

}

export const appSettings = atomWithStorage<AppSettingsInterface>(
  'app-settings',
  {
    order_types: [],
    categories: [],
    modifier_groups: [],
    groups_dishes: [],
    ordersFilters: {
      users: [],
      floors: [],
      statuses: [],
      orderTypes: [],
    },
  }
);
