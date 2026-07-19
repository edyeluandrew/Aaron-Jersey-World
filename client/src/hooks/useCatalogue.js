import { useQuery, useInfiniteQuery, useQueries } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/navigation';
import {
  fetchCategories,
  fetchCategory,
  fetchFeaturedProducts,
  fetchProduct,
  fetchProductFilters,
  fetchProducts,
  fetchPublicSiteSettings,
  fetchRelatedProducts,
} from '@/services/catalogue';
import { MAIN_CATEGORY_SLUGS, getMainCategoryMeta } from '@/constants/catalogue';

export function useSiteSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.siteSettings,
    queryFn: fetchPublicSiteSettings,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: fetchCategories,
  });
}

export function useCategory(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.category(slug),
    queryFn: () => fetchCategory(slug),
    enabled: Boolean(slug),
  });
}

export function useProducts(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: () => fetchProducts(params),
  });
}

export function useInfiniteProducts(params = {}) {
  const { page: _page, ...rest } = params;

  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.products(rest), 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...rest, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [...QUERY_KEYS.featuredProducts, limit],
    queryFn: () => fetchFeaturedProducts(limit),
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.product(slug),
    queryFn: () => fetchProduct(slug),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(slug, limit = 8) {
  return useQuery({
    queryKey: QUERY_KEYS.relatedProducts(slug),
    queryFn: () => fetchRelatedProducts(slug, limit),
    enabled: Boolean(slug),
  });
}

export function useProductFilters() {
  return useQuery({
    queryKey: QUERY_KEYS.productFilters,
    queryFn: fetchProductFilters,
  });
}

export function useSupplyShowcase() {
  const queries = useQueries({
    queries: MAIN_CATEGORY_SLUGS.map((slug) => ({
      queryKey: QUERY_KEYS.product(slug),
      queryFn: () => fetchProduct(slug),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const products = queries
    .map((query, index) => {
      if (query.data) return query.data;

      return {
        slug: MAIN_CATEGORY_SLUGS[index],
        name: getMainCategoryMeta(MAIN_CATEGORY_SLUGS[index])?.name,
        shortDescription: getMainCategoryMeta(MAIN_CATEGORY_SLUGS[index])?.description,
        images: [],
      };
    })
    .sort(
      (a, b) => MAIN_CATEGORY_SLUGS.indexOf(a.slug) - MAIN_CATEGORY_SLUGS.indexOf(b.slug),
    );

  return {
    products,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
  };
}
