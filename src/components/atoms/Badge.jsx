import ApperIcon from '@/components/ApperIcon'

const Badge = ({ children, variant = 'default', icon, className = '' }) => {
  const variants = {
    default: 'bg-secondary-100 text-secondary-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {icon && <ApperIcon name={icon} className="mr-1" size={12} />}
      {children}
    </span>
  )
}

export default Badge