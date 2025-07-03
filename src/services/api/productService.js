const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
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
          { field: { Name: "description" } },
          { field: { Name: "hsn_code" } },
          { field: { Name: "gst_rate" } },
          { field: { Name: "price" } },
          { field: { Name: "unit" } },
          { field: { Name: "category" } },
          { field: { Name: "is_active" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('product', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching products:", error)
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
          { field: { Name: "description" } },
          { field: { Name: "hsn_code" } },
          { field: { Name: "gst_rate" } },
          { field: { Name: "price" } },
          { field: { Name: "unit" } },
          { field: { Name: "category" } },
          { field: { Name: "is_active" } }
        ]
      }
      
      const response = await apperClient.getRecordById('product', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error)
      throw error
    }
  },

  async create(productData) {
    try {
      await delay(350)
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Map UI field names to database field names and filter only updateable fields
      const recordData = {
        Name: productData.name,
        description: productData.description,
        hsn_code: productData.hsnCode,
        gst_rate: productData.gstRate,
        price: productData.price,
        unit: productData.unit,
        category: productData.category,
        is_active: productData.isActive !== undefined ? productData.isActive : true
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('product', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create product')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  },

  async update(id, productData) {
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
        Name: productData.name,
        description: productData.description,
        hsn_code: productData.hsnCode,
        gst_rate: productData.gstRate,
        price: productData.price,
        unit: productData.unit,
        category: productData.category,
        is_active: productData.isActive
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.updateRecord('product', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update product')
        }
        return response.results[0].data
      }
    } catch (error) {
      console.error("Error updating product:", error)
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
      
      const response = await apperClient.deleteRecord('product', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete product')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  },

  async search(query) {
    try {
      await delay(200)
      
      const products = await this.getAll()
      const lowerQuery = query.toLowerCase()
      return products.filter(product =>
        product.Name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.hsn_code.includes(query)
      )
    } catch (error) {
      console.error("Error searching products:", error)
      throw error
    }
  }
}