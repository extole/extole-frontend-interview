import { useQuery } from '@tanstack/vue-query'
import { fetchProduct } from './api'
import type { Ref } from 'vue'

export function useProduct(idRef: Ref<string | null>, searchRef: Ref<string>) {
  // TODO: Implement the product detail query
  // - Use the fetchProduct function from api.ts
  // - Only enable the query when idRef has a value
  // - Use placeholderData to pull from the products list cache
  
  return useQuery({
    queryKey: ['product'],
    queryFn: () => fetchProduct(''),
    enabled: false,
  })
}
