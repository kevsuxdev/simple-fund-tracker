import DatePicker from '@/components/DatePicker'
import TextInput from '@/components/TextInput'
import { isValidAmount, toastStyle } from '@/constant'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Expenses = () => {
  const [loading, setLoading] = useState(false)
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

      <aside className='xl:w-1/2  md:w-full mt-10'>
        <form onSubmit={handleAddExpenses} className='space-y-5'>
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
            {loading ? 'Adding...' : 'Add Funds'}
          </button>
        </form>
      </aside>
    </section>
  )
}

export default Expenses
