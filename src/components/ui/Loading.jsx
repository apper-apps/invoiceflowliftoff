import Card from '@/components/atoms/Card'

const Loading = ({ type = 'dashboard' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Metrics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-secondary-200 rounded animate-pulse w-24"></div>
                  <div className="h-8 bg-secondary-200 rounded animate-pulse w-16"></div>
                </div>
                <div className="w-12 h-12 bg-secondary-200 rounded-lg animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Chart Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="h-4 bg-secondary-200 rounded animate-pulse w-32 mb-4"></div>
            <div className="h-64 bg-secondary-200 rounded animate-pulse"></div>
          </Card>
          <Card className="p-6">
            <div className="h-4 bg-secondary-200 rounded animate-pulse w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-4 bg-secondary-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-secondary-200 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200">
          <div className="h-4 bg-secondary-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="divide-y divide-secondary-200">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-secondary-200 rounded animate-pulse flex-1"></div>
                <div className="h-4 bg-secondary-200 rounded animate-pulse w-24"></div>
                <div className="h-4 bg-secondary-200 rounded animate-pulse w-20"></div>
                <div className="h-4 bg-secondary-200 rounded animate-pulse w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (type === 'form') {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="h-6 bg-secondary-200 rounded animate-pulse w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-secondary-200 rounded animate-pulse w-20"></div>
                <div className="h-10 bg-secondary-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3">
            <div className="h-10 bg-secondary-200 rounded animate-pulse w-24"></div>
            <div className="h-10 bg-secondary-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
      </Card>
    )
  }

  // Default loading
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span className="ml-3 text-secondary-600">Loading...</span>
    </div>
  )
}

export default Loading