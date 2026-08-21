import { type ReactNode } from 'react'

const Sidebar = ({ children }: { children: ReactNode}) => {
  return (
    <div className='w-[270px] h-screen bg-white shadow-lg p-4 rounded-3xl'>
      {children}
    </div>
  )
}

export default Sidebar