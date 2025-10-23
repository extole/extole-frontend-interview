import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

export type Product = { id: string; name: string; price: number; favorite: boolean }

export type CreateProductInput = { name: string; price: number }

export async function fetchProducts(search: string): Promise<Product[]> {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/products`, {
    params: { search },
  })
  return response.data
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`)
  return response.data
}

export async function toggleFavorite(id: string): Promise<Product> {
  const response = await axios.post<Product>(`${API_BASE_URL}/products/${id}/favorite`)
  return response.data
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await axios.post<Product>(`${API_BASE_URL}/products`, input)
  return response.data
}

