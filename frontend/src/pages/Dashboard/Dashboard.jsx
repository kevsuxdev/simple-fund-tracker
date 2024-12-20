import DashboardCard from '@/components/DashboardCard'
import PulseLoading from '@/components/PulseLoading'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [saving, setSaving] = useState(0)
  const [expense, setExpense] = useState(0)
  const grandTotal = saving - expense

  const getFunds = useCallback(async () => {
    try {
      const response = await axios.get('/api/funds/')
      const data = response.data.funds

      const totalSavings = data.reduce(
        (prev, curr) => prev + parseFloat(curr.amount.$numberDecimal),
        0
      )
      setSaving(totalSavings)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

  const getExpenses = useCallback(async () => {
    try {
      const response = await axios.get('/api/expenses/expense')

      const data = response.data.expenses

      const totalExpenses = data.reduce(
        (prev, curr) => prev + parseFloat(curr.amount.$numberDecimal),
        0
      )
      setExpense(totalExpenses)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

  useEffect(() => {
    const fetchingData = async () => {
      setIsLoading(true)
      await Promise.all([getFunds(), getExpenses()])
      setIsLoading(false)
    }

    fetchingData()
  }, [getFunds, getExpenses])
  return (
    <section className='w-full min-h-screen p-5 flex flex-col gap-5'>
      <article className='space-y-3'>
        <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
          Dashboard
        </h1>
        <p className='text-sm text-prompt'>
          Get a quick overview of your balance, track expenses, and manage your
          funds efficiently.
        </p>
      </article>
      {isLoading ? (
        <PulseLoading />
      ) : (
        <article className='grid gap-4'>
          <DashboardCard
            type={'saving'}
            title={'Total Savings'}
            total={saving}
          />
          <DashboardCard
            type={'expense'}
            title={'Total Expense'}
            total={expense}
          />
          <DashboardCard title={'Balance'} total={grandTotal} />
        </article>
      )}
    </section>
  )
}

export default Dashboard
