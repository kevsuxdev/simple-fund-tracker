import { navLinks } from '@/constant'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoLogOut } from 'react-icons/io5'
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

const DesktopNav = ({ handleLogout }) => {
  return (
    <nav className='px-20 bg-transparent h-16 fixed top-[85%] left-[50%] translate-x-[-50%] translate-y-[50%] rounded-full backdrop-blur-xl border border-gray-900'>
      <aside className='w-full flex items-center justify-center h-full xl:gap-5 gap-3'>
        {navLinks.map((nav) => {
          const { id, location, icon, subCategory } = nav
          return (
            <React.Fragment key={id}>
              <NavLink
                to={location}
                end
                className={({ isActive }) =>
                  `text-2xl text-center hover:bg-main p-3 duration-200 py-3 rounded-lg ${
                    isActive ? 'bg-accent' : ''
                  }`
                }
              >
                {icon}
              </NavLink>

              {subCategory && (
                <article className='duration-400 flex items-center justify-center'>
                  {subCategory.map((category) => {
                    const { id, location, icon, name } = category
                    return (
                      location !== 'funds' && (
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
                    )
                  })}
                </article>
              )}
            </React.Fragment>
          )
        })}
        <AlertDialog>
          <AlertDialogTrigger
            className={`text-xs text-start text-white p-3 duration-200 py-3 rounded-lg cursor-pointer`}
          >
            <IoLogOut className='text-2xl'/>
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
      </aside>
    </nav>
  )
}

export default DesktopNav
