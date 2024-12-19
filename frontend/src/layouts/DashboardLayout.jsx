import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import DesktopNav from '@/components/DesktopNav'
import MobileNav from '@/components/MobileNav'
import { IoClose, IoMenu } from 'react-icons/io5'

const DashboardLayout = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const [showNav, setShowNav] = useState(false)

  const handleNav = () => {
    setShowNav(!showNav)
  }

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

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
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
      {isDesktop ? (
        <DesktopNav handleLogout={handleLogout} />
      ) : (
        <React.Fragment>
          <div
            className={`fixed bg-black/40 inset-0 z-0 duration-100 ${
              showNav ? 'block' : 'hidden'
            }`}
          />
          <span className='fixed text-white text-2xl top-5 right-5 z-20'>
            {showNav ? (
              <IoClose onClick={() => handleNav()} />
            ) : (
              <IoMenu onClick={() => handleNav()} />
            )}
          </span>
          <MobileNav
            handleLogout={handleLogout}
            showNav={showNav}
            setShowNav={setShowNav}
          />
        </React.Fragment>
      )}
      <ToastContainer />
    </div>
  )
}

export default DashboardLayout
