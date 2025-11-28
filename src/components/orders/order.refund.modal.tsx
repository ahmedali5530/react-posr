import {useEffect, useState} from "react";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import {Order as OrderModel, OrderStatus} from "@/api/model/order.ts";
import {OrderItem} from "@/api/model/order_item.ts";
import {Textarea} from "@/components/common/input/textarea.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {Checkbox} from "@/components/common/input/checkbox.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {StringRecordId} from "surrealdb";
import {useAtom} from "jotai";
import {appPage} from "@/store/jotai.ts";
import {toast} from "sonner";
import {OrderItemName} from "@/components/common/order/order.item.tsx";
import {calculateOrderItemPrice} from "@/lib/cart.ts";
import {withCurrency} from "@/lib/utils.ts";
import {getOrderFilteredItems} from "@/lib/order.ts";

interface OrderRefundModalProps {
  order: OrderModel
  open: boolean
  onClose: () => void
}

export const OrderRefundModal = ({
  order,
  open,
  onClose,
}: OrderRefundModalProps) => {
  const db = useDB();
  const [page] = useAtom(appPage);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedItems(new Set());
      setReason('');
    }
  }, [open]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  }

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }

  const selectedItemsList = getOrderFilteredItems(order).filter(item => selectedItems.has(item.id));
  const refundTotal = selectedItemsList.reduce((sum, item) => sum + calculateOrderItemPrice(item), 0);

  const handleRefund = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to refund');
      return;
    }

    if (!page?.user?.id) {
      toast.error('Unable to identify logged in user');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = new StringRecordId(page.user.id.toString());
      const orderId = new StringRecordId(order.id.toString());
      const itemIds = selectedItemsList.map(item => new StringRecordId(item.id.toString()));

      await db.create(Tables.order_refunds, {
        order: orderId,
        items: itemIds,
        created_at: new Date(),
        manager: userId,
        logged_in_user: userId,
        reason: reason || undefined,
      });

      for(const itemId of itemIds) {
        await db.merge(itemId, {
          is_refunded: true
        })
      }

      // add a tag in original table
      await db.merge(orderId, {
        tags: Array.from(new Set([...(order.tags || []), OrderStatus.Refunded])),
      });

      toast.success(`Successfully refunded ${selectedItems.size} item(s)`);
      onClose();
    } catch (error) {
      console.error('Failed to refund order', error);
      toast.error('Failed to refund order');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Refund order"
      size="full"
    >
      <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left side - Order items */}
          <div className="flex-1 flex flex-col min-w-0">
            <label className="block text-sm font-semibold mb-2">Select items to refund</label>
            <div className="flex-1 overflow-auto border border-neutral-200 rounded-lg p-3 bg-neutral-50" style={{ minHeight: 0 }}>
              {getOrderFilteredItems(order).map(item => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg mb-2 cursor-pointer transition ${
                    selectedItems.has(item.id)
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-white border-2 border-transparent hover:bg-neutral-100'
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <OrderItemName item={item} showPrice showQuantity />
                  </div>
                </div>
              ))}
            </div>
            {selectedItems.size > 0 && (
              <div className="mt-3 p-3 bg-primary-50 rounded-lg flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Refund Total:</span>
                  <span className="font-bold text-lg">{withCurrency(refundTotal)}</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">
                  {selectedItems.size} item(s) selected
                </div>
              </div>
            )}
          </div>

          {/* Right side - Reason */}
          <div className="flex-1 flex flex-col min-w-0">
            <label className="block text-sm font-semibold mb-2">Reason</label>
            <div className="flex-1" style={{ minHeight: 0 }}>
              <Textarea
                value={reason}
                onChange={(event) => setReason(event.currentTarget.value)}
                rows={12}
                placeholder="Enter refund reason"
                enableKeyboard
                className="w-full h-full"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button flat variant="primary" onClick={handleClose} disabled={isSubmitting}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handleRefund}
            isLoading={isSubmitting}
            disabled={isSubmitting || selectedItems.size === 0}
          >
            Refund {selectedItems.size > 0 ? `${selectedItems.size} item(s)` : ''}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

