import { useState, useCallback, useEffect } from "react";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order } from "@/api/model/order.ts";
import { OrderStatus } from "@/api/model/order.ts";

export const useFetchDeliveryOrders = () => {
  const db = useDB();
  const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeliveryOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [result] = await db.query<any>(
        `SELECT * FROM ${Tables.orders} 
         WHERE delivery != NONE 
           AND status IN $status
         AND delivery.onTheWay != true
         ORDER BY created_at DESC
         FETCH customer, items, items.item, table, user, order_type, discount, tax, payments, payments.payment_type, extras
         `,
        {
          status: [OrderStatus["In Progress"], OrderStatus['Pending']]
        }
      );

      const ordersData = result;
      
      if (ordersData && ordersData.length > 0) {
        const orders = ordersData.map((r: any) => r as Order);
        setDeliveryOrders(orders);
      }
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setDeliveryOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchDeliveryOrders();
  }, [fetchDeliveryOrders]);

  return {
    deliveryOrders,
    loading,
    error,
    refetch: fetchDeliveryOrders,
  };
};

