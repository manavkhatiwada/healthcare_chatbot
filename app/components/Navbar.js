"use client"

import Link from "next/link";
import React from "react";
import { TbCategory } from "react-icons/tb";

export default function Navbar({ }) {
    return <>
        <nav className="w-full px-6 py-4 box h-[80px] shadow flex justify-between items-center bg-white border-b border-gray-200">
            <div className="max-w-[1400px] fcb w-full mx-auto">
                <Link href={"/"} className="fc gap-3">
                    <img src="/favicon.ico" alt="" className="w-[40px]" />
                    <h2 className="text-2xl">Pocket Doctor</h2>
                </Link>
                <div className="fcb gap-5 text-gray-600 font-medium">
                    <a href="https://portfolio.rohan-koirala.com.np/">About</a>
                    <a href="https://portfolio.rohan-koirala.com.np/">Chat</a>
                    <a href="https://portfolio.rohan-koirala.com.np/">Appoinment</a>
                    <a href="https://portfolio.rohan-koirala.com.np/">Contact</a>
                    <button className="button-sec">
                        Login
                    </button>
                    <button className="button-pri">
                        SignUp
                    </button>
                </div>
            </div>
        </nav>
    </>
}