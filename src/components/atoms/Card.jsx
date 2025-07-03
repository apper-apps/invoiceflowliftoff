import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, ...props }) => {
  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <Component
      className={`bg-white rounded-lg shadow-md border border-secondary-200 ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card