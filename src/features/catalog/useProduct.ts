import { useQuery } from '@tanstack/vue-query'
import { fetchProduct } from './api'
import type { Ref } from 'vue'

export function useProduct(idRef: Ref<string | null>, searchRef: Ref<string>) {
  // TODO: Implement the product detail query
  // - Use the fetchProduct function from api.ts
  // - Include id parameter in the query key
  // - Only enable the query when idRef has a value (use computed)
  // - Use placeholderData to pull from the products list cache to avoid flash
  
  throw new Error('useProduct not implemented yet')
}
