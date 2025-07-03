import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { purchaseBillService } from '@/services/api/purchaseBillService'

const PurchaseBillsPage = () => {
  const [bills, setBills] = useState([])
  const [filteredBills, setFilteredBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const loadBills = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await purchaseBillService.getAll()
      setBills(data)
      setFilteredBills(data)
    } catch (err) {
      setError(err.message || 'Failed to load purchase bills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBills()
  }, [])

  useEffect(() => {
    let filtered = bills

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(bill => bill.status === statusFilter)
    }

    setFilteredBills(filtered)
  }, [bills, searchTerm, statusFilter])

  const columns = [
    { key: 'billNo', label: 'Bill No.', sortable: true },
    { key: 'vendorName', label: 'Vendor', sortable: true },
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
  if (error) return <Error message={error} onRetry={loadBills} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Purchase Bills</h1>
          <p className="text-secondary-600">Track and manage all your purchase bills</p>
        </div>
        <Button
          onClick={() => toast.info('Add bill feature will be implemented')}
          icon="Plus"
        >
          Add Bill
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by bill number or vendor..."
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

      {/* Bills Table */}
      {filteredBills.length === 0 ? (
        <Empty
          title="No purchase bills found"
          description="Start tracking your vendor bills and expenses"
          icon="Receipt"
          actionLabel="Add Bill"
          onAction={() => toast.info('Add bill feature will be implemented')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredBills}
          onEdit={(bill) => toast.info('Edit bill feature will be implemented')}
          onDelete={(bill) => toast.info('Delete bill feature will be implemented')}
          onView={(bill) => toast.info('View bill feature will be implemented')}
        />
      )}
    </div>
  )
}

export default PurchaseBillsPage