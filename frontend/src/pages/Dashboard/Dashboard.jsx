import MonthlySaving from '@/components/charts/MonthlySaving'
import MonthyExpense from '@/components/charts/MonthyExpense'
import DashboardCard from '@/components/DashboardCard'
import PulseLoading from '@/components/PulseLoading'
import { fundsHeaderContent } from '@/constant'
import axios from 'axios'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  const [saving, setSaving] = useState(0)
  const [expense, setExpense] = useState(0)
  const grandTotal = saving - expense

  const [latestFundsList, setLatestFundsList] = useState([])

  const latestFunds = useCallback(async () => {
    try {
      const savingsResponse = await axios.get('/api/funds/')
      const savings = savingsResponse.data.funds

      const expensesResponse = await axios.get('/api/expenses/expense')
      const expenses = expensesResponse.data.expenses

      const mergedFunds = [
        ...savings.map((saving) => ({ ...saving, type: 'Savings' })),
        ...expenses.map((expense) => ({ ...expense, type: 'Expenses' })),
      ]

      setLatestFundsList(
        mergedFunds
          .sort(
            (prev, next) => new Date(next.createdAt) - new Date(prev.createdAt)
          )
          .slice(0, 5)
      )
    } catch (error) {
      console.log(error.response)
    }
  }, [])

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
      await Promise.all([getFunds(), getExpenses(), latestFunds()])
      setIsLoading(false)
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    fetchingData()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [getFunds, getExpenses, latestFunds])
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
        <React.Fragment>
          <article className='grid lg:grid-cols-3 gap-4'>
            <DashboardCard
              type={'saving'}
              title={'Total Savings'}
              total={saving}
            />
            <DashboardCard
              type={'expense'}
              title={'Total Expenses'}
              total={expense}
            />
            <DashboardCard title={'Balance'} total={grandTotal} />
          </article>

          <aside className='flex flex-col gap-3'>
            <h1 className='text-xl font-bold tracking-wide'>
              Most Recent Transaction
            </h1>
            <table className='w-full border-collapse'>
              <thead className='w-full bg-[#161717] rounded-lg'>
                <tr>
                  {fundsHeaderContent.map((nav) => {
                    const { id, name, desktopOnly } = nav
                    return (
                      !desktopOnly && (
                        <th
                          key={id}
                          className='flex-1 text-center xl:text-sm text-[10px] font-medium tracking-wide py-5'
                        >
                          {name}
                        </th>
                      )
                    )
                  })}
                </tr>
              </thead>
              <tbody className='w-full'>
                {latestFundsList.map((fund, index) => {
                  const { type, _id, amount, description, date } = fund
                  return (
                    <tr
                      key={_id}
                      className={`${
                        index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                      } p-3 px-10 gap-5 w-full rounded-lg`}
                    >
                      <td className={`text-[9px] text-center py-3 xl:text-sm`}>
                        {type}
                      </td>
                      <td className='text-[9px] text-center py-3 xl:text-sm'>
                        {description && description.length > 15
                          ? `${isDesktop ? description.slice(0, 25) : description.slice(0, 12)}...`
                          : description || 'Not Applicable'}
                      </td>
                      <td
                        className={`text-[9px] text-center py-3 xl:text-sm font-medium ${
                          type === 'Savings' ? 'text-green-400' : 'text-red-500'
                        }`}
                      >
                        ₱ {type === 'Savings' ? '+' : '-'}
                        {parseFloat(amount.$numberDecimal)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      </td>
                      <td className='text-[9px] text-center py-3 xl:text-sm'>
                        {format(date, 'MM-dd-yyyy')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {isDesktop && (
              <aside className='flex flex-col gap-5 mt-5'>
                <article className='h-[70vh]'>
                  <MonthlySaving isDesktop={isDesktop} />
                </article>
                <article className='h-[70vh] my-16'>
                  <MonthyExpense isDesktop={isDesktop} />
                </article>
              </aside>
            )}
          </aside>
        </React.Fragment>
      )}
    </section>
  )
}

export default Dashboard
