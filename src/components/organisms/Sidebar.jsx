import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const location = useLocation()

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Invoices', href: '/invoices', icon: 'FileText' },
    { name: 'Customers', href: '/customers', icon: 'Users' },
    { name: 'Products', href: '/products', icon: 'Package' },
    { name: 'Purchase Bills', href: '/purchase-bills', icon: 'Receipt' },
    { name: 'Reports', href: '/reports', icon: 'BarChart3' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-6 py-4 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
            <ApperIcon name="Receipt" className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">InvoiceFlow Pro</h1>
            <p className="text-xs text-secondary-500">Invoice Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href))
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onMobileClose}
              className={({ isActive: linkActive }) => `
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                ${isActive || linkActive
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-l-4 border-primary-600' 
                  : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                }
              `}
            >
              <ApperIcon 
                name={item.icon} 
                className={`mr-3 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'
                }`} 
                size={18} 
              />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-secondary-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="text-white" size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-900">Admin User</p>
            <p className="text-xs text-secondary-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-secondary-200 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="relative w-64 h-full bg-white border-r border-secondary-200 shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  )
}

export default Sidebar