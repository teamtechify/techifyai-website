import { ReactNode } from "react"
import './index.css'
import Image from "next/image"

interface ImageContentBoxType {
    icon: ReactNode,
    title: string,
    description: ReactNode,
    note: string,
    src: string,
    href: string,
    alt?: boolean
}

export const ImageContentBoxComponent = ({ data }: { data: ImageContentBoxType }) => {
    return (
        <article className="ImageContentBox relative group cursor-pointer border-[1px] border-white/20 hover:border-white/50">
            <figure className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none z-0 group-hover:opacity-100 duration-500 transition-all">
                <Image
                    src={data.alt ? '/images/service_bg1.png' : '/images/service_bg2.png'}
                    alt="Service Offering"
                    className="w-full h-full object-cover"
                    height={2048}
                    width={2048}
                    />
            </figure>
            {data.alt ? <div className="flex flex-col lg:flex-row p-8 bg-black/75 relative z-10 gap-16 items-center">
                <figure className="shrink">
                    <Image
                        src={data.src}
                        alt="Service Offering"
                        className="w-full h-auto object-cover"
                        height={512}
                        width={512} />
                </figure>
                <div className="grow lg:max-w-5/8">
                    <div>{data.icon}</div>
                    <h4 className="mt-8 lg:mt-16 uppercase text-white text-2xl lg:text-4xl">{data.title}</h4>
                    <div className="text-white/75 my-8 text-[14px] text-center lg:text-left lg:text-xl">{data.description}</div>
                    <p className="text-white text-md lg:text-3xl text-center lg:text-left">{data.note}</p>
                </div>
            </div>
                : <div className="flex flex-col lg:flex-row p-8 bg-black/75 relative z-10 gap-16 items-center">
                    <div className="grow">
                        <div>{data.icon}</div>
                        <h4 className="mt-8 lg:mt-16 uppercase text-white text-2xl lg:text-4xl">{data.title}</h4>
                        <div className="text-white/75 my-8 text-[14px] text-center lg:text-left lg:text-xl">{data.description}</div>
                        <p className="text-white text-md lg:text-3xl text-center lg:text-left">{data.note}</p>
                    </div>
                    <figure className="shrink lg:max-w-5/8">
                        <Image
                            src={data.src}
                            alt="Service Offering"
                            className="w-full h-auto object-cover"
                            height={512}
                            width={512} />
                    </figure>
                </div>}
        </article>
    )
}