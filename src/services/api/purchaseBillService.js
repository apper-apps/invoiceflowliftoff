import billsData from '@/services/mockData/purchaseBills.json'

let bills = [...billsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const purchaseBillService = {
  async getAll() {
    await delay(300)
    return [...bills]
  },

  async getById(id) {
    await delay(200)
    const bill = bills.find(b => b.Id === parseInt(id))
    if (!bill) {
      throw new Error('Purchase bill not found')
    }
    return { ...bill }
  },

  async create(billData) {
    await delay(400)
    const maxId = Math.max(...bills.map(b => b.Id), 0)
    const newBill = {
      ...billData,
      Id: maxId + 1,
      billNo: this.generateBillNumber(),
      createdAt: new Date().toISOString()
    }
    bills.push(newBill)
    return { ...newBill }
  },

  async update(id, billData) {
    await delay(300)
    const index = bills.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Purchase bill not found')
    }
    bills[index] = { ...bills[index], ...billData }
    return { ...bills[index] }
  },

  async delete(id) {
    await delay(250)
    const index = bills.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Purchase bill not found')
    }
    bills.splice(index, 1)
    return true
  },

  generateBillNumber() {
    const year = new Date().getFullYear()
    const count = bills.filter(b => 
      b.billNo.includes(year.toString())
    ).length + 1
    return `PB-${year}-${count.toString().padStart(3, '0')}`
  }
}