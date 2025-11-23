import {User} from "@/api/model/user.ts";
import {Kitchen} from "@/api/model/kitchen.ts";
import {InventoryItem} from "@/api/model/inventory_item.ts";
import {InventoryIssue, InventoryIssueItem} from "@/api/model/inventory_issue.ts";
import {InventoryStore} from "@/api/model/inventory_store.ts";

export interface InventoryIssueReturn {
  id: string
  created_at: string
  created_by: User
  kitchen?: Kitchen
  issued_to?: User
  items: InventoryIssueReturnItem[]
  issuance?: InventoryIssue
  store?: InventoryStore
  invoice_number: number
}

export interface InventoryIssueReturnItem {
  id: string
  item: InventoryItem
  issued_item?: InventoryIssueItem
  issued?: number
  quantity: number
  comments?: string
  store?: InventoryStore
  issue_return?: InventoryIssueReturn
}