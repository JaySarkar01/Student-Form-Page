"use client"
import React, { useState } from 'react';
import Sidebar from './sidebar';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="sticky top-0 p-4 shadow-md shadow-blue-400 bg-blue-600 flex items-center justify-between md:m-3 gap-4 rounded-lg z-30">
                <button onClick={toggleSidebar} className="text-white hover:bg-blue-700 p-2 rounded">
                    ☰
                </button>
                <img src="/dashboard.png" alt="Logo" className="h-10 w-auto md:h-12" />
                <span className="text-xl md:text-3xl text-fuchsia-100">Secure Data</span>
            </div>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20" 
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Navbar;