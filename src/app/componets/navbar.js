const Navbar = () => {
    return (
        <div className="sticky top-0 p-4 shadow-md shadow-blue-400 bg-blue-600 flex items-center justify-end md:m-3 gap-2 rounded-lg z-50">
            <img src="/dashboard.png" alt="Logo" className="h-12 w-auto" />
            <span className="text-3xl text-fuchsia-100">Secure Data</span>
        </div>
    );
};

export default Navbar;
