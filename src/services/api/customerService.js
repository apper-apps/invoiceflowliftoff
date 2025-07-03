const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const customerService = {
  async getAll() {
    try {
      await delay(250)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "client_id" } },
          { field: { Name: "address" } },
          { field: { Name: "state" } },
          { field: { Name: "state_code" } },
          { field: { Name: "contact_person" } },
          { field: { Name: "contact_no" } },
          { field: { Name: "email" } },
          { field: { Name: "gst_no" } },
          { field: { Name: "created_date" } },
          { field: { Name: "total_invoices" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "outstanding_amount" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('app_Customer', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching customers:", error)
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
          { field: { Name: "client_id" } },
          { field: { Name: "address" } },
          { field: { Name: "state" } },
          { field: { Name: "state_code" } },
          { field: { Name: "contact_person" } },
          { field: { Name: "contact_no" } },
          { field: { Name: "email" } },
          { field: { Name: "gst_no" } },
          { field: { Name: "created_date" } },
          { field: { Name: "total_invoices" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "outstanding_amount" } }
        ]
      }
      
      const response = await apperClient.getRecordById('app_Customer', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error)
      throw error
    }
  },

  async create(customerData) {
    try {
      await delay(350)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Map UI field names to database field names and filter only updateable fields
      const recordData = {
        Name: customerData.name,
        client_id: customerData.clientId || this.generateClientId(),
        address: customerData.address,
        state: customerData.state,
        state_code: customerData.stateCode,
        contact_person: customerData.contactPerson,
        contact_no: customerData.contactNo,
        email: customerData.email,
        gst_no: customerData.gstNo,
        created_date: customerData.createdDate || new Date().toISOString().split('T')[0],
        total_invoices: customerData.totalInvoices || 0,
        total_amount: customerData.totalAmount || 0,
        outstanding_amount: customerData.outstandingAmount || 0
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('app_Customer', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create customer')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      throw error
    }
  },

  async update(id, customerData) {
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
        Name: customerData.name,
        client_id: customerData.clientId,
        address: customerData.address,
        state: customerData.state,
        state_code: customerData.stateCode,
        contact_person: customerData.contactPerson,
        contact_no: customerData.contactNo,
        email: customerData.email,
        gst_no: customerData.gstNo,
        created_date: customerData.createdDate,
        total_invoices: customerData.totalInvoices,
        total_amount: customerData.totalAmount,
        outstanding_amount: customerData.outstandingAmount
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.updateRecord('app_Customer', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update customer')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error updating customer:", error)
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
      
      const response = await apperClient.deleteRecord('app_Customer', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete customer')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting customer:", error)
      throw error
    }
  },

  generateClientId() {
    const count = Math.floor(Math.random() * 1000) + 1
    return `CLI-${count.toString().padStart(3, '0')}`
  },

  async search(query) {
    try {
      await delay(200)
      
      const customers = await this.getAll()
      const lowerQuery = query.toLowerCase()
      return customers.filter(customer =>
        customer.Name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery) ||
        customer.client_id.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error("Error searching customers:", error)
      throw error
    }
  }
}