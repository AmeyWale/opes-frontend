import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link className="text-3xl font-bold text-gray-900" href="/">OPES</Link>
        </div>
    </header>
  )
}

export default Navbar