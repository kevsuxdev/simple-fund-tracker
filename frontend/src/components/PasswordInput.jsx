import React, { useState } from 'react'

const PasswordInput = ({ title, value, placeholder, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <article className='w-full flex items-start gap-2 flex-col'>
      <label className='text-sm'>{title || 'Password'}</label>
      <input
        className='input-box'
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Password'}
      />
    </article>
  )
}

export default PasswordInput
