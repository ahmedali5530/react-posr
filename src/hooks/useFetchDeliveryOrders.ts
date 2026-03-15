import { useState, useCallback, useEffect, useRef } from "react";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order, OrderStatus, ORDER_FETCHES } from "@/api/model/order.ts";

export const useFetchDeliveryOrders = () => {
  const db = useDB();

  const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchClause = `FETCH ${ORDER_FETCHES.join(", ")}`;

      const [result] = await db.query<any>(
        `SELECT * FROM ${Tables.orders} 
         WHERE delivery != NONE and delivery != {} and delivery != []
           AND status IN $status
         ORDER BY created_at DESC
         ${fetchClause}
         `,
        {
          status: [OrderStatus["In Progress"], OrderStatus['Pending']],
        }
      );

      const ordersData = result;

      if (ordersData && ordersData.length > 0) {
        const orders = ordersData.map((r: any) => r as Order);
        setDeliveryOrders(orders);
      } else {
        setDeliveryOrders([]);
      }
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setDeliveryOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  return {
    deliveryOrders,
    loading,
    error,
    refetch: fetchDeliveryOrders,
  };
};
