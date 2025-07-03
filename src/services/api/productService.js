import productsData from '@/services/mockData/products.json'

let products = [...productsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(250)
    return [...products]
  },

  async getById(id) {
    await delay(200)
    const product = products.find(prod => prod.Id === parseInt(id))
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  },

  async create(productData) {
    await delay(350)
    const maxId = Math.max(...products.map(prod => prod.Id), 0)
    const newProduct = {
      ...productData,
      Id: maxId + 1,
      isActive: true
    }
    products.push(newProduct)
    return { ...newProduct }
  },

  async update(id, productData) {
    await delay(300)
    const index = products.findIndex(prod => prod.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Product not found')
    }
    products[index] = { ...products[index], ...productData }
    return { ...products[index] }
  },

  async delete(id) {
    await delay(250)
    const index = products.findIndex(prod => prod.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Product not found')
    }
    products.splice(index, 1)
    return true
  },

  async search(query) {
    await delay(200)
    const lowerQuery = query.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.hsnCode.includes(query)
    )
  }
}