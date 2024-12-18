import { navLinks } from '@/constant'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const MobileNav = ({ handleLogout, showNav }) => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  return (
    <nav
      className={`fixed z-10 left-0 top-0 h-screen bg-main duration-200 ${
        showNav ? 'w-56' : 'w-0'
      }`}
    >
      <div className='flex flex-col gap-2 p-3'>
        {navLinks.map((nav) => {
          const { id, location, name, subCategory } = nav
          return (
            <React.Fragment key={id}>
              <NavLink
                to={location}
                end={location === ''}
                onClick={() => toggleDropdown(id)}
                className={({ isActive }) =>
                  `text-xs text-start text-white p-3 duration-200 py-3 rounded-lg cursor-pointer ${
                    showNav ? 'block' : 'hidden'
                  } ${
                    isActive && name !== 'Funds & Expenses' ? 'bg-accent' : ''
                  }`
                }
              >
                {name}
              </NavLink>
              {subCategory && openDropdown === id && (
                <article className='pl-5 duration-200'>
                  {subCategory.map((category) => {
                    const { id, location, name } = category
                    return (
                      <NavLink
                        key={id}
                        to={location}
                        className={({ isActive }) =>
                          `text-xs text-start text-white p-3 duration-200 py-3 rounded-lg cursor-pointer ${
                            showNav ? 'block' : 'hidden'
                          } ${isActive ? 'bg-accent' : ''}`
                        }
                      >
                        {name}
                      </NavLink>
                    )
                  })}
                </article>
              )}
            </React.Fragment>
          )
        })}
        <AlertDialog>
          <AlertDialogTrigger
            className={`${
              showNav ? 'block' : 'hidden'
            } text-xs text-start text-white p-3 duration-200 py-3 rounded-lg cursor-pointer`}
          >
            Logout
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-main border-none'>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Logging out will terminate your current session. You will be
                required to log in again to regain access to your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='bg-red-600 border-none'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  )
}

export default MobileNav
