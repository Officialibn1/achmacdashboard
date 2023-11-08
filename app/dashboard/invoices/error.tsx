'use client'
import React, { useEffect } from 'react'

const Error = ({error, reset}: {
  error: Error & { digest?: string},
  reset: () => void
}) => {

  useEffect(() => {
    console.error(error);
    
  }, [error])
  
  return (

    <div>
        <h1 className="text-5xl text-red-400">
          Error fetching Invoice data! ! !
        </h1>

        <button onClick={() => reset()} className='p-3 rounded-lg outline outline-green-600 text-slate-800 font-bold mt-5 hover:bg-green-100 duration-150 ease-in-out' >
          Reset Error
        </button>
    </div>
  )
}

export default Error