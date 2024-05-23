import { useMemo, useState } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useDB } from "@/api/db/db.ts";
import { useQueryBuilder } from "@/api/db/query-builder.ts";

export interface UseApiResult<T = any> {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  filters: string[];
  handleFilterChange: (newFilters: string[], condition?: 'and'|'or') => void;
  addFilter: (filter: string, condition?: 'and'|'or') => void;
  resetFilters: () => void;
  sorts: string[];
  handleSortChange: (newSort: string[]) => void;
  page: number;
  handlePageChange: (newPage: number) => void;
  pageSize: number;
  handlePageSizeChange: (newPageSize: number) => void;
  selects: string[];
  handleSelectsChange: (newSelects: string[]) => void;
  splits: string[];
  handleSplitsChange: (newSplits: string[]) => void;
  fetches: string[];
  handleFetchesChange: (newFetches: string[]) => void;
  groups: string[];
  handleGroupsChange: (newGroups: string[]) => void;
  parameters: Record<string, any>
  handleParameterChange: (newParameters: Record<string, any>) => void;
  fetchData: () => void;
  fetch: () => void;
}

export interface SettingsData<T = any> {
  total?: number;
  data?: T[]
}

function useApi<T>(
  table: string,
  initialFilters: string[] = [],
  initialSort: string[] = [],
  initialOffset: number = 0,
  initialLimit: number = 10,
  initialFetches: string[] = [],
  useApiOptions?: any,
): UseApiResult<T> {
  const [filters, setFilters] = useState<string[]>(initialFilters);
  const [sorts, setSorts] = useState<string[]>(initialSort);
  const [page, setPage] = useState<number>(initialOffset);
  const [pageSize, setPageSize] = useState<number>(initialLimit);
  const [selects, setSelects] = useState<string[]>([]);
  const [splits, setSplits] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [fetches, setFetches] = useState<string[]>(initialFetches);
  const [parameters, setParameters] = useState({});

  const queryClient = useQueryClient();
  const db = useDB();
  const queryBuilder = useQueryBuilder(table, '*', initialFilters, initialLimit, initialOffset, initialSort, initialFetches);

  const mainQuery = useMemo(() => {
    return queryBuilder.queryString;
  }, [filters, sorts, page, pageSize, selects, splits, groups, fetches, parameters]);

  const queryKeys = [table, { filters, sorts, page, pageSize, selects, splits, groups, fetches, parameters, mainQuery }];

  const fetchFilteredData = async () => {
    const totalQuery = await db.query(`Select count() from ${table} group all`);
    const listQuery = await db.query(mainQuery, queryBuilder.parameters);

    return{
      total: totalQuery[0][0]?.count || 0,
      data: listQuery[0] || []
    };
  }

  const {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  }: UseQueryResult<T> = useQuery({
    queryKey: queryKeys,
    queryFn: fetchFilteredData,
    refetchOnWindowFocus: false,
    retry: false,
    gcTime: 0,
    ...useApiOptions,
  });

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(initialOffset);

    queryBuilder.setOffset(initialOffset);
    queryBuilder.setLimit(initialLimit);
    queryBuilder.setOrderBys(initialSort);
    queryBuilder.setWheres(initialFilters);
  }

  const handleFilterChange = (newFilters: string[], condition = 'and'): void => {
    setFilters(newFilters);

    newFilters.forEach(c => {
      queryBuilder.setWhere(c, condition, parameters);
    });

    setPage(0);
    queryBuilder.setOffset(0);
  };

  const addFilter = (newFilter: string, condition = 'and', params?: Record<string, any>) => {
    setFilters(prev => [
      ...prev,
      newFilter
    ]);

    queryBuilder.addWhere(newFilter, condition, params);
  }

  const handleSortChange = (newSort: string[]): void => {
    setSorts(newSort);
    setPage(0);

    queryBuilder.setOffset(0);
    queryBuilder.setOrderBys(newSort);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    queryBuilder.setOffset(newPage);
  };

  const handlePageSizeChange = (newPageSize: number): void => {
    setPageSize(newPageSize);
    queryBuilder.setLimit(newPageSize);
  }

  const handleSplitsChange = (newSplits: string[]) => {
    setSplits(newSplits);
    queryBuilder.setSplits(newSplits);
  }

  const handleSelectsChange = (newSelects: string[]) => {
    setSelects(newSelects);
    queryBuilder.setSelects(newSelects);
  }

  const handleGroupsChange = (newGroups: string[]) => {
    setGroups(newGroups);
    queryBuilder.setGroups(newGroups);
  }

  const handleFetchesChange = (newFetches: string[]) => {
    setFetches(newFetches);
    queryBuilder.setFetches(newFetches);
  }

  const handleParameterChange = (newParameters: Record<string, any>) => {
    setParameters(newParameters);
    queryBuilder.setParameters(newParameters);
  }

  const manualFetch = async (): Promise<any> => {
    return await queryClient.prefetchQuery({
      queryKey: queryKeys,
      queryFn: fetchFilteredData,
      refetchOnWindowFocus: false,
      ...useApiOptions,
    });
  }

  return {
    splits, handleSplitsChange,
    selects, handleSelectsChange,
    fetches, handleFetchesChange,
    groups, handleGroupsChange,
    isError, error,
    filters, resetFilters, handleFilterChange, addFilter,
    sorts, handleSortChange,
    page, pageSize,
    handlePageChange, handlePageSizeChange,
    data,
    fetchData: refetch, fetch: manualFetch, isFetching, isLoading,
    parameters, handleParameterChange,
  };
}

export default useApi;
