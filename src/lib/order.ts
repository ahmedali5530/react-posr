import {Order as OrderModel} from '@/api/model/order';

export const getInvoiceNumber = (order: OrderModel) => {
  return `${order.invoice_number}${order.split ? `/${order.split}` : ''}`;
}