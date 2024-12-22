import React, { useContext, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import TextInput from '../components/TextInput'
import { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { IoLinkOutline } from 'react-icons/io5'
import Logo from '../assets/logo.png'

import axios from 'axios'
import { ToastContainer } from 'react-toastify'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [user, setUser] = useState(localStorage.getItem('token'))
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLoginForm = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('/api/users/login', formData)

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
        setError(null)
        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.response.data)
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [user, navigate])

  return (
    <section className='h-screen flex items-center justify-center'>
      <form
        onSubmit={handleLoginForm}
        className='bg-secondary w-[85%] md:w-[40%]  p-5 flex items-center flex-col z-10 rounded-lg gap-5'
      >
        <article className='w-full flex flex-col items-center gap-3'>
          <h1 className='lg:text-2xl text-xl font-bold tracking-wide self-start flex items-center justify-between w-full'>
            Login
            <NavLink to={'/'} className={'self-start'}>
              <img src={Logo} alt='Logo' className='w-8 h-8 lg:w-10 lg:h-10' />
            </NavLink>
          </h1>

          <p className='text-xs lg:text-sm text-prompt text-start self-start'>
            Provide your credentials to log in safely and keep track of your
            financial progress.
          </p>
        </article>
        <TextInput
          title='Email Address'
          placeholder='Enter your email address.'
          value={formData.email}
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
        />
        <PasswordInput
          title='Password'
          placeholder='Enter your password'
          value={formData.password}
          onChange={(event) =>
            setFormData({ ...formData, password: event.target.value })
          }
        />
        {error && (
          <p className='w-full text-xs text-red-600 text-center'>
            {error.message}
          </p>
        )}
        <button className='primary-button'>Login</button>
        <p className='text-xs flex gap-1 items-center'>
          <span>You want to access this app?</span>
          <NavLink
            to={'/request'}
            className='hover:underline flex items-center gap-1 duration-200 underline-offset-1 text-blue-500'
          >
            Request here.
          </NavLink>
        </p>
      </form>
      <ToastContainer />
    </section>
  )
}

export default Login
