import React from 'react'
import { Link } from 'react-router-dom'

const App = () => {
  return (
    <section className='h-screen flex items-center justify-center'>
      <Link
        to='/login'
        className='bg-accent p-3 rounded-lg text-lg font-medium tracking-wide px-5'
      >
        Get Started
      </Link>
    </section>
  )
}

export default App
