import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createProduct, type CreateProductInput, type Product } from './api'
import type { Ref } from 'vue'

interface CreateProductContext {
  previousProducts?: Product[]
}

export function useCreateProduct(searchRef: Ref<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,

    // Optimistic update
    onMutate: async (input: CreateProductInput) => {
      const queryKey = ['products', { search: searchRef }] as const

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey })

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<Product[]>(queryKey)

      // Optimistically add the new product with a temporary ID
      if (previousProducts) {
        const tempProduct: Product = {
          id: `temp-${Date.now()}`,
          name: input.name,
          price: input.price,
          favorite: false,
        }

        queryClient.setQueryData<Product[]>(queryKey, (old) =>
          old ? [...old, tempProduct] : [tempProduct]
        )
      }

      return { previousProducts } as CreateProductContext
    },

    // Rollback on error
    onError: (_err, _input, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ['products', { search: searchRef }],
          context.previousProducts
        )
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

