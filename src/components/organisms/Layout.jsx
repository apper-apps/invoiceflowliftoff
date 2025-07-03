import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path.startsWith('/invoices/create')) return 'Create Invoice'
    if (path.startsWith('/invoices/edit')) return 'Edit Invoice'
    if (path.startsWith('/invoices')) return 'Invoices'
    if (path.startsWith('/customers')) return 'Customer Management'
    if (path.startsWith('/products')) return 'Product Management'
    if (path.startsWith('/purchase-bills')) return 'Purchase Bills'
    if (path.startsWith('/reports')) return 'Reports & Analytics'
    if (path.startsWith('/settings')) return 'Settings'
    return 'InvoiceFlow Pro'
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className="lg:ml-64">
        <Header 
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
          title={getPageTitle()}
        />
        
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout