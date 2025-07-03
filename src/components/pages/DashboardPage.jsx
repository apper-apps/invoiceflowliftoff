import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MetricCard from '@/components/molecules/MetricCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { invoiceService } from '@/services/api/invoiceService'
import { customerService } from '@/services/api/customerService'
import ApperIcon from '@/components/ApperIcon'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [metricsData, invoicesData] = await Promise.all([
        invoiceService.getMetrics(),
        invoiceService.getAll()
      ])
      
      setMetrics(metricsData)
      setRecentInvoices(invoicesData.slice(-5).reverse())
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'overdue': return 'danger'
      case 'draft': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return 'CheckCircle'
      case 'pending': return 'Clock'
      case 'overdue': return 'AlertCircle'
      case 'draft': return 'Edit'
      default: return 'FileText'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100">Here's what's happening with your business today.</p>
          </div>
          <Button 
            onClick={() => navigate('/invoices/create')}
            variant="accent"
            icon="Plus"
            className="bg-white text-primary-700 hover:bg-primary-50"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Invoices"
          value={metrics?.totalInvoices || 0}
          icon="FileText"
          gradient={true}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(metrics?.totalRevenue || 0).toLocaleString()}`}
          change={12.5}
          changeType="positive"
          icon="DollarSign"
          iconColor="text-green-600"
        />
        <MetricCard
          title="Outstanding Amount"
          value={`$${(metrics?.outstanding || 0).toLocaleString()}`}
          icon="AlertCircle"
          iconColor="text-amber-600"
        />
        <MetricCard
          title="Overdue Invoices"
          value={metrics?.overdue || 0}
          icon="Clock"
          iconColor="text-red-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Invoices</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/invoices')}
              icon="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/invoices/edit/${invoice.Id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{invoice.invoiceNo}</p>
                    <p className="text-sm text-secondary-500">{invoice.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900">${invoice.total.toLocaleString()}</p>
                  <Badge 
                    variant={getStatusColor(invoice.status)} 
                    icon={getStatusIcon(invoice.status)}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="primary"
              className="h-24 flex-col"
              onClick={() => navigate('/invoices/create')}
            >
              <ApperIcon name="Plus" size={24} className="mb-2" />
              Create Invoice
            </Button>
            
            <Button
              variant="secondary"
              className="h-24 flex-col"
              onClick={() => navigate('/customers')}
            >
              <ApperIcon name="Users" size={24} className="mb-2" />
              Add Customer
            </Button>
            
            <Button
              variant="secondary"
              className="h-24 flex-col"
              onClick={() => navigate('/products')}
            >
              <ApperIcon name="Package" size={24} className="mb-2" />
              Add Product
            </Button>
            
            <Button
              variant="secondary"
              className="h-24 flex-col"
              onClick={() => navigate('/reports')}
            >
              <ApperIcon name="BarChart3" size={24} className="mb-2" />
              View Reports
            </Button>
          </div>
        </Card>
      </div>

      {/* Upcoming Reminders */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Upcoming Payment Reminders</h3>
        
        <div className="space-y-3">
          {recentInvoices
            .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
            .map((invoice) => (
              <div key={invoice.Id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={invoice.status === 'overdue' ? 'AlertCircle' : 'Clock'} 
                    className={invoice.status === 'overdue' ? 'text-red-600' : 'text-amber-600'} 
                    size={20} 
                  />
                  <div>
                    <p className="font-medium text-secondary-900">{invoice.invoiceNo} - {invoice.customerName}</p>
                    <p className="text-sm text-secondary-500">Due: {invoice.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900">${invoice.total.toLocaleString()}</p>
                  <Badge 
                    variant={invoice.status === 'overdue' ? 'danger' : 'warning'}
                  >
                    {invoice.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                  </Badge>
                </div>
              </div>
            ))}
          
          {recentInvoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').length === 0 && (
            <div className="text-center py-8 text-secondary-500">
              <ApperIcon name="CheckCircle" className="mx-auto mb-2 text-green-500" size={48} />
              <p>All invoices are up to date!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default DashboardPage