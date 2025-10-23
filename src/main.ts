import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import './styles.css'

// Create a client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000, // 10 seconds
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const app = createApp(App)

app.use(VueQueryPlugin, { queryClient })

app.mount('#app')

