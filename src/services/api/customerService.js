import customersData from '@/services/mockData/customers.json'

let customers = [...customersData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const customerService = {
  async getAll() {
    await delay(250)
    return [...customers]
  },

  async getById(id) {
    await delay(200)
    const customer = customers.find(cust => cust.Id === parseInt(id))
    if (!customer) {
      throw new Error('Customer not found')
    }
    return { ...customer }
  },

  async create(customerData) {
    await delay(350)
    const maxId = Math.max(...customers.map(cust => cust.Id), 0)
    const newCustomer = {
      ...customerData,
      Id: maxId + 1,
      clientId: this.generateClientId(),
      createdDate: new Date().toISOString().split('T')[0],
      totalInvoices: 0,
      totalAmount: 0,
      outstandingAmount: 0
    }
    customers.push(newCustomer)
    return { ...newCustomer }
  },

  async update(id, customerData) {
    await delay(300)
    const index = customers.findIndex(cust => cust.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Customer not found')
    }
    customers[index] = { ...customers[index], ...customerData }
    return { ...customers[index] }
  },

  async delete(id) {
    await delay(250)
    const index = customers.findIndex(cust => cust.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Customer not found')
    }
    customers.splice(index, 1)
    return true
  },

  generateClientId() {
    const count = customers.length + 1
    return `CLI-${count.toString().padStart(3, '0')}`
  },

  async search(query) {
    await delay(200)
    const lowerQuery = query.toLowerCase()
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.clientId.toLowerCase().includes(lowerQuery)
    )
  }
}