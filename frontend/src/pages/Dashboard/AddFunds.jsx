import React, { useCallback, useEffect, useState } from 'react'
import TextInput from '@/components/TextInput'
import DatePicker from '@/components/DatePicker'
import { isValidAmount, savingsHeaderContent, toastStyle } from '@/constant'
import axios from 'axios'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import PulseLoading from '@/components/PulseLoading'

const AddFunds = () => {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [listOfSaving, setListOfSaving] = useState([])
  const [error, setError] = useState({
    message: null,
  })

  const [formData, setFormData] = useState({
    amount: 0,
    date: null,
  })

  const handleAddFunds = async (event) => {
    event.preventDefault()

    setLoading(true)

    if (!isValidAmount(formData.amount) || parseFloat(formData.amount) <= 0) {
      setLoading(false)
      return setError({ message: 'Please enter a valid amount.' })
    }

    if (!formData.date) {
      setLoading(false)
      return setError({ message: 'Please enter date issued of funds.' })
    }

    try {
      const response = await axios.post('/api/funds/add-funds', formData)

      if (response.data) {
        toast.success(response.data.message, { ...toastStyle })

        setFormData({
          amount: 0,
          date: null,
        })

        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setError({ message: error.response.data.message })
    }

    setLoading(false)
    setError(null)
  }

  const savings = useCallback(async () => {
    try {
      const response = await axios.get('/api/funds/')
      const data = await response.data.funds
      const latest = data.sort(
        (prev, next) => new Date(next.createdAt) - new Date(prev.createdAt)
      )
      setListOfSaving(latest)
    } catch (error) {
      console.log(error.response)
    }
  }, [])

  useEffect(() => {
    const fetchingSaving = async () => {
      setFetching(true)
      try {
        await savings()
      } catch (error) {
        console.log(error)
      } finally {
        setFetching(false)
      }
    }

    fetchingSaving()
  }, [savings])

  return (
    <section className='w-full h-screen p-5'>
      <article className='space-y-3'>
        <h1 className='text-2xl font-bold bottom-line relative w-fit pb-2'>
          Add Funds
        </h1>
        <p className='text-sm text-prompt'>
          Ready to add some money to your account? Just fill out the form below
          and boost your balance in no time!
        </p>
      </article>

      {fetching ? (
        <PulseLoading />
      ) : (
        <aside className='w-full mt-10 flex lg:flex-row flex-col gap-8 items-start'>
          <form
            onSubmit={handleAddFunds}
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
            <DatePicker
              title='Date issued'
              date={formData.date}
              setDate={(selectedDate) =>
                setFormData({ ...formData, date: selectedDate.toISOString() })
              }
            />
            <button type='submit' className='primary-button' disabled={loading}>
              {loading ? 'Adding...' : 'Add Fund'}
            </button>
          </form>

          <table className='w-full border-collapse'>
            <thead className='w-full bg-[#161717] rounded-lg'>
              <tr>
                {savingsHeaderContent.map((nav) => {
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
              {listOfSaving.map((fund, index) => {
                const { _id, amount, date } = fund
                return (
                  <tr
                    key={_id}
                    className={`${
                      index % 2 === 0 ? 'bg-white/10' : 'bg-transparent'
                    } p-3 px-10 gap-5 w-full rounded-lg`}
                  >
                    <td className='text-[9px] text-center py-3 xl:text-sm'>
                      Savings
                    </td>
                    <td
                      className={`text-[9px] text-center py-3 xl:text-sm font-medium text-green-400`}
                    >
                      ₱ +
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

export default AddFunds
