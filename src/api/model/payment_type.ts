import { ID, Name, Priority } from "@/api/model/common.ts";
import { Discount } from "@/api/model/discount.ts";
import { Tax } from "@/api/model/tax.ts";

export interface PaymentType extends ID, Name, Priority{
  discounts?: Discount[]
  has_discount: boolean
  type: string
  tax?: Tax
}
