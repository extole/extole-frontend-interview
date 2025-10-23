import { useQuery } from '@tanstack/vue-query'
import { fetchProducts } from './api'
import type { Ref } from 'vue'

export function useProducts(searchRef: Ref<string>) {
  // TODO: Implement the products query
  // - Use the fetchProducts function from api.ts
  // - Include search in the query key
  // - Consider using keepPreviousData to prevent layout shift during search
  
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(''),
  })
}
