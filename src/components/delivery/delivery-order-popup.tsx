import React, {useMemo} from "react";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import {Order, OrderStatus} from "@/api/model/order.ts";
import {Button} from "@/components/common/input/button.tsx";
import {faCheck, faChevronLeft, faChevronRight, faMapMarkerAlt, faTimes, faPersonBiking} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {calculateOrderItemPrice, calculateOrderTotal} from "@/lib/cart.ts";
import {getInvoiceNumber, getOrderFilteredItems} from "@/lib/order.ts";
import {useDB} from "@/api/db/db.ts";
import {toast} from "sonner";
import {DateTime} from "luxon";
import {useDeliveryOrders} from "@/hooks/useDeliveryOrders.ts";
import {OrderItemName} from "@/components/common/order/order.item.tsx";

interface DeliveryOrderPopupProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export const DeliveryOrderPopup: React.FC<DeliveryOrderPopupProps> = ({
  order,
  open,
  onClose,
}) => {
  const db = useDB();
  const {deliveryOrders, openOrderPopup} = useDeliveryOrders();

  const items = useMemo(() => getOrderFilteredItems(order), [order]);
  const itemsTotal = useMemo(() => calculateOrderTotal(order), [order]);

  const total = useMemo(() => {
    const extrasTotal = order?.extras ? order.extras.reduce((prev, item) => prev + Number(item.value), 0) : 0;
    return itemsTotal + extrasTotal + Number(order?.tax_amount || 0) - Number(order?.discount_amount || 0) + Number(order.service_charge_amount ?? 0);
  }, [itemsTotal, order]);

  const customer = order.customer;
  const delivery = order.delivery as any;

  // Find current order index and get next/previous orders
  const currentIndex = useMemo(() => {
    return deliveryOrders.findIndex(o => o.id.toString() === order.id.toString());
  }, [deliveryOrders, order]);

  const hasNext = currentIndex < deliveryOrders.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      openOrderPopup(deliveryOrders[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      openOrderPopup(deliveryOrders[currentIndex - 1]);
    }
  };

  const sendForDelivery = async () => {
    try {
      await db.merge(order.id, {
        // status: OrderStatus["In Progress"],
        delivery: {
          ...order.delivery,
          onTheWay: true
        }
      });

      toast.success(`Order ${getInvoiceNumber(order)} sent for delivery`);
      onClose();
    } catch (error) {
      console.error("Error sending order:", error);
      toast.error("Failed to send order");
    }
  }

  const handleAccept = async () => {
    try {
      await db.merge(order.id, {
        status: OrderStatus["In Progress"],
      });

      toast.success(`Order ${getInvoiceNumber(order)} accepted`);
      onClose();
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order");
    }
  };

  const handleReject = async () => {
    try {
      // Update order status to cancelled
      await db.merge(order.id, {
        status: OrderStatus.Cancelled,
        tags: Array.from(new Set([...(order.tags || []), OrderStatus.Cancelled])),
      });

      toast.error(`Order ${getInvoiceNumber(order)} rejected`);
      onClose();
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error("Failed to reject order");
    }
  };

  // const handleViewDetails = () => {
  //   // Navigate to order details or open a detailed view
  //   // For now, just show a message
  //   // toast.info("View order details - implement navigation as needed");
  // };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Delivery Order - ${getInvoiceNumber(order)}`}
      size="lg"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className="space-y-6">
        {/* Navigation Buttons */}
        {deliveryOrders.length > 1 && (
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <Button
              variant="primary"
              onClick={handlePrevious}
              icon={faChevronLeft}
              disabled={!hasPrevious}
            >
              Previous
            </Button>
            <span className="text-sm text-neutral-600">
              Order {currentIndex + 1} of {deliveryOrders.length}
            </span>
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={faChevronRight}
              disabled={!hasNext}
            >
              Next
            </Button>
          </div>
        )}

        {/* Customer Information */}
        {customer && (
          <div className="bg-gray-200 p-4 rounded-lg border-2 border-gray-300">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-neutral-600">Name</label>
                <p className="text-base">{customer.name}</p>
              </div>
              {customer.phone && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">Phone</label>
                  <p className="text-base"><a href={`tel:${customer.phone}`}>{customer.phone}</a></p>
                </div>
              )}
              {customer.email && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">Email</label>
                  <p className="text-base"><a href={`mailto:${customer.email}`}>{customer.email}</a></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Address Section */}
        <div className="bg-primary-100 p-4 rounded-lg border-2 border-primary-200">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600"/>
            <span>Delivery Address</span>
          </h3>
          <div className="space-y-2">
            {delivery?.address ? (
              <>
                <p className="text-base font-medium">{delivery.address}</p>
                {delivery.secondary_address && (
                  <p className="text-base text-neutral-600">{delivery.secondary_address}</p>
                )}
                {delivery.postal_code && (
                  <p className="text-sm text-neutral-500">Postal Code: {delivery.postal_code}</p>
                )}
              </>
            ) : customer?.address ? (
              <>
                <p className="text-base font-medium">{customer.address}</p>
                {customer.secondary_address && (
                  <p className="text-base text-neutral-600">{customer.secondary_address}</p>
                )}
                {customer.postal_code && (
                  <p className="text-sm text-neutral-500">Postal Code: {customer.postal_code}</p>
                )}
              </>
            ) : (
              <p className="text-base text-neutral-500 italic">No delivery address provided</p>
            )}
            {(delivery?.lat && delivery?.lng) && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <span>Coordinates</span>
                  <span className="text-xs text-neutral-500">({delivery.lat}, {delivery.lng})</span>
                </label>
              </div>
            )}
            {(customer?.lat && customer?.lng && !delivery?.lat) && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <span>Coordinates</span>
                  <span className="text-xs text-neutral-500">({customer.lat}, {customer.lng})</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-success-100 p-4 rounded-lg border-2 border-success-200">
          <h3 className="text-lg font-semibold mb-3">Order Details</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-neutral-600">Status:</span>
              <span className="text-base font-semibold">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-neutral-600">Created:</span>
              <span className="text-base">
                {DateTime.fromJSDate(new Date(order.created_at)).toFormat("yyyy-MM-dd hh:mm a")}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Items ({items.length})</h4>
            <div className="space-y-2">
              {items.map((item, index) => (
                <OrderItemName item={item} key={index} showGroups={true} showPrice={true} showQuantity={true} />
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Subtotal:</span>
                <span className="text-base">{itemsTotal.toFixed(2)}</span>
              </div>
              {order.discount_amount && order.discount_amount > 0 ? (
                <div className="flex justify-between text-red-600">
                  <span className="text-sm font-medium">Discount:</span>
                  <span className="text-base">-{order.discount_amount.toFixed(2)}</span>
                </div>
              ) : null}
              {order.tax_amount && order.tax_amount > 0 ? (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tax:</span>
                  <span className="text-base">{order.tax_amount.toFixed(2)}</span>
                </div>
              ) : null}
              {order.service_charge_amount && order.service_charge_amount > 0 ? (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Service Charge:</span>
                  <span className="text-base">{order.service_charge_amount.toFixed(2)}</span>
                </div>
              ) : null}
              {order.extras && order.extras.length > 0 ? (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Extras:</span>
                  <span className="text-base">
                    {order.extras.reduce((prev, item) => prev + Number(item.value), 0).toFixed(2)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between pt-2 border-t border-neutral-300">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
          {order.status === OrderStatus.Pending && (
            <>
              <Button
                variant="danger"
                onClick={handleReject}
                icon={faTimes}
                size="lg"
              >
                Reject
              </Button>
              <Button
                variant="success"
                onClick={handleAccept}
                icon={faCheck}
                size="lg"
              >
                Accept
              </Button>
            </>
          )}

          {order.status === OrderStatus["In Progress"] && (
            <Button
              variant="success"
              onClick={sendForDelivery}
              icon={faPersonBiking}
              size="lg"
            >
              Send for delivery
            </Button>
          )}

        </div>
      </div>
    </Modal>
  );
};

