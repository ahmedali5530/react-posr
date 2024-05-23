import { ID } from "@/api/model/common.ts";
import { Customer } from "@/api/model/customer.ts";
import { Discount } from "@/api/model/discount.ts";
import { Floor } from "@/api/model/floor.ts";
import { Tax } from "@/api/model/tax.ts";
import { OrderItem } from "@/api/model/order_item.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { User } from "@/api/model/user.ts";
import { Table } from "@/api/model/table.ts";

export interface Order extends ID{
  covers?: number
  created_at: string
  customer?: Customer
  floor: Floor
  table: Table
  invoice_number: number
  items: OrderItem[]
  order_type: OrderType
  status: string
  discount?: Discount
  tax?: Tax
  user: User
  tags?: string[]
}

export enum OrderStatus {
  'In Progress' = 'In Progress',
  Paid = 'Paid',
  Completed = 'Completed'
}
