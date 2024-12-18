import { navLinks } from '@/constant'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoLogOut } from 'react-icons/io5'

const DesktopNav = ({ handleLogout }) => {
  return (
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
  ) 
}

export default DesktopNav
