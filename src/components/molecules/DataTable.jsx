import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  loading = false,
  emptyMessage = "No data available"
}) => {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const renderCellContent = (item, column) => {
    const value = item[column.key]
    
    if (column.render) {
      return column.render(value, item)
    }
    
    if (column.key === 'status') {
      const statusConfig = {
        paid: { variant: 'success', icon: 'CheckCircle' },
        pending: { variant: 'warning', icon: 'Clock' },
        overdue: { variant: 'danger', icon: 'AlertCircle' },
        draft: { variant: 'default', icon: 'Edit' }
      }
      const config = statusConfig[value?.toLowerCase()] || { variant: 'default' }
      return <Badge variant={config.variant} icon={config.icon}>{value}</Badge>
    }
    
    return value
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200">
          <div className="h-4 bg-secondary-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="divide-y divide-secondary-200">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-secondary-200 rounded animate-pulse flex-1"></div>
                <div className="h-4 bg-secondary-200 rounded animate-pulse w-24"></div>
                <div className="h-4 bg-secondary-200 rounded animate-pulse w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-surface">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-secondary-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <ApperIcon
                        name={sortColumn === column.key && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'}
                        className={`${sortColumn === column.key ? 'text-primary-600' : 'text-secondary-400'}`}
                        size={14}
                      />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="text-secondary-500">
                    <ApperIcon name="Package" className="mx-auto mb-2" size={48} />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <motion.tr
                  key={item.Id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Eye"
                            onClick={() => onView(item)}
                          />
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Edit"
                            onClick={() => onEdit(item)}
                          />
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          />
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable