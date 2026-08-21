import { Outlet } from 'react-router-dom'
import NavItems from '../components/NavItems'
import Sidebar from '../components/Sidebar'
import MobileSideBar from '../components/MobileSideBar'

const AdminLayout = () => {
  return (
    <div className='min-h-screen min-w-[375px] flex bg-gray-50'>
      {/* Mobile Sidebar */}
      <MobileSideBar/>

      {/* Desktop Sidebar */}
      <div className='hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-10'>
        <Sidebar>
          <NavItems />
        </Sidebar>
      </div>

      {/* Main Content */}
      <main className='flex-1 container mx-auto p-4 pt-20 lg:pt-4 lg:ml-64'>
        <Outlet /> 
      </main>
    </div>
  )
}

export default AdminLayout