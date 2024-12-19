import MonthlyTrack from '@/components/charts/MonthlyTrack'
import RecentTransaction from '@/components/RecentTransaction'
import React from 'react'

const Dashboard = () => {
  return (
    <section className='w-full h-screen p-5'>
      <article className='space-y-3'>
        <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
          Dashboard
        </h1>
        <p className='text-sm text-prompt'>
          Get a quick overview of your balance, track expenses, and manage your
          funds efficiently.
        </p>
      </article>
      <MonthlyTrack />
    </section>
  )
}

export default Dashboard
