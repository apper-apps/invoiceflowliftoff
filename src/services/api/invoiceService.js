const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const invoiceService = {
  async getAll() {
    try {
      await delay(300)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_no" } },
          { field: { Name: "date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "customer_name" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "discount" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "payments" } },
          { field: { Name: "ref_no" } },
          { field: { Name: "e_way_bill_no" } },
          { field: { Name: "shipped_via" } },
          { field: { Name: "shipping_date" } },
          { field: { Name: "shipment_type" } },
          { field: { Name: "customer_id" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('app_invoice', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching invoices:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      await delay(200)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "invoice_no" } },
          { field: { Name: "date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "customer_name" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "discount" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "payments" } },
          { field: { Name: "ref_no" } },
          { field: { Name: "e_way_bill_no" } },
          { field: { Name: "shipped_via" } },
          { field: { Name: "shipping_date" } },
          { field: { Name: "shipment_type" } },
          { field: { Name: "customer_id" } }
        ]
      }
      
      const response = await apperClient.getRecordById('app_invoice', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error)
      throw error
    }
  },

  async create(invoiceData) {
    try {
      await delay(400)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Map UI field names to database field names and filter only updateable fields
      const recordData = {
        Name: invoiceData.Name || `Invoice for ${invoiceData.customerName}`,
        invoice_no: invoiceData.invoice_no || this.generateInvoiceNumber(),
        date: invoiceData.date,
        due_date: invoiceData.dueDate,
        customer_name: invoiceData.customerName,
        items: typeof invoiceData.items === 'string' ? invoiceData.items : JSON.stringify(invoiceData.items),
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        discount: invoiceData.discount,
        total: invoiceData.total,
        status: invoiceData.status,
        payments: typeof invoiceData.payments === 'string' ? invoiceData.payments : JSON.stringify(invoiceData.payments || []),
        ref_no: invoiceData.refNo,
        e_way_bill_no: invoiceData.eWayBillNo,
        shipped_via: invoiceData.shippedVia,
        shipping_date: invoiceData.shippingDate,
        shipment_type: invoiceData.shipmentType,
        customer_id: parseInt(invoiceData.customerId)
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('app_invoice', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create invoice')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      throw error
    }
  },

  async update(id, invoiceData) {
    try {
      await delay(300)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Map UI field names to database field names and filter only updateable fields
      const recordData = {
        Id: parseInt(id),
        Name: invoiceData.Name || `Invoice for ${invoiceData.customerName}`,
        invoice_no: invoiceData.invoice_no,
        date: invoiceData.date,
        due_date: invoiceData.dueDate,
        customer_name: invoiceData.customerName,
        items: typeof invoiceData.items === 'string' ? invoiceData.items : JSON.stringify(invoiceData.items),
        subtotal: invoiceData.subtotal,
        tax: invoiceData.tax,
        discount: invoiceData.discount,
        total: invoiceData.total,
        status: invoiceData.status,
        payments: typeof invoiceData.payments === 'string' ? invoiceData.payments : JSON.stringify(invoiceData.payments || []),
        ref_no: invoiceData.refNo,
        e_way_bill_no: invoiceData.eWayBillNo,
        shipped_via: invoiceData.shippedVia,
        shipping_date: invoiceData.shippingDate,
        shipment_type: invoiceData.shipmentType,
        customer_id: parseInt(invoiceData.customerId)
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.updateRecord('app_invoice', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update invoice')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error updating invoice:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      await delay(250)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('app_invoice', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete invoice')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting invoice:", error)
      throw error
    }
  },

  async markAsPaid(id, paymentData) {
    try {
      await delay(300)
      
      // Get the current invoice first
      const invoice = await this.getById(id)
      if (!invoice) {
        throw new Error('Invoice not found')
      }
      
      // Parse current payments if they exist
      let currentPayments = []
      if (invoice.payments) {
        try {
          currentPayments = typeof invoice.payments === 'string' ? JSON.parse(invoice.payments) : invoice.payments
        } catch (e) {
          currentPayments = []
        }
      }
      
      // Add new payment
      currentPayments.push({
        ...paymentData,
        date: new Date().toISOString().split('T')[0]
      })
      
      // Calculate total payments
      const totalPaid = currentPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
      const newStatus = totalPaid >= invoice.total ? 'paid' : 'partial'
      
      // Update the invoice
      const updateData = {
        ...invoice,
        status: newStatus,
        payments: currentPayments
      }
      
      return await this.update(id, updateData)
    } catch (error) {
      console.error("Error marking invoice as paid:", error)
      throw error
    }
  },

  generateInvoiceNumber() {
    const year = new Date().getFullYear()
    const count = Math.floor(Math.random() * 1000) + 1
    return `INV-${year}-${count.toString().padStart(3, '0')}`
  },

  async getMetrics() {
    try {
      await delay(200)
      
      const invoices = await this.getAll()
      const totalInvoices = invoices.length
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0)
      const outstanding = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + (inv.total || 0), 0)
      const overdue = invoices.filter(inv => inv.status === 'overdue').length

      return {
        totalInvoices,
        totalRevenue,
        outstanding,
        overdue
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
      throw error
    }
  }
}