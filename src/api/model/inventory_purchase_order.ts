import {InventoryItem} from "@/api/model/inventory_item.ts";
import {InventorySupplier} from "@/api/model/inventory_supplier.ts";
import {InventoryStore} from "@/api/model/inventory_store.ts";

export interface InventoryPurchaseOrder {
  id: string
  po_number: number
  created_at: string
  status: string
  supplier?: InventorySupplier
  items: InventoryPurchaseOrderItem[]
}

export interface InventoryPurchaseOrderItem {
  id: string
  item: InventoryItem
  quantity: number
  price?: number
  supplier?: InventorySupplier
  store?: InventoryStore
  purchase_order?: InventoryPurchaseOrder
}

export enum PurchaseOrderStatus {
  pending = 'Pending',
  fulfilled = 'Fulfilled'
}