import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const DEFAULTS = {
  page: '1',
  limit: '12',
  sort: 'featured',
};

export function useCatalogueParams(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lockCategory = false, category: defaultCategory = '', ...restDefaults } = defaults;
  const mergedDefaults = { ...DEFAULTS, ...restDefaults };

  const rawSearch = searchParams.get('search') || searchParams.get('q') || defaults.search || '';
  const debouncedSearch = useDebouncedValue(rawSearch);

  const params = useMemo(() => {
    const page = Number(searchParams.get('page') || mergedDefaults.page);
    const limit = Number(searchParams.get('limit') || mergedDefaults.limit);

    return {
      page,
      limit,
      search: debouncedSearch || undefined,
      category: lockCategory
        ? defaultCategory || undefined
        : searchParams.get('category') || defaultCategory || undefined,
      stockStatus: searchParams.get('stockStatus') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      size: searchParams.get('size') || undefined,
      colour: searchParams.get('colour') || undefined,
      sort: searchParams.get('sort') || mergedDefaults.sort,
    };
  }, [
    searchParams,
    debouncedSearch,
    defaultCategory,
    lockCategory,
    mergedDefaults.limit,
    mergedDefaults.page,
    mergedDefaults.sort,
  ]);

  const uiValues = {
    search: rawSearch,
    category: lockCategory ? defaultCategory : searchParams.get('category') || defaultCategory || '',
    stockStatus: searchParams.get('stockStatus') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    colour: searchParams.get('colour') || '',
    sort: searchParams.get('sort') || mergedDefaults.sort,
  };

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (lockCategory && key === 'category') return;
      if (value === '' || value == null) next.delete(key);
      else next.set(key, String(value));
    });

    if (lockCategory && defaultCategory) {
      next.set('category', defaultCategory);
    }

    if (!('page' in updates)) {
      next.set('page', '1');
    }

    setSearchParams(next);
  };

  const clearParams = () => {
    const next = new URLSearchParams();
    if (defaultCategory) next.set('category', defaultCategory);
    next.set('sort', mergedDefaults.sort);
    setSearchParams(next);
  };

  const setPage = (page) => updateParams({ page });

  return { params, uiValues, updateParams, clearParams, setPage };
}
