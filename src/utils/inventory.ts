import type {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";

type DatabaseClient = ReturnType<typeof useDB>;

/**
 * Extracts the total quantity from a SurrealDB query result
 */
const getTotalFromResult = (result: any): number => {
  if (!result || !Array.isArray(result) || result.length === 0) return 0;
  const first = result[0];
  if (Array.isArray(first) && first.length > 0) {
    return Number(first[0]?.total ?? 0);
  }
  return Number(first?.total ?? 0);
};

/**
 * Fetches the net available quantity of an item in a specific store
 * by calculating: purchases - returns - issues + issueReturns - waste
 * 
 * @param db - Database client instance
 * @param itemId - The item ID (string)
 * @param storeId - The store ID (string)
 * @returns Promise resolving to the net available quantity
 */
export const fetchNetQuantity = async (
  db: DatabaseClient,
  itemId: string,
  storeId: string
): Promise<number> => {
  const params = { item: itemId, store: storeId };

  const [
    [purchaseRows],
    [returnRows],
    [issueRows],
    [issueReturnRows],
    [wasteRows],
  ] = await Promise.all([
    db.query(
      `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_purchase_items} WHERE item = $item AND store = $store GROUP ALL`,
      params
    ),
    db.query(
      `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_purchase_return_items} WHERE item = $item AND store = $store GROUP ALL`,
      params
    ),
    db.query(
      `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_issue_items} WHERE item = $item AND store = $store GROUP ALL`,
      params
    ),
    db.query(
      `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_issue_return_items} WHERE item = $item AND store = $store GROUP ALL`,
      params
    ),
    db.query(
      `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_waste_items} WHERE item = $item AND purchase_item != null AND purchase_item.store = $store GROUP ALL`,
      params
    ),
  ]);

  const purchaseTotal = getTotalFromResult(purchaseRows);
  const returnTotal = getTotalFromResult(returnRows);
  const issueTotal = getTotalFromResult(issueRows);
  const issueReturnTotal = getTotalFromResult(issueReturnRows);
  const wasteTotal = getTotalFromResult(wasteRows);

  return purchaseTotal - returnTotal - issueTotal + issueReturnTotal - wasteTotal;
};

