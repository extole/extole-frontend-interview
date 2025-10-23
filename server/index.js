import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// In-memory database
let DB = [
  { id: 'p1', name: 'Aluminum Bracket', price: 29.99, favorite: false },
  { id: 'p2', name: 'Steel Gusset', price: 14.5, favorite: true },
  { id: 'p3', name: 'M6 Flanged Nut', price: 0.49, favorite: false },
  { id: 'p4', name: 'Rivnut Tool', price: 64.0, favorite: false },
  { id: 'p5', name: 'Dimple Die 1in', price: 24.75, favorite: false },
]

// Helper functions
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
const maybeFail = () => Math.random() < 0.15 // 15% failure to exercise rollback

// GET /api/products?search=
app.get('/api/products', async (req, res) => {
  await sleep(400)
  const search = (req.query.search || '').trim().toLowerCase()
  const filtered = DB.filter((p) => p.name.toLowerCase().includes(search))
  res.json(filtered)
})

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  await sleep(300)
  const product = DB.find((p) => p.id === req.params.id)
  if (!product) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.json(product)
})

// POST /api/products/:id/favorite
app.post('/api/products/:id/favorite', async (req, res) => {
  await sleep(300)
  
  if (maybeFail()) {
    return res.status(500).json({ error: 'Random server error' })
  }
  
  const product = DB.find((p) => p.id === req.params.id)
  if (!product) {
    return res.status(404).json({ error: 'Not found' })
  }
  
  // Toggle favorite
  product.favorite = !product.favorite
  res.json(product)
})

// POST /api/products
app.post('/api/products', async (req, res) => {
  await sleep(400)
  
  if (maybeFail()) {
    return res.status(500).json({ error: 'Failed to create product' })
  }
  
  const { name, price } = req.body
  
  if (!name || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Invalid input' })
  }
  
  // Generate unique ID
  const maxId = DB.reduce((max, p) => {
    const num = parseInt(p.id.replace('p', ''))
    return num > max ? num : max
  }, 0)
  
  const newProduct = {
    id: `p${maxId + 1}`,
    name,
    price,
    favorite: false,
  }
  
  DB.push(newProduct)
  res.status(201).json(newProduct)
})

app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`)
  console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`)
})

