import invoicesData from '@/services/mockData/invoices.json'

let invoices = [...invoicesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const invoiceService = {
  async getAll() {
    await delay(300)
    return [...invoices]
  },

  async getById(id) {
    await delay(200)
    const invoice = invoices.find(inv => inv.Id === parseInt(id))
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    return { ...invoice }
  },

  async create(invoiceData) {
    await delay(400)
    const maxId = Math.max(...invoices.map(inv => inv.Id), 0)
    const newInvoice = {
      ...invoiceData,
      Id: maxId + 1,
      invoiceNo: this.generateInvoiceNumber(),
      createdAt: new Date().toISOString()
    }
    invoices.push(newInvoice)
    return { ...newInvoice }
  },

  async update(id, invoiceData) {
    await delay(300)
    const index = invoices.findIndex(inv => inv.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    invoices[index] = { ...invoices[index], ...invoiceData }
    return { ...invoices[index] }
  },

  async delete(id) {
    await delay(250)
    const index = invoices.findIndex(inv => inv.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    invoices.splice(index, 1)
    return true
  },

  async markAsPaid(id, paymentData) {
    await delay(300)
    const invoice = invoices.find(inv => inv.Id === parseInt(id))
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    
    invoice.status = paymentData.amount >= invoice.total ? 'paid' : 'partial'
    invoice.payments = invoice.payments || []
    invoice.payments.push({
      ...paymentData,
      date: new Date().toISOString().split('T')[0]
    })
    
    return { ...invoice }
  },

  generateInvoiceNumber() {
    const year = new Date().getFullYear()
    const count = invoices.filter(inv => 
      inv.invoiceNo.includes(year.toString())
    ).length + 1
    return `INV-${year}-${count.toString().padStart(3, '0')}`
  },

  async getMetrics() {
    await delay(200)
    const totalInvoices = invoices.length
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0)
    const outstanding = invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0)
    const overdue = invoices.filter(inv => inv.status === 'overdue').length

    return {
      totalInvoices,
      totalRevenue,
      outstanding,
      overdue
    }
  }
}