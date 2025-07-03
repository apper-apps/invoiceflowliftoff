import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item",
  icon = "Package",
  actionLabel,
  onAction,
  type = 'card'
}) => {
  const EmptyContent = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="text-secondary-400" size={40} />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 mb-8 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="Plus" variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )

  if (type === 'page') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <Card className="p-8 max-w-lg mx-auto">
          <EmptyContent />
        </Card>
      </motion.div>
    )
  }

  return (
    <Card className="p-6">
      <EmptyContent />
    </Card>
  )
}

export default Empty