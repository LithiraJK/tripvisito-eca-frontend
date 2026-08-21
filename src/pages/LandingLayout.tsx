import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'


const LandingLayout = () => {

  return (
    <div className='min-h-screen min-w-[320px]'>
      <header className='absolute top-0 left-0 w-full glassmorphism border-0 rounded-2xl shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <NavBar />
        </div>
      </header>

      <main className='pt-24'>
        <Outlet />
      </main>
    </div>
  )
}

export default LandingLayout




