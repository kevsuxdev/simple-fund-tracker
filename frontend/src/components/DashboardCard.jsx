import React from 'react'

const DashboardCard = ({ type, title, total }) => {
  const cardType = type || null
  return (
    <div
      className={`w-full ${cardType === 'saving' && 'bg-[#04ab67]'} ${
        cardType === 'expense' && 'bg-[#d60303]'
      } ${cardType === null && 'bg-blue-500'} p-5 rounded-lg`}
    >
      <div className='flex justify-between'>
        <h1 className='text-sm font-bold tracking-wide'>
          {title || 'Total Savings'}
        </h1>
        <p className='text-xs font-medium'>
          ₱{' '}
          {parseFloat(total || 0)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
      </div>
    </div>
  )
}

export default DashboardCard
