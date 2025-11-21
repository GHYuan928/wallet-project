import React from 'react'

interface StatCardProps {
  label: string
  value: string
}
const StatCard = ({label, value}:StatCardProps) => {
  return (
    <div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-semibold text-blue-600">{value}</div>
      </div>
    </div>
  )
}

export default StatCard
