import {User} from "@/api/model/user.ts";
import {Kitchen} from "@/api/model/kitchen.ts";
import {InventoryItem} from "@/api/model/inventory_item.ts";
import {InventoryStore} from "@/api/model/inventory_store.ts";

export interface InventoryIssue {
  id: string
  created_at: string
  created_by: User
  kitchen?: Kitchen
  issued_to?: User
  items: InventoryIssueItem[]
  store?: InventoryStore
  invoice_number?: number
}

export interface InventoryIssueItem {
  id: string
  item: InventoryItem
  requested?: number
  quantity: number
  price: number
  comments?: string
  code?: string
  store?: InventoryStore
  issue?: InventoryIssue
}