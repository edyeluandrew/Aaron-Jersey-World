import { useQuery } from '@tanstack/react-query';
import { fetchHeroBanners } from '@/services/banners';

export const BANNER_QUERY_KEYS = {
  public: ['banners', 'public'],
  admin: ['admin', 'banners'],
};

export function useHeroBanners() {
  return useQuery({
    queryKey: BANNER_QUERY_KEYS.public,
    queryFn: fetchHeroBanners,
    staleTime: 1000 * 60 * 5,
  });
}
