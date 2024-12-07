import React from 'react'

const TextInput = ({ title, type, placeholder, value, onChange }) => {
  return (
    <article className='w-full flex items-start gap-2 flex-col '>
      <label className='text-sm'>{title || 'Email Address'}</label>
      <input
        type={type || 'text'}
        className='input-box'
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Enter your email address'}
      />
    </article>
  )
}

export default TextInput
