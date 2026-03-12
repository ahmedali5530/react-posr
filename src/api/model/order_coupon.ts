import { Coupon } from "./coupon";

export interface OrderCoupon {
  id: string;
  coupon: Coupon;
  discount: number;
  created_at: Date;
}