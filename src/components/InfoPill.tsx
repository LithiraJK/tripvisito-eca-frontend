import React from 'react'

type InfoPillProps = {
    text: string;
    icon: React.ReactNode;
}

const InfoPill = ({text , icon } :InfoPillProps ) => {
  return (
    <figure className='flex items-center gap-1.5'>
        {icon}
        <figcaption className='text-sm md:text-lg font-normal truncate text-gray-600 inline-block'>{text}</figcaption>
    </figure>
  )
}

export default InfoPill