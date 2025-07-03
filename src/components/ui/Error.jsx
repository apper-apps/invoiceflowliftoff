import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  type = 'card'
}) => {
  const ErrorContent = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="text-red-600" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-secondary-600 mb-6 max-w-md mx-auto">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} icon="RefreshCw">
          Try Again
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
        <Card className="p-8 max-w-md mx-auto">
          <ErrorContent />
        </Card>
      </motion.div>
    )
  }

  return (
    <Card className="p-6">
      <ErrorContent />
    </Card>
  )
}

export default Error