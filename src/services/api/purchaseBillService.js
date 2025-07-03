const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const purchaseBillService = {
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
          { field: { Name: "bill_no" } },
          { field: { Name: "vendor_id" } },
          { field: { Name: "vendor_name" } },
          { field: { Name: "date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "discount" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "ref_no" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('purchase_bill', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching purchase bills:", error)
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
          { field: { Name: "bill_no" } },
          { field: { Name: "vendor_id" } },
          { field: { Name: "vendor_name" } },
          { field: { Name: "date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "discount" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "ref_no" } }
        ]
      }
      
      const response = await apperClient.getRecordById('purchase_bill', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching purchase bill with ID ${id}:`, error)
      throw error
    }
  },

  async create(billData) {
    try {
      await delay(400)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Map UI field names to database field names and filter only updateable fields
      const recordData = {
        Name: billData.Name || `Purchase Bill from ${billData.vendorName}`,
        bill_no: billData.billNo || this.generateBillNumber(),
        vendor_id: billData.vendorId,
        vendor_name: billData.vendorName,
        date: billData.date,
        due_date: billData.dueDate,
        items: typeof billData.items === 'string' ? billData.items : JSON.stringify(billData.items),
        subtotal: billData.subtotal,
        tax: billData.tax,
        discount: billData.discount,
        total: billData.total,
        status: billData.status,
        ref_no: billData.refNo
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('purchase_bill', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create purchase bill')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error creating purchase bill:", error)
      throw error
    }
  },

  async update(id, billData) {
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
        Name: billData.Name,
        bill_no: billData.billNo,
        vendor_id: billData.vendorId,
        vendor_name: billData.vendorName,
        date: billData.date,
        due_date: billData.dueDate,
        items: typeof billData.items === 'string' ? billData.items : JSON.stringify(billData.items),
        subtotal: billData.subtotal,
        tax: billData.tax,
        discount: billData.discount,
        total: billData.total,
        status: billData.status,
        ref_no: billData.refNo
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.updateRecord('purchase_bill', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update purchase bill')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error updating purchase bill:", error)
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
      
      const response = await apperClient.deleteRecord('purchase_bill', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete purchase bill')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting purchase bill:", error)
      throw error
    }
  },

  generateBillNumber() {
    const year = new Date().getFullYear()
    const count = Math.floor(Math.random() * 1000) + 1
    return `PB-${year}-${count.toString().padStart(3, '0')}`
  }
}