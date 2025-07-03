import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onMobileMenuClick, title }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, message: "Invoice #INV-001 is overdue", type: "warning", time: "2 hours ago" },
    { id: 2, message: "Payment received for Invoice #INV-002", type: "success", time: "1 day ago" },
    { id: 3, message: "New customer registration", type: "info", time: "2 days ago" }
  ]

  return (
    <header className="bg-white border-b border-secondary-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMobileMenuClick}
            className="lg:hidden"
          />
          <div>
            <h1 className="text-xl font-semibold text-secondary-900">{title}</h1>
            <p className="text-sm text-secondary-500">Manage your business invoices efficiently</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-secondary-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="font-medium text-secondary-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-secondary-100 hover:bg-secondary-50">
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${
                          notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <ApperIcon 
                            name={
                              notification.type === 'warning' ? 'AlertCircle' :
                              notification.type === 'success' ? 'CheckCircle' :
                              'Info'
                            } 
                            size={14} 
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-900">{notification.message}</p>
                          <p className="text-xs text-secondary-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-secondary-200">
                  <Button variant="ghost" size="sm" className="text-primary-600">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="text-white" size={16} />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-secondary-900">Admin User</p>
              <p className="text-xs text-secondary-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header