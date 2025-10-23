import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchProduct, type Product } from './api'
import type { Ref } from 'vue'
import { computed } from 'vue'

export function useProduct(idRef: Ref<string | null>, searchRef: Ref<string>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['product', { id: idRef }] as const,
    queryFn: () => fetchProduct(idRef.value!),
    enabled: computed(() => !!idRef.value),
    placeholderData: () => {
      // Try to get the product from the list cache to avoid empty states
      const productsCache = queryClient.getQueryData<Product[]>([
        'products',
        { search: searchRef },
      ])
      if (productsCache && idRef.value) {
        return productsCache.find((p) => p.id === idRef.value)
      }
      return undefined
    },
  })
}

