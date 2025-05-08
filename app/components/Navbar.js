"use client"
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 h-20 shadow-md border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-6 h-6"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" />
            </svg>
          </div>
          <span className="font-semibold text-lg md:text-xl">
            <span className="text-blue-500">Pocket</span>
            <span className="text-gray-700">Doctor</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/chat" className="text-gray-700 hover:text-blue-500">Chat</Link>
          <Link href="/appointment" className="text-gray-700 hover:text-blue-500">Appointment</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
          <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-2 pb-4 px-4 space-y-2 bg-white">
          <Link href="/" className="block py-2 text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/chat" className="block py-2 text-gray-700 hover:text-blue-500">Chat</Link>
          <Link href="/appointment" className="block py-2 text-gray-700 hover:text-blue-500">Appointment</Link>
          <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-500">About</Link>
          <Link href="/login" className="block py-2 text-gray-700 hover:text-blue-500">Login</Link>
          <Link href="/signup" className="block text-center mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}