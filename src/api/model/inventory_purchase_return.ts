import {InventoryPurchase, InventoryPurchaseItem} from "@/api/model/inventory_purchase.ts";
import {User} from "@/api/model/user.ts";
import {InventoryItem} from "@/api/model/inventory_item.ts";
import {InventoryStore} from "@/api/model/inventory_store.ts";
import {InventorySupplier} from "@/api/model/inventory_supplier.ts";

export interface InventoryPurchaseReturn {
  id: string
  purchase?: InventoryPurchase
  created_at: string
  created_by: User
  invoice_number: number
  items: InventoryPurchaseReturnItem[]
  store?: InventoryStore
  documents?: ArrayBuffer[]
}

export interface InventoryPurchaseReturnItem {
  id: string
  item: InventoryItem
  purchase_item?: InventoryPurchaseItem
  quantity: number
  purchased?: number
  price?: number
  comments?: string
  purchase_return?: InventoryPurchaseReturn
  store?: InventoryStore
  supplier?: InventorySupplier
}