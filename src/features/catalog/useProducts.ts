import { useQuery } from '@tanstack/vue-query'
import { fetchProducts } from './api'
import type { Ref } from 'vue'

export function useProducts(searchRef: Ref<string>) {
  // TODO: Implement the products query
  // - Use the fetchProducts function from api.ts
  // - Include search parameter in the query key
  // - Pass searchRef.value to fetchProducts
  // - Consider using keepPreviousData for better UX during search
  
  throw new Error('useProducts not implemented yet')
}
