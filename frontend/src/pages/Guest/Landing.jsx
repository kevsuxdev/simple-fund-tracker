import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { TbMoneybag } from 'react-icons/tb'
import { FiExternalLink } from "react-icons/fi";

const Landing = () => {
  return (
    <main className='px-8 lg:px-32'>
      <header className='py-8 flex justify-between items-center'>
        <h1 className='text-2xl font-bold tracking-wide'>
          <NavLink to={'/'}>
            <img src={Logo} alt='Logo' className='w-10 object-contain' />
          </NavLink>
        </h1>
        <nav></nav>
        <NavLink className='primary-button text-xs lg:text-sm bg-secondary px-7 py-2 w-fit' to={'/login'}>
          Login
        </NavLink>
      </header>

      <section className='h-[80vh] flex items-center flex-col justify-center'>
        <article className='flex items-center justify-center flex-col gap-3'>
          <p className='font-medium text-xs flex items-center gap-x-1'>
            <TbMoneybag className='text-sm text-green-400' />
            <span>Funday</span>
          </p>
          <h1 className='flex items-start text-3xl lg:text-7xl font-bold gap-2 lg:gap-3'>
            <span>Track</span>
            <span>Save</span>
            <span>Succeed</span>
          </h1>
          <p className='text-xs lg:text-sm lg:w-2/3 text-center'>
            Funday is your personal finance companion, built to help you manage
            your spending, create budgets, and achieve your savings goals.
          </p>
          <NavLink
            to={'/request'}
            className={
              'text-xs lg:text-sm primary-button text-center w-fit px-5 capitalize py-3 bg-secondary flex items-center gap-x-1'
            }
          >
             Request your account now!<FiExternalLink className='text-xs'/>
          </NavLink>
        </article>
      </section>
    </main>
  )
}

export default Landing
