import { ID } from "@/api/model/common.ts";
import { Customer } from "@/api/model/customer.ts";
import { Discount, DiscountType } from "@/api/model/discount.ts";
import { Floor } from "@/api/model/floor.ts";
import { Tax } from "@/api/model/tax.ts";
import { OrderItem } from "@/api/model/order_item.ts";
import { OrderType } from "@/api/model/order_type.ts";
import { User } from "@/api/model/user.ts";
import { Table } from "@/api/model/table.ts";
import { OrderPayment } from "@/api/model/order_payment.ts";

export interface Order extends ID{
  covers?: number
  created_at: Date
  customer?: Customer
  floor: Floor
  table: Table
  invoice_number: number
  split?: number
  items: OrderItem[]
  order_type: OrderType
  status: string

  discount?: Discount
  discount_amount?: number

  tax?: Tax
  tax_amount?: number

  service_charge_type?: string
  service_charge?: number
  service_charge_amount?: number

  tip?: number
  tip_amount?: number
  tip_type?: DiscountType

  user: User
  tags?: string[]

  extras?: OrderExtra[]

  payments?: OrderPayment[]
}

export interface OrderExtra extends ID{
  name: string
  value: number
}

export enum OrderStatus {
  'In Progress' = 'In Progress',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
  Spilt = 'Spilt',
  Merged = 'Merged'
}
