import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { fetchProducts } from './api'
import type { Ref } from 'vue'

export function useProducts(searchRef: Ref<string>) {
  return useQuery({
    queryKey: ['products', { search: searchRef }] as const,
    queryFn: () => fetchProducts(searchRef.value),
    placeholderData: keepPreviousData,
  })
}

