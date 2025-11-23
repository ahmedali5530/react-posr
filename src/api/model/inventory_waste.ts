import {InventoryPurchase, InventoryPurchaseItem} from "@/api/model/inventory_purchase.ts";
import {InventoryIssue, InventoryIssueItem} from "@/api/model/inventory_issue.ts";
import {User} from "@/api/model/user.ts";
import {InventoryItem} from "@/api/model/inventory_item.ts";

export interface InventoryWaste {
  id: string
  purchase?: InventoryPurchase
  issue?: InventoryIssue
  created_at: string
  created_by: User
  invoice_number: number
  items: InventoryWasteItem[]
  documents?: ArrayBuffer[]
}

export interface InventoryWasteItem {
  id: string
  item: InventoryItem
  purchase_item?: InventoryPurchaseItem
  issue_item?: InventoryIssueItem
  quantity: number
  comments?: string
  documents?: string[]
  source?: string
  waste?: InventoryWaste
}
