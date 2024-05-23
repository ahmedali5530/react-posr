import { ID, Name, Priority } from "@/api/model/common.ts";
import { Discount } from "@/api/model/discount.ts";

export interface PaymentType extends ID, Name, Priority{
  discounts: Discount[]
  has_discount: boolean
  type: string
}
