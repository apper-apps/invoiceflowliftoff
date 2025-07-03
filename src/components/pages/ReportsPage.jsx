import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import MetricCard from "@/components/molecules/MetricCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { invoiceService } from "@/services/api/invoiceService";

const ReportsPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [periodFilter, setPeriodFilter] = useState('month')

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ]

  const loadReportData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [invoices, metrics] = await Promise.all([
        invoiceService.getAll(),
        invoiceService.getMetrics()
      ])
      
      // Calculate additional metrics
      const paidInvoices = invoices.filter(inv => inv.status === 'paid')
      const pendingInvoices = invoices.filter(inv => inv.status === 'pending')
      const overdueInvoices = invoices.filter(inv => inv.status === 'overdue')
      
      const averageInvoiceValue = invoices.length > 0 
        ? invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length 
        : 0
      
      const collectionRate = invoices.length > 0
        ? (paidInvoices.length / invoices.length) * 100
        : 0

      setReportData({
        ...metrics,
        paidCount: paidInvoices.length,
        pendingCount: pendingInvoices.length,
        overdueCount: overdueInvoices.length,
        averageInvoiceValue,
        collectionRate,
        invoices
      })
    } catch (err) {
      setError(err.message || 'Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [periodFilter])

  const exportReport = (format) => {
    // In a real app, this would generate and download the report
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadReportData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h1>
          <p className="text-secondary-600">Insights into your business performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            options={periodOptions}
            className="w-40"
          />
          <Button
            variant="secondary"
            icon="Download"
            onClick={() => exportReport('pdf')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${reportData?.totalRevenue?.toLocaleString() || 0}`}
          icon="DollarSign"
          iconColor="text-green-600"
          gradient={true}
        />
        <MetricCard
          title="Outstanding Amount"
          value={`$${reportData?.outstanding?.toLocaleString() || 0}`}
          icon="AlertCircle"
          iconColor="text-amber-600"
        />
        <MetricCard
          title="Average Invoice Value"
          value={`$${reportData?.averageInvoiceValue?.toFixed(0) || 0}`}
          icon="TrendingUp"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Collection Rate"
          value={`${reportData?.collectionRate?.toFixed(1) || 0}%`}
          icon="Target"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Status Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Invoice Status Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-secondary-900">Paid Invoices</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary-900">{reportData?.paidCount || 0}</p>
                <p className="text-sm text-secondary-600">${reportData?.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="font-medium text-secondary-900">Pending Invoices</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary-900">{reportData?.pendingCount || 0}</p>
                <p className="text-sm text-secondary-600">Awaiting Payment</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-medium text-secondary-900">Overdue Invoices</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary-900">{reportData?.overdueCount || 0}</p>
                <p className="text-sm text-secondary-600">Action Required</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Recent Invoice Activity</h3>
          
<div className="space-y-4">
            {reportData?.invoices?.slice(0, 5).map((invoice, index) => (
              <motion.div
                key={invoice.id || index}
                className="flex items-center justify-between p-3 bg-surface rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" className="text-primary-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{invoice.invoice_no}</p>
                    <p className="text-sm text-secondary-500">{invoice.customer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900">${invoice.total.toLocaleString()}</p>
                  <p className={`text-xs ${
                    invoice.status === 'paid' ? 'text-green-600' :
                    invoice.status === 'pending' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Business Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-surface rounded-lg">
            <ApperIcon name="FileText" className="mx-auto mb-2 text-primary-600" size={32} />
            <h4 className="font-semibold text-secondary-900">Total Invoices</h4>
            <p className="text-2xl font-bold text-primary-600">{reportData?.totalInvoices || 0}</p>
            <p className="text-sm text-secondary-600">Generated this period</p>
          </div>
          
          <div className="text-center p-4 bg-surface rounded-lg">
            <ApperIcon name="DollarSign" className="mx-auto mb-2 text-green-600" size={32} />
            <h4 className="font-semibold text-secondary-900">Revenue Growth</h4>
            <p className="text-2xl font-bold text-green-600">+12.5%</p>
            <p className="text-sm text-secondary-600">Compared to last period</p>
          </div>
          
          <div className="text-center p-4 bg-surface rounded-lg">
            <ApperIcon name="Clock" className="mx-auto mb-2 text-amber-600" size={32} />
            <h4 className="font-semibold text-secondary-900">Avg. Payment Time</h4>
            <p className="text-2xl font-bold text-amber-600">18 days</p>
            <p className="text-sm text-secondary-600">Average collection period</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ReportsPage