import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { navLinks } from '../constant'
import { IoLogOut } from 'react-icons/io5'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const DashboardLayout = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const checkSession = async () => {
    try {
      await axios.get('/api/users/check', { withCredentials: true })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Session expired, redirecting to login...')
        localStorage.clear()
        sessionStorage.clear()
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      localStorage.clear()
      sessionStorage.clear()
    } else {
      checkSession()
    }
  }, [token, navigate])

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/users/logout')

      if (response.data) {
        localStorage.clear()
        sessionStorage.clear()
        navigate('/login')
      }
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div>
      <Outlet />
      <nav className='w-[80%] bg-accent h-16 fixed bottom-[5%] left-[10%] rounded-full'>
        <aside className='w-full flex items-center justify-center h-full xl:gap-5 gap-3'>
          {navLinks.map((nav) => {
            const { id, location, icon } = nav
            return (
              <NavLink
                key={id}
                to={location}
                className={({ isActive }) =>
                  `text-2xl text-center hover:bg-main p-3 duration-200 py-3 rounded-lg ${
                    isActive ? 'bg-accent' : ''
                  }`
                }
              >
                {icon}
              </NavLink>
            )
          })}
          <form onSubmit={handleLogout}>
            <button className='text-2xl text-center hover:bg-main p-3 duration-200 py-3 rounded-lg'>
              <IoLogOut />
            </button>
          </form>
        </aside>
      </nav>
      <ToastContainer />
    </div>
  )
}

export default DashboardLayout
