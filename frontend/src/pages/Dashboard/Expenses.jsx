import DatePicker from '@/components/DatePicker'
import PulseLoading from '@/components/PulseLoading'
import TextInput from '@/components/TextInput'
import { isValidAmount, expensesHeaderContent, toastStyle } from '@/constant'
import axios from 'axios'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Expenses = () => {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [listOfExpenses, setListOfExpenses] = useState([])
  const [error, setError] = useState({
    message: null,
  })

  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    date: null,
  })

  const handleAddExpenses = async (event) => {
    event.preventDefault()

    setLoading(true)

    if (!isValidAmount(formData.amount) || parseFloat(formData.amount) <= 0) {
      setLoading(false)
      return setError({ message: 'Please enter a valid amount.' })
    }

    if (!formData.description) {
      setLoading(false)
      return setError({
        message: 'Please enter a description of how the money was spent.',
      })
    }

    if (!formData.date) {
      setLoading(false)
      return setError({ message: 'Please enter date issued of funds.' })
    }

    try {
      const response = await axios.post('/api/expenses/add-expenses', formData)

      toast.success(response.data.message, { ...toastStyle })
      setFormData({
        amount: 0,
        description: '',
        date: null,
      })
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
    setError(null)
  }

  const expenses = useCallback(async () => {
    try {
      const response = await axios.get('/api/expenses/expense')
      const data = await response.data.expenses

      const latest = data.sort(
        (prev, next) => new Date(next.createdAt) - new Date(prev.createdAt)
      )

      setListOfExpenses(latest)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

  useEffect(() => {
    const fetchingSaving = async () => {
      setFetching(true)
      try {
        await expenses()
      } catch (error) {
        console.log(error)
      } finally {
        setFetching(false)
      }
    }

    fetchingSaving()
  }, [expenses])

  return (
    <section className='w-full h-screen p-5'>
      <article className='space-y-3'>
        <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
          Add Expenses
        </h1>
        <p className='text-sm text-prompt '>
          Need to track your spending? Complete the form below to quickly log
          your expenses and stay on top of your budget!
        </p>
      </article>
      {fetching ? (
        <PulseLoading />
      ) : (
        <aside className='w-full mt-10 flex lg:flex-row flex-col gap-8 items-start'>
          <form
            onSubmit={handleAddExpenses}
            className='flex flex-col gap-5 w-full'
          >
            {error && (
              <p className='w-full text-sm text-red-500 text-start'>
                {error.message}
              </p>
            )}
            <TextInput
              title='Amount'
              type='number'
              placeholder='Add desired amount.'
              value={formData.amount}
              onChange={(event) =>
                setFormData({ ...formData, amount: event.target.value })
              }
            />

            <TextInput
              title='Description'
              type='text'
              placeholder='Provide details or a description of how the money was spent.'
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />
            <DatePicker
              title='Date issued'
              date={formData.date}
              setDate={(selectedDate) =>
                setFormData({ ...formData, date: selectedDate.toISOString() })
              }
            />
            <button type='submit' className='primary-button' disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>

          <table className='w-full border-collapse'>
            <thead className='w-full bg-[#161717] rounded-lg'>
              <tr>
                {expensesHeaderContent.map((nav) => {
                  const { id, name } = nav
                  return (
                    <th
                      key={id}
                      className='flex-1 text-center xl:text-sm text-[10px] font-medium tracking-wide py-5'
                    >
                      {name}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className='w-full'>
              {listOfExpenses.map((fund, index) => {
                const { _id, description, amount, date } = fund
                return (
                  <tr
                    key={_id}
                    className={`${
                      index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                    } p-3 px-10 gap-5 w-full rounded-lg`}
                  >
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      Saving
                    </td>
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      {description && description.length > 15
                        ? `${description.slice(0, 12)}...`
                        : description || 'Not Applicable'}
                    </td>
                    <td
                      className={`text-[9px] text-center py-3 xl:text-sm font-medium text-red-500`}
                    >
                      ₱ -
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
        </aside>
      )}
    </section>
  )
}

export default Expenses
