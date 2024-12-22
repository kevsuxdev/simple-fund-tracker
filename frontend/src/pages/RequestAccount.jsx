import React, { useRef, useState } from 'react'
import TextInput from '@/components/TextInput'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { toastStyle } from '@/constant'
import Logo from '../assets/logo.png'

const RequestAccount = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [requestForm, setRequestForm] = useState({
    email: '',
  })

  const sendRequest = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('/api/users/request', requestForm)

      toast.success(response.data.message, { ...toastStyle })

      setRequestForm({
        email: '',
      })
      setMessage(
        'Your request has been submitted successfully. We will contact you soon.'
      )
      setIsLoading(false)
    } catch (error) {
      toast.warn(error.response.data.message, toastStyle)
      setIsLoading(false)
      setMessage('')
    }
  }

  return (
    <section className='flex items-center justify-center h-screen'>
      <form
        onSubmit={sendRequest}
        className='bg-secondary w-[85%] md:w-[40%]  p-5 flex items-center flex-col z-10 rounded-lg gap-5'
      >
        <article className='w-full flex flex-col items-center gap-3'>
          <h1 className='text-xl font-bold tracking-wide self-start flex items-center justify-between w-full'>
            Request Form
            <NavLink to={'/'} className={'self-start'}>
              <img src={Logo} alt='Logo' className='w-8 h-8 lg:w-10 lg:h-10' />
            </NavLink>
          </h1>
          <p className='text-xs lg:text-sm text-prompt text-start self-start '>
            Fill out the form below to request an account and unlock the full
            potential of Funday
          </p>
        </article>
        {message && (
          <p className='text-xs text-green-500 tracking-wide text-center'>
            Your request has been submitted successfully. We will contact you
            soon.
          </p>
        )}
        <TextInput
          title='Email Address'
          placeholder='Enter your email address.'
          type='email'
          value={requestForm.email}
          onChange={(event) =>
            setRequestForm({ ...requestForm, email: event.target.value })
          }
        />
        <article className='w-full'>
          <button
            className={`primary-button bg-main hover:bg-secondary hover:border hover:border-gray-500 ${
              isLoading && 'bg-secondary border border-gray-500'
            } border border-transparent duration-200`}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Requesting...' : 'Send Request'}</span>
          </button>
        </article>
        <p className='text-xs flex gap-1 items-center'>
          <span>Already have an account?</span>
          <NavLink
            to={'/login'}
            className='hover:underline flex items-center gap-1 duration-200 underline-offset-1 text-blue-500'
          >
            Login here.
          </NavLink>
        </p>
      </form>
      <ToastContainer />
    </section>
  )
}

export default RequestAccount
