import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode, useRef } from "react";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { Order } from "@/api/model/order.ts";
import { useFetchDeliveryOrders } from "@/hooks/useFetchDeliveryOrders.ts";

export interface DeliveryOrdersProviderState {
  /** List of active delivery orders */
  deliveryOrders: Order[];
  /** Currently selected order for popup */
  selectedOrder: Order | null;
  /** Open popup for a specific order */
  openOrderPopup: (order: Order) => void;
  /** Close the popup */
  closeOrderPopup: () => void;
  /** Whether popup is open */
  isPopupOpen: boolean;
}

export const DeliveryOrdersContext = createContext<DeliveryOrdersProviderState | undefined>(undefined);

export interface DeliveryOrdersProviderProps {
  children: ReactNode;
}

export const DeliveryOrdersProvider: React.FC<DeliveryOrdersProviderProps> = ({ children }) => {
  const db = useDB();
  const { deliveryOrders, refetch: fetchDeliveryOrders } = useFetchDeliveryOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [liveQuery, setLiveQuery] = useState<any>(null);
  const processedOrderIdsRef = useRef<Set<string>>(new Set());

  // Check for new orders and show popup
  useEffect(() => {
    if (deliveryOrders.length > 0) {
      // Check for new orders that haven't been processed
      const newOrders = deliveryOrders.filter(order => {
        const orderId = order.id.toString();
        return !processedOrderIdsRef.current.has(orderId);
      });

      // If there are new orders, show popup for the most recent one
      if (newOrders.length > 0) {
        const newestOrder = newOrders.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        
        // Mark as processed
        processedOrderIdsRef.current.add(newestOrder.id.toString());
        
        // Show popup
        setSelectedOrder(newestOrder);
        setIsPopupOpen(true);
      }
    }
  }, [deliveryOrders]);

  // Set up live query to watch for new delivery orders
  useEffect(() => {
    let isMounted = true;
    let queryId: any = null;

    const runLiveQuery = async () => {
      try {
        const result = await db.live(Tables.orders, (action: string) => {
          if (!isMounted) return;
          
          // Only process CREATE actions for new orders
          if (action === "CREATE") {
            fetchDeliveryOrders();
          } else if (action === "UPDATE") {
            // Also refresh on updates in case status changes
            fetchDeliveryOrders();
          }
        });
        
        if (isMounted) {
          queryId = result;
          setLiveQuery(result);
        }
      } catch (error) {
        console.error("Error setting up live query:", error);
      }
    };

    // Set up live query
    runLiveQuery();

    return () => {
      isMounted = false;
      if (queryId) {
        db.db.kill(queryId).catch(console.error);
      }
    };
  }, []);

  const openOrderPopup = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  }, []);

  const closeOrderPopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  }, []);

  const value: DeliveryOrdersProviderState = useMemo(
    () => ({
      deliveryOrders,
      selectedOrder,
      openOrderPopup,
      closeOrderPopup,
      isPopupOpen,
    }),
    [deliveryOrders, selectedOrder, openOrderPopup, closeOrderPopup, isPopupOpen]
  );

  return (
    <DeliveryOrdersContext.Provider value={value}>
      {children}
    </DeliveryOrdersContext.Provider>
  );
};



