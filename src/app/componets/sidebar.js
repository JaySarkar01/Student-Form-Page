import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
            <div className="p-4">
                <h2 className="text-2xl font-bold">Sidebar</h2>
                <ul className="mt-4">
                    <li className="mb-2">
                        <a href="#" className="block p-2 hover:bg-blue-700 rounded">Home</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 hover:bg-blue-700 rounded">About</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 hover:bg-blue-700 rounded">Services</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 hover:bg-blue-700 rounded">Contact</a>
                    </li>
                </ul>
            </div>
            <button 
                onClick={toggleSidebar} 
                className="absolute top-0 right-0 p-2 text-white hover:bg-blue-700"
            >
                Close
            </button>
        </div>
    );
};

export default Sidebar;