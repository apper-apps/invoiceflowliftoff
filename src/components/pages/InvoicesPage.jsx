import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { invoiceService } from '@/services/api/invoiceService'

const InvoicesPage = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteModal, setDeleteModal] = useState({ open: false, invoice: null })

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'draft', label: 'Draft' }
  ]

  const loadInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await invoiceService.getAll()
      setInvoices(data)
      setFilteredInvoices(data)
    } catch (err) {
      setError(err.message || 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(invoice => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

  const handleDelete = async () => {
    try {
      await invoiceService.delete(deleteModal.invoice.Id)
      await loadInvoices()
      toast.success('Invoice deleted successfully')
      setDeleteModal({ open: false, invoice: null })
    } catch (err) {
      toast.error('Failed to delete invoice')
    }
  }

  const handleMarkAsPaid = async (invoice) => {
    try {
      await invoiceService.markAsPaid(invoice.Id, {
        amount: invoice.total,
        method: 'Cash',
        transactionId: `TXN${Date.now()}`
      })
      await loadInvoices()
      toast.success('Invoice marked as paid')
    } catch (err) {
      toast.error('Failed to update invoice status')
    }
  }

  const columns = [
    { key: 'invoiceNo', label: 'Invoice No.', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { 
      key: 'total', 
      label: 'Amount', 
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`
    },
    { key: 'status', label: 'Status', sortable: true }
  ]

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadInvoices} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Invoices</h1>
          <p className="text-secondary-600">Manage and track all your invoices</p>
        </div>
        <Button
          onClick={() => navigate('/invoices/create')}
          icon="Plus"
        >
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by invoice number or customer..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            placeholder="Filter by status"
          />
        </div>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length === 0 ? (
        <Empty
          title="No invoices found"
          description="Create your first invoice to get started with billing"
          icon="FileText"
          actionLabel="Create Invoice"
          onAction={() => navigate('/invoices/create')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredInvoices}
          onEdit={(invoice) => navigate(`/invoices/edit/${invoice.Id}`)}
          onDelete={(invoice) => setDeleteModal({ open: true, invoice })}
          onView={(invoice) => navigate(`/invoices/edit/${invoice.Id}`)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, invoice: null })}
        title="Delete Invoice"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, invoice: null })}
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
          Are you sure you want to delete invoice{' '}
          <span className="font-semibold">{deleteModal.invoice?.invoiceNo}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default InvoicesPage