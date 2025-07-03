import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon, 
  iconColor = 'text-primary-600',
  gradient = false 
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`
    }
    return val
  }

  return (
    <Card hover className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-2xl font-bold ${gradient ? 'bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent' : 'text-secondary-900'}`}>
              {formatValue(value)}
            </h3>
            {change && (
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'positive' ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-primary-50 ${iconColor}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}

export default MetricCard