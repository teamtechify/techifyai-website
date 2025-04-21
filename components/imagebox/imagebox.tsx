import '@/components/imagebox/index.css'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'

export const ImageBoxComponent = ({ src, title, description, href, icon }: { src: string, title: string, description: string, href: string, icon?: ReactNode }) => {
    return (
      <Link href={href} className="block w-full h-full">
        <div className="h-full flex flex-col justify-between relative bg-white shadow-md  overflow-hidden group">
          {icon && <div className="absolute top-4 left-4 z-20">{icon}</div>}
  
          <figure className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none z-0 group-hover:opacity-100 duration-500 transition-all">
            <Image
              src={src}
              alt="Service Offering"
              className="w-full h-full object-cover"
              height={2048}
              width={2048}
            />
          </figure>
  
          <div className="relative z-10 mt-48 group-hover group-hover:bg-black/80 duration-500 transition-all p-4">
            <h2 className="text-black text-xl font-bold uppercase group-hover:text-white duration-500 transition-all group-hover:text-2xl">{title}</h2>
            <p className="text-text-secondary text-base mt-2 group-hover:text-white duration-500 transition-all">{description}</p>
          </div>
        </div>
      </Link>
    )
  }
  