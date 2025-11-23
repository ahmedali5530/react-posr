import {User} from "@/api/model/user.ts";
import {InventoryPurchaseOrder} from "@/api/model/inventory_purchase_order.ts";
import {InventoryItem} from "@/api/model/inventory_item.ts";
import {InventorySupplier} from "@/api/model/inventory_supplier.ts";
import {InventoryStore} from "@/api/model/inventory_store.ts";

export interface InventoryPurchase {
  id: string
  created_at: string
  created_by: User
  invoice_number: number
  purchase_order?: InventoryPurchaseOrder
  items: InventoryPurchaseItem[]
  supplier?: InventorySupplier
  comments?: string
  documents?: ArrayBuffer[]
  method?: string
  payment_method?: string
  store?: InventoryStore
}

export interface InventoryPurchaseItem {
  id: string
  item: InventoryItem
  quantity: number
  requested?: number
  price: number
  base_quantity: number
  expiry_date?: string
  manufacturing_date?: string
  comments?: string
  supplier?: InventorySupplier
  code?: string
  store?: InventoryStore
  is_done?: boolean
  purchase?: InventoryPurchase
}