import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toggleFavorite } from './api'
import type { Ref } from 'vue'

export function useToggleFavorite(searchRef: Ref<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFavorite,
    
    // TODO: Implement optimistic updates
    // onMutate: async (productId: string) => {
    //   - Cancel outgoing queries
    //   - Snapshot current data
    //   - Optimistically update the cache
    //   - Return context for rollback
    // },
    
    // TODO: Implement error rollback
    // onError: (err, productId, context) => {
    //   - Restore snapshot from context
    // },
    
    // TODO: Invalidate queries on settled
    // onSettled: () => {
    //   - Invalidate products queries
    // },
  })
}
