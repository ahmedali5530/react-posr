import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {RecordId, StringRecordId} from "surrealdb";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { InventoryPurchaseItem } from "@/api/model/inventory_purchase.ts";
import { InventoryPurchaseReturnItem } from "@/api/model/inventory_purchase_return.ts";
import { InventoryIssueItem } from "@/api/model/inventory_issue.ts";
import { InventoryIssueReturnItem } from "@/api/model/inventory_issue_return.ts";
import { InventoryWasteItem } from "@/api/model/inventory_waste.ts";

interface InventoryTotals {
  purchases: number;
  returns: number;
  issues: number;
  issueReturns: number;
  waste: number;
}

interface InventoryRecords {
  purchases: InventoryPurchaseItem[];
  returns: InventoryPurchaseReturnItem[];
  issues: InventoryIssueItem[];
  issueReturns: InventoryIssueReturnItem[];
  waste: InventoryWasteItem[];
}

const initialTotals: InventoryTotals = {
  purchases: 0,
  returns: 0,
  issues: 0,
  issueReturns: 0,
  waste: 0
};

const initialRecords: InventoryRecords = {
  purchases: [],
  returns: [],
  issues: [],
  issueReturns: [],
  waste: []
};

type SumQueryResponse = Array<{ total: number | null }>;

const getTotalFromRows = (rows?: SumQueryResponse) => rows?.[0]?.total ?? 0;

type IdentifierValue = string | undefined;

interface InventoryIdentifiers {
  itemId?: string;
  storeId?: string;
}

const toRecordId = (value?: string | { toString(): string }) => {
  if (!value) return undefined;
  const stringValue = typeof value === "string" ? value : value.toString();
  return new StringRecordId(stringValue);
};

const normalizeIdentifier = (value?: IdentifierValue) =>
  value ? toRecordId(value).toString() : undefined;

export const useStoreInventory = (initialItemId?: IdentifierValue, initialStoreId?: IdentifierValue) => {
  const db = useDB();
  const queryRef = useRef(db.query);

  useEffect(() => {
    queryRef.current = db.query;
  }, [db]);

  const [identifiers, setIdentifiers] = useState<InventoryIdentifiers>({
    itemId: normalizeIdentifier(initialItemId),
    storeId: normalizeIdentifier(initialStoreId)
  });

  const [totals, setTotals] = useState<InventoryTotals>(initialTotals);
  const [records, setRecords] = useState<InventoryRecords>(initialRecords);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setArgs = useCallback((itemId?: IdentifierValue, storeId?: IdentifierValue) => {
    const nextItemId = normalizeIdentifier(itemId);
    const nextStoreId = normalizeIdentifier(storeId);

    setIdentifiers(prev => {
      if (prev.itemId === nextItemId && prev.storeId === nextStoreId) return prev;
      return { itemId: nextItemId, storeId: nextStoreId };
    });
  }, []);

  useEffect(() => {
    const { itemId, storeId } = identifiers;
    if (!itemId || !storeId) {
      setTotals(initialTotals);
      setRecords(initialRecords);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          // Totals queries
          [purchaseTotalsResult],
          [returnTotalsResult],
          [issueTotalsResult],
          [issueReturnTotalsResult],
          [wasteTotalsResult],
          // Records queries
          purchaseRecords,
          returnRecords,
          issueRecords,
          issueReturnRecords,
          wasteRecords
        ] = await Promise.all([
          // Totals
          queryRef.current(
            `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_purchase_items} WHERE item = $item AND store = $store GROUP ALL`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_purchase_return_items} WHERE item = $item AND purchase_item.store = $store GROUP ALL`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_issue_items} WHERE item = $item AND store = $store GROUP ALL`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_issue_return_items} WHERE item = $item AND store = $store GROUP ALL`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT Math::sum(quantity) AS total FROM ${Tables.inventory_waste_items} WHERE item = $item AND purchase_item != null AND purchase_item.store = $store GROUP ALL`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          // Records
          queryRef.current(
            `SELECT *, purchase.created_at as created_at, purchase.invoice_number as invoice_number FROM ${Tables.inventory_purchase_items} WHERE item = $item AND store = $store order by purchase.created_at DESC FETCH item`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT *, purchase_return.created_at as created_at, purchase_return.invoice_number as invoice_number FROM ${Tables.inventory_purchase_return_items} WHERE item = $item AND purchase_item.store = $store order by purchase_return.created_at DESC FETCH item`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT *, issue.created_at as created_at, issue.invoice_number as invoice_number FROM ${Tables.inventory_issue_items} WHERE item = $item AND store = $store order by issue.created_at DESC FETCH item`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT *, issue_return.created_at as created_at, issue_return.invoice_number as invoice_number FROM ${Tables.inventory_issue_return_items} WHERE item = $item AND store = $store order by issue_return.created_at DESC FETCH item`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          ),
          queryRef.current(
            `SELECT *, waste.created_at as created_at, waste.invoice_number as invoice_number FROM ${Tables.inventory_waste_items} WHERE item = $item AND purchase_item != null AND purchase_item.store = $store order by waste.created_at DESC FETCH item`,
            { item: toRecordId(itemId), store: toRecordId(storeId) }
          )
        ]);

        if (!cancelled) {
          // For aggregate queries with GROUP ALL, SurrealDB returns ActionResult[] where result is [{total: number}]
          setTotals({
            purchases: getTotalFromRows(purchaseTotalsResult as SumQueryResponse),
            returns: getTotalFromRows(returnTotalsResult as SumQueryResponse),
            issues: getTotalFromRows(issueTotalsResult as SumQueryResponse),
            issueReturns: getTotalFromRows(issueReturnTotalsResult as SumQueryResponse),
            waste: getTotalFromRows(wasteTotalsResult as SumQueryResponse)
          });

          // Extract records: SurrealDB returns ActionResult[] where each element has a .result property
          // For SELECT queries, we need to map over results and extract .result from each ActionResult
          setRecords({
            purchases: (purchaseRecords[0] || []) as InventoryPurchaseItem[],
            returns: (returnRecords[0] || []) as InventoryPurchaseReturnItem[],
            issues: (issueRecords[0] || []) as InventoryIssueItem[],
            issueReturns: (issueReturnRecords[0] || []) as InventoryIssueReturnItem[],
            waste: (wasteRecords[0] || []) as InventoryWasteItem[]
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch inventory"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [identifiers.itemId, identifiers.storeId]);

  const netQuantity = useMemo(() => {
    return totals.purchases - totals.returns - totals.issues + totals.issueReturns - totals.waste;
  }, [totals]);

  return { identifiers, setArgs, totals, records, netQuantity, loading, error };
};
