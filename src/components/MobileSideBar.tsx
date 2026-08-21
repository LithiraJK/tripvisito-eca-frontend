import { useState } from "react";
import { Link } from "react-router-dom";
import NavItems from "./NavItems";
import { IoCloseSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/icons/logo.svg";



const MobileSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md flex justify-between items-center px-4 py-3">
        <Link
          to="/"
          className="flex flex-row items-center space-x-2"
          onClick={closeSidebar}
        >
          <img src={logo} alt="logo" className="size-8" />
          <h1 className="text-xl font-bold">Tripvisito</h1>
        </Link>

        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu className="size-7" />
        </button>
      </header>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[270px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-4">
            
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
            aria-label="Close menu"
          >
            <IoCloseSharp className="w-6 h-6" />
          </button>

          <div onClick={closeSidebar} className="flex-1 flex flex-col overflow-y-auto">
            <NavItems />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileSideBar;
