import React from 'react'

function Appbar() {
  return (
    <div className='border flex justify-between p-2 shadow-md'>
      <div className='flex cursor-pointer font-bold'><h2 className='text-blue-600'>Kay</h2><p>TM App</p></div>
      <div className='flex gap-2 justify-center items-center'>
        <div>Hello</div>
        <div className='bg-gray-300 p-2 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer text-indigo-500'>U</div>
      </div>
    </div>
  )
}

export default Appbar