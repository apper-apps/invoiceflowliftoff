import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { customerService } from '@/services/api/customerService'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [customerModal, setCustomerModal] = useState({ open: false, customer: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, customer: null })
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    address: '',
    state: '',
    stateCode: '',
    contactPerson: '',
    gstNo: ''
  })

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await customerService.getAll()
      setCustomers(data)
      setFilteredCustomers(data)
    } catch (err) {
      setError(err.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.clientId.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [customers, searchTerm])

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactNo: '',
      address: '',
      state: '',
      stateCode: '',
      contactPerson: '',
      gstNo: ''
    })
  }

  const openModal = (customer = null) => {
    if (customer) {
      setFormData(customer)
    } else {
      resetForm()
    }
    setCustomerModal({ open: true, customer })
  }

  const closeModal = () => {
    setCustomerModal({ open: false, customer: null })
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      
      if (customerModal.customer) {
        await customerService.update(customerModal.customer.Id, formData)
        toast.success('Customer updated successfully')
      } else {
        await customerService.create(formData)
        toast.success('Customer created successfully')
      }
      
      await loadCustomers()
      closeModal()
    } catch (err) {
      toast.error(err.message || 'Failed to save customer')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await customerService.delete(deleteModal.customer.Id)
      await loadCustomers()
      toast.success('Customer deleted successfully')
      setDeleteModal({ open: false, customer: null })
    } catch (err) {
      toast.error('Failed to delete customer')
    }
  }

  const columns = [
    { key: 'clientId', label: 'Client ID', sortable: true },
    { key: 'name', label: 'Customer Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contactNo', label: 'Phone', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { 
      key: 'totalAmount', 
      label: 'Total Business', 
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`
    }
  ]

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadCustomers} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Customer Management</h1>
          <p className="text-secondary-600">Manage your customer database and relationships</p>
        </div>
        <Button
          onClick={() => openModal()}
          icon="Plus"
        >
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search customers by name, email, or client ID..."
      />

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <Empty
          title="No customers found"
          description="Add your first customer to start managing relationships"
          icon="Users"
          actionLabel="Add Customer"
          onAction={() => openModal()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCustomers}
          onEdit={openModal}
          onDelete={(customer) => setDeleteModal({ open: true, customer })}
        />
      )}

      {/* Customer Modal */}
      <Modal
        isOpen={customerModal.open}
        onClose={closeModal}
        title={customerModal.customer ? 'Edit Customer' : 'Add New Customer'}
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
              {customerModal.customer ? 'Update' : 'Create'} Customer
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            
            <Input
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
            />
            
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            
            <Input
              label="Phone Number"
              value={formData.contactNo}
              onChange={(e) => setFormData(prev => ({ ...prev, contactNo: e.target.value }))}
            />
            
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            />
            
            <Input
              label="State Code"
              value={formData.stateCode}
              onChange={(e) => setFormData(prev => ({ ...prev, stateCode: e.target.value }))}
              placeholder="e.g., CA, NY, TX"
            />
            
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            
            <Input
              label="GST Number"
              value={formData.gstNo}
              onChange={(e) => setFormData(prev => ({ ...prev, gstNo: e.target.value }))}
              placeholder="Enter GST registration number"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, customer: null })}
        title="Delete Customer"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, customer: null })}
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
          Are you sure you want to delete customer{' '}
          <span className="font-semibold">{deleteModal.customer?.name}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default CustomersPage