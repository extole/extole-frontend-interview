import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toggleFavorite, type Product } from './api'
import type { Ref } from 'vue'

interface ToggleFavoriteContext {
  previousProducts?: Product[]
  previousProduct?: Product
}

export function useToggleFavorite(searchRef: Ref<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFavorite,

    // Optimistic update
    onMutate: async (productId: string) => {
      const queryKey = ['products', { search: searchRef }] as const
      const productQueryKey = ['product', { id: productId }] as const

      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: productQueryKey })

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<Product[]>(queryKey)
      const previousProduct = queryClient.getQueryData<Product>(productQueryKey)

      // Optimistically update the list cache
      if (previousProducts) {
        queryClient.setQueryData<Product[]>(queryKey, (old) =>
          old
            ? old.map((p) =>
                p.id === productId ? { ...p, favorite: !p.favorite } : p
              )
            : old
        )
      }

      // Optimistically update the detail cache if it exists
      if (previousProduct) {
        queryClient.setQueryData<Product>(productQueryKey, (old) =>
          old ? { ...old, favorite: !old.favorite } : old
        )
      }

      // Return context with snapshot for rollback
      return { previousProducts, previousProduct } as ToggleFavoriteContext
    },

    // Rollback on error
    onError: (err, productId, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ['products', { search: searchRef }],
          context.previousProducts
        )
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(
          ['product', { id: productId }],
          context.previousProduct
        )
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', { id: productId }] })
    },
  })
}

