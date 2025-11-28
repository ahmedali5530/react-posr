import {Order as OrderModel} from '@/api/model/order';

export const getInvoiceNumber = (order: OrderModel) => {
  return `${order.invoice_number}${order.split ? `/${order.split}` : ''}`;
}

export const getOrderFilteredItems = (order: OrderModel) => {
  return order.items
    .filter(item => item.deleted_at === undefined)
    .filter(item => item.is_refunded !== true)
    .filter(item => item.is_suspended !== true);
}