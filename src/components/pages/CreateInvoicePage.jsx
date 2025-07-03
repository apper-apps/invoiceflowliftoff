import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { invoiceService } from '@/services/api/invoiceService'
import { customerService } from '@/services/api/customerService'
import { productService } from '@/services/api/productService'
import ApperIcon from '@/components/ApperIcon'

const CreateInvoicePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    refNo: '',
    eWayBillNo: '',
    shippedVia: '',
    shippingDate: '',
    shipmentType: 'Interstate',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: 'draft'
  })

  const [newItem, setNewItem] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    price: 0,
    total: 0
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [customersData, productsData] = await Promise.all([
        customerService.getAll(),
        productService.getAll()
      ])
      
      setCustomers(customersData)
      setProducts(productsData)

      if (isEdit) {
        const invoiceData = await invoiceService.getById(id)
        setFormData(invoiceData)
      } else {
        // Set default due date to 30 days from now
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 30)
        setFormData(prev => ({
          ...prev,
          dueDate: dueDate.toISOString().split('T')[0]
        }))
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.discount])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const taxAmount = subtotal * 0.18 // 18% GST
    const total = subtotal + taxAmount - formData.discount

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax: taxAmount,
      total
    }))
  }

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.Id === parseInt(customerId))
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer ? customer.name : ''
    }))
  }

  const handleProductChange = (productId) => {
    const product = products.find(p => p.Id === parseInt(productId))
    if (product) {
      setNewItem(prev => ({
        ...prev,
        productId,
        productName: product.name,
        price: product.price,
        total: product.price * prev.quantity
      }))
    }
  }

  const handleQuantityChange = (quantity) => {
    setNewItem(prev => ({
      ...prev,
      quantity: parseInt(quantity) || 0,
      total: prev.price * (parseInt(quantity) || 0)
    }))
  }

  const addItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      toast.error('Please select a product and enter valid quantity')
      return
    }

    const item = {
      id: Date.now(),
      ...newItem
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setNewItem({
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      total: 0
    })
  }

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const handleSave = async (status = 'draft') => {
    try {
      if (!formData.customerId) {
        toast.error('Please select a customer')
        return
      }

      if (formData.items.length === 0) {
        toast.error('Please add at least one item')
        return
      }

      setSaving(true)
      
      const invoiceData = {
        ...formData,
        status
      }

      if (isEdit) {
        await invoiceService.update(id, invoiceData)
        toast.success('Invoice updated successfully')
      } else {
        await invoiceService.create(invoiceData)
        toast.success('Invoice created successfully')
      }

      navigate('/invoices')
    } catch (err) {
      toast.error(err.message || 'Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  const generatePDF = () => {
    toast.info('PDF generation feature will be implemented')
  }

  if (loading) return <Loading type="form" />
  if (error) return <Error message={error} onRetry={loadData} />

  const customerOptions = customers.map(customer => ({
    value: customer.Id.toString(),
    label: customer.name
  }))

  const productOptions = products.map(product => ({
    value: product.Id.toString(),
    label: `${product.name} - $${product.price}`
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {isEdit ? 'Edit Invoice' : 'Create Invoice'}
          </h1>
          <p className="text-secondary-600">
            {isEdit ? 'Update invoice details' : 'Create a new invoice for your customer'}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/invoices')}
          icon="ArrowLeft"
        >
          Back to Invoices
        </Button>
      </div>

      {/* Invoice Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Customer"
                value={formData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                options={customerOptions}
                placeholder="Select customer"
                required
              />
              
              <Input
                label="Invoice Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
              
              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
              
              <Input
                label="Reference/PO Number"
                value={formData.refNo}
                onChange={(e) => setFormData(prev => ({ ...prev, refNo: e.target.value }))}
                placeholder="Enter reference number"
              />
              
              <Input
                label="E-Way Bill No"
                value={formData.eWayBillNo}
                onChange={(e) => setFormData(prev => ({ ...prev, eWayBillNo: e.target.value }))}
                placeholder="Enter e-way bill number"
              />
              
              <Select
                label="Shipment Type"
                value={formData.shipmentType}
                onChange={(e) => setFormData(prev => ({ ...prev, shipmentType: e.target.value }))}
                options={[
                  { value: 'Interstate', label: 'Interstate' },
                  { value: 'Intrastate', label: 'Intrastate' }
                ]}
              />
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Invoice Items</h3>
            
            {/* Add Item Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-surface rounded-lg">
              <Select
                label="Product"
                value={newItem.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                options={productOptions}
                placeholder="Select product"
              />
              
              <Input
                label="Quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min="1"
              />
              
              <Input
                label="Price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ 
                  ...prev, 
                  price: parseFloat(e.target.value) || 0,
                  total: (parseFloat(e.target.value) || 0) * prev.quantity
                }))}
                step="0.01"
              />
              
              <div className="flex items-end">
                <Button
                  onClick={addItem}
                  icon="Plus"
                  className="w-full"
                >
                  Add Item
                </Button>
              </div>
            </div>

            {/* Items List */}
            {formData.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-2 font-medium text-secondary-700">Product</th>
                      <th className="text-center py-2 font-medium text-secondary-700">Quantity</th>
                      <th className="text-right py-2 font-medium text-secondary-700">Price</th>
                      <th className="text-right py-2 font-medium text-secondary-700">Total</th>
                      <th className="text-center py-2 font-medium text-secondary-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-secondary-100"
                      >
                        <td className="py-3">{item.productName}</td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold">${item.total.toFixed(2)}</td>
                        <td className="py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <ApperIcon name="Package" className="mx-auto mb-2" size={48} />
                <p>No items added yet. Start by selecting a product above.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Invoice Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Subtotal:</span>
                <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-600">Tax (18%):</span>
                <span className="font-medium">${formData.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <Input
                  label="Discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    discount: parseFloat(e.target.value) || 0 
                  }))}
                  step="0.01"
                  className="w-24"
                />
                <span className="font-medium flex items-end pb-2">-${formData.discount.toFixed(2)}</span>
              </div>
              
              <hr className="border-secondary-200" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">${formData.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => handleSave('pending')}
                loading={saving}
                className="w-full"
                disabled={formData.items.length === 0}
              >
                {isEdit ? 'Update Invoice' : 'Save & Send'}
              </Button>
              
              <Button
                onClick={() => handleSave('draft')}
                variant="secondary"
                loading={saving}
                className="w-full"
              >
                Save as Draft
              </Button>
              
              <Button
                onClick={generatePDF}
                variant="ghost"
                icon="Download"
                className="w-full"
              >
                Generate PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateInvoicePage