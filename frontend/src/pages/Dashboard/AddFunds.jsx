import React, { useState } from 'react'
import TextInput from '@/components/TextInput'
import DatePicker from '@/components/DatePicker'
import { isValidAmount, toastStyle } from '@/constant'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddFunds = () => {
  const [loading, setLoading] = useState(false)
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

      <aside className='xl:w-1/2  md:w-full mt-10'>
        <form onSubmit={handleAddFunds} className='space-y-5'>
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
            {loading ? 'Adding...' : 'Add Funds'}
          </button>
        </form>
      </aside>
    </section>
  )
}

export default AddFunds
