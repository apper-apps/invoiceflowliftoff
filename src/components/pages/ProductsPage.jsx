import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { productService } from '@/services/api/productService'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [productModal, setProductModal] = useState({ open: false, product: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null })
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hsnCode: '',
    gstRate: 18,
    price: 0,
    unit: '',
    category: ''
  })

  const categoryOptions = [
    { value: 'Services', label: 'Services' },
    { value: 'Software', label: 'Software' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Licensing', label: 'Licensing' }
  ]

  const unitOptions = [
    { value: 'Project', label: 'Project' },
    { value: 'Hour', label: 'Hour' },
    { value: 'Month', label: 'Month' },
    { value: 'License', label: 'License' },
    { value: 'Piece', label: 'Piece' },
    { value: 'Package', label: 'Package' }
  ]

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.hsn_code.includes(searchTerm)
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchTerm])

  const resetForm = () => {
setFormData({
      name: '',
      description: '',
      hsnCode: '',
      gstRate: 18,
      price: 0,
      unit: '',
      category: ''
    })
  }

  const openModal = (product = null) => {
    if (product) {
      setFormData(product)
    } else {
      resetForm()
    }
    setProductModal({ open: true, product })
  }

  const closeModal = () => {
    setProductModal({ open: false, product: null })
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.unit) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      
      if (productModal.product) {
        await productService.update(productModal.product.Id, formData)
        toast.success('Product updated successfully')
      } else {
        await productService.create(formData)
        toast.success('Product created successfully')
      }
      
      await loadProducts()
      closeModal()
    } catch (err) {
      toast.error(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await productService.delete(deleteModal.product.Id)
      await loadProducts()
      toast.success('Product deleted successfully')
      setDeleteModal({ open: false, product: null })
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const columns = [
{ key: 'Name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'hsn_code', label: 'HSN/SAC Code', sortable: true },
    { 
      key: 'price', 
      label: 'Price', 
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`
    },
    { key: 'unit', label: 'Unit', sortable: true },
    { 
      key: 'gst_rate', 
      label: 'GST Rate', 
      sortable: true,
      render: (value) => `${value}%`
    }
  ]

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Product Management</h1>
          <p className="text-secondary-600">Manage your product catalog and pricing</p>
        </div>
        <Button
          onClick={() => openModal()}
          icon="Plus"
        >
          Add Product
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search products by name, description, or HSN code..."
      />

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <Empty
          title="No products found"
          description="Add your first product to start building your catalog"
          icon="Package"
          actionLabel="Add Product"
          onAction={() => openModal()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProducts}
          onEdit={openModal}
          onDelete={(product) => setDeleteModal({ open: true, product })}
        />
      )}

      {/* Product Modal */}
      <Modal
        isOpen={productModal.open}
        onClose={closeModal}
        title={productModal.product ? 'Edit Product' : 'Add New Product'}
        size="lg"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={saving}
            >
              {productModal.product ? 'Update' : 'Create'} Product
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
              />
            </div>
            
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              options={categoryOptions}
              placeholder="Select category"
            />
            
            <Input
              label="HSN/SAC Code"
              value={formData.hsnCode}
              onChange={(e) => setFormData(prev => ({ ...prev, hsnCode: e.target.value }))}
              placeholder="Enter HSN or SAC code"
            />
            
            <Input
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              step="0.01"
              min="0"
              required
            />
            
            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              options={unitOptions}
              placeholder="Select unit"
              required
            />
            
            <Input
              label="GST Rate (%)"
              type="number"
              value={formData.gstRate}
              onChange={(e) => setFormData(prev => ({ ...prev, gstRate: parseFloat(e.target.value) || 0 }))}
              step="0.01"
              min="0"
              max="100"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, product: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-secondary-600">
Are you sure you want to delete product{' '}
          <span className="font-semibold">{deleteModal.product?.Name}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default ProductsPage