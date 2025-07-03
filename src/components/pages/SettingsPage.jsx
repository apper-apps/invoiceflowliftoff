import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company')
  const [loading, setLoading] = useState(false)
  const [companyInfo, setCompanyInfo] = useState({
    Name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    tax_details: JSON.stringify({
      gst_no: '',
      pan_no: '',
      tax_rate: 0
    }),
    invoice_settings: JSON.stringify({
      format: 'INV-{YYYY}-{NNN}',
      next_number: 1,
      default_payment_terms: 'Net 30',
      currency: 'USD',
      tax_label: 'Tax'
    })
  })
  const tabs = [
    { id: 'company', label: 'Company Info', icon: 'Building' },
    { id: 'invoice', label: 'Invoice Settings', icon: 'FileText' },
    { id: 'tax', label: 'Tax Settings', icon: 'Calculator' },
    { id: 'users', label: 'User Management', icon: 'Users' }
  ]

  const handleSaveCompany = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Company information updated successfully')
    } catch (err) {
      toast.error('Failed to update company information')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveInvoice = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Invoice settings updated successfully')
    } catch (err) {
      toast.error('Failed to update invoice settings')
    } finally {
      setLoading(false)
    }
  }

  if (loading && activeTab === 'company') return <Loading type="form" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Manage your application preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="p-4 h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <ApperIcon 
                  name={tab.icon} 
                  className={activeTab === tab.id ? 'text-primary-600' : 'text-secondary-400'} 
                  size={18} 
                />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'company' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">Company Information</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
value={companyInfo.Name}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, Name: e.target.value }))}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                  
                  <Input
                    label="Phone Number"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  
                  <Input
                    label="Website"
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Input
                    label="Business Address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GST Number"
                    value={JSON.parse(companyInfo.tax_details || '{}').gst_no || ''}
                    onChange={(e) => {
                      const taxDetails = JSON.parse(companyInfo.tax_details || '{}')
                      taxDetails.gst_no = e.target.value
                      setCompanyInfo(prev => ({ ...prev, tax_details: JSON.stringify(taxDetails) }))
                    }}
                  />
                  
                  <Input
                    label="PAN Number"
                    value={JSON.parse(companyInfo.tax_details || '{}').pan_no || ''}
                    onChange={(e) => {
                      const taxDetails = JSON.parse(companyInfo.tax_details || '{}')
                      taxDetails.pan_no = e.target.value
                      setCompanyInfo(prev => ({ ...prev, tax_details: JSON.stringify(taxDetails) }))
                    }}
                  />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveCompany}
                      loading={loading}
                    >
                      Save Company Info
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'invoice' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">Invoice Settings</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Invoice Number Format"
value={JSON.parse(companyInfo.invoice_settings || '{}').format || ''}
                    onChange={(e) => {
                      const invoiceSettings = JSON.parse(companyInfo.invoice_settings || '{}')
                      invoiceSettings.format = e.target.value
                      setCompanyInfo(prev => ({ ...prev, invoice_settings: JSON.stringify(invoiceSettings) }))
                    }}
                    placeholder="e.g., INV-{YYYY}-{NNN}"
                  />
                  
                  <Input
                    label="Next Invoice Number"
                    type="number"
                    value={JSON.parse(companyInfo.invoice_settings || '{}').next_number || ''}
                    onChange={(e) => {
                      const invoiceSettings = JSON.parse(companyInfo.invoice_settings || '{}')
                      invoiceSettings.next_number = parseInt(e.target.value)
                      setCompanyInfo(prev => ({ ...prev, invoice_settings: JSON.stringify(invoiceSettings) }))
                    }}
                  />
                  
                  <Select
                    label="Default Payment Terms"
                    value={JSON.parse(companyInfo.invoice_settings || '{}').default_payment_terms || ''}
                    onChange={(e) => {
                      const invoiceSettings = JSON.parse(companyInfo.invoice_settings || '{}')
                      invoiceSettings.default_payment_terms = e.target.value
                      setCompanyInfo(prev => ({ ...prev, invoice_settings: JSON.stringify(invoiceSettings) }))
                    }}
                    options={[
                      { value: 'Net 7', label: 'Net 7 Days' },
                      { value: 'Net 15', label: 'Net 15 Days' },
                      { value: 'Net 30', label: 'Net 30 Days' },
                      { value: 'Net 45', label: 'Net 45 Days' },
                      { value: 'Net 60', label: 'Net 60 Days' }
                    ]}
                  />
                  
                  <Select
                    label="Currency"
                    value={JSON.parse(companyInfo.invoice_settings || '{}').currency || ''}
                    onChange={(e) => {
                      const invoiceSettings = JSON.parse(companyInfo.invoice_settings || '{}')
                      invoiceSettings.currency = e.target.value
                      setCompanyInfo(prev => ({ ...prev, invoice_settings: JSON.stringify(invoiceSettings) }))
                    }}
                    options={[
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                      { value: 'GBP', label: 'British Pound (GBP)' },
                      { value: 'INR', label: 'Indian Rupee (INR)' }
                    ]}
                  />
                </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveInvoice}
                      loading={loading}
                    >
                      Save Invoice Settings
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'tax' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">Tax Configuration</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Default Tax Rate (%)"
                      type="number"
value={JSON.parse(companyInfo.tax_details || '{}').tax_rate || ''}
                    onChange={(e) => {
                      const taxDetails = JSON.parse(companyInfo.tax_details || '{}')
                      taxDetails.tax_rate = parseFloat(e.target.value)
                      setCompanyInfo(prev => ({ ...prev, tax_details: JSON.stringify(taxDetails) }))
                    }}
                    step="0.01"
                  />
                  
                  <Input
                    label="Tax Label"
                    value={JSON.parse(companyInfo.invoice_settings || '{}').tax_label || ''}
                    onChange={(e) => {
                      const invoiceSettings = JSON.parse(companyInfo.invoice_settings || '{}')
                      invoiceSettings.tax_label = e.target.value
                      setCompanyInfo(prev => ({ ...prev, invoice_settings: JSON.stringify(invoiceSettings) }))
                    }}
                    placeholder="e.g., GST, VAT, Tax"
                  />
                  </div>
                  
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="font-medium text-secondary-900 mb-3">Tax Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-secondary-600">GST Registration No.</p>
<p className="font-medium text-secondary-900">{JSON.parse(companyInfo.tax_details || '{}').gst_no || ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">PAN Number</p>
                        <p className="font-medium text-secondary-900">{JSON.parse(companyInfo.tax_details || '{}').pan_no || ''}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => toast.success('Tax settings updated successfully')}
                    >
                      Save Tax Settings
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900">User Management</h3>
                  <Button
                    onClick={() => toast.info('Add user feature will be implemented')}
                    icon="Plus"
                    size="sm"
                  >
                    Add User
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="text-primary-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Admin User</p>
                        <p className="text-sm text-secondary-600">admin@invoiceflow.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Administrator
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Settings"
                        onClick={() => toast.info('User settings will be implemented')}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-secondary-500">
                    <ApperIcon name="Users" className="mx-auto mb-2" size={48} />
                    <p>No additional users configured</p>
                    <p className="text-sm">Add team members to collaborate on invoices</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage