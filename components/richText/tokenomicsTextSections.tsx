import { ReactNode } from "react"

type TokenomicsTextProps = {
    index: number,
    title: string
    children: ReactNode
}

export const TokenomicsText = ({index, title, children}:TokenomicsTextProps) =>{
    return(
        <article className="w-full p-8 border-t-[1px] border-white/10 flex lg:flex-row flex-col max-lg:gap-8 pb-16">
            <div className="lg:w-[30%] w-full flex flex-row lg:gap-16 gap-4">
                <p className="text-text-secondary text-[12.8px] max-lg:w-[25%]">[ 0{index} ]</p>
                <p className="capitalize text-white text-[24px] leading-none">{title}</p>
               
            </div>
            <div className="lg:w-[70%] w-full">
                {children}
            </div>

        </article>
    )
}