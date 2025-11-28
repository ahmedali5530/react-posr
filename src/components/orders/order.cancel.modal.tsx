import {useEffect, useMemo, useState} from "react";
import {Modal} from "@/components/common/react-aria/modal.tsx";
import {Order as OrderModel, OrderStatus} from "@/api/model/order.ts";
import {OrderVoidReason} from "@/api/model/order_void.ts";
import {Textarea} from "@/components/common/input/textarea.tsx";
import {Button} from "@/components/common/input/button.tsx";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {StringRecordId} from "surrealdb";
import {useAtom} from "jotai";
import {appPage} from "@/store/jotai.ts";
import {toast} from "sonner";
import {getOrderFilteredItems} from "@/lib/order.ts";

interface OrderCancelModalProps {
  order: OrderModel
  open: boolean
  onClose: () => void
}

type ReasonOption = {
  label: string
  value: OrderVoidReason
}

export const OrderCancelModal = ({
  order,
  open,
  onClose,
}: OrderCancelModalProps) => {
  const db = useDB();
  const [page] = useAtom(appPage);

const reasonOptions = useMemo<ReasonOption[]>(() => {
  return Object.values(OrderVoidReason).map((reason) => ({
    label: reason,
    value: reason as OrderVoidReason,
  }));
}, []);

const [selectedReason, setSelectedReason] = useState<OrderVoidReason | null>(reasonOptions[0]?.value ?? null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedReason(reasonOptions[0]?.value ?? null);
      setComments('');
    }
  }, [open, reasonOptions]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  }

  const handleConfirm = async () => {
    if (!selectedReason) {
      toast.error('Please choose a reason');
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

      await db.merge(orderId, {
        status: OrderStatus.Cancelled,
        tags: Array.from(new Set([...(order.tags || []), OrderStatus.Cancelled])),
      });

      for (const item of getOrderFilteredItems(order)) {
        const itemId = new StringRecordId(item.id.toString());
        await db.create(Tables.order_voids, {
          comments: comments || undefined,
          created_at: new Date(),
          deleted_by: userId,
          logged_in_user: userId,
          order: orderId,
          order_item: itemId,
          quantity: item.quantity,
          reason: selectedReason,
          items: [itemId],
        });
      }

      toast.success('Order cancelled successfully');
      onClose();
    } catch (error) {
      console.error('Failed to cancel order', error);
      toast.error('Failed to cancel order');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cancel order"
      size="md"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Reason</label>
          <div className="grid grid-cols-2 gap-3">
            {reasonOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-xl border-2 px-3 py-4 text-left text-base font-semibold transition ${
                  selectedReason === option.value
                    ? 'border-danger-500 bg-danger-50 text-danger-600'
                    : 'border-neutral-200 bg-white hover:border-neutral-400'
                }`}
                onClick={() => setSelectedReason(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Comments</label>
          <Textarea
            value={comments}
            onChange={(event) => setComments(event.currentTarget.value)}
            rows={4}
            placeholder="Enter comments"
            enableKeyboard
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button flat variant="primary" onClick={handleClose} disabled={isSubmitting}>Close</Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Confirm cancellation
          </Button>
        </div>
      </div>
    </Modal>
  )
}

