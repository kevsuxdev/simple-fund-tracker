import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextInput from '../components/TextInput'
import { useState } from 'react'
import PasswordInput from '../components/PasswordInput'

import axios from 'axios'

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
        <article className='w-full flex flex-col items-center gap-2'>
          <h1 className='title'>Login</h1>
          <p className='text-sm text-prompt'>
            Track your savings and funds and take control today.
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
      </form>
    </section>
  )
}

export default Login
