import { MouseEventHandler, ReactNode } from "react"

export const ButtonMain = ({children, onClick}:{children:ReactNode, onClick?: Function}) =>{
    return(
        <button onClick={onClick ? () => onClick() : undefined} className="cursor-pointer uppercase bg-white text-black px-12 py-3 w-fit text-[12px] font-[500] hover:scale-105 duration-300 transition-all flex gap-2 items-center">
            {children}
        </button>
    )
}
export const ButtonMainSmall = ({children, full, onClick}:{children:ReactNode, full?: boolean, onClick?: Function}) =>{
    return(
        <button onClick={onClick ? () => onClick() : undefined} className={`cursor-pointer uppercase bg-white text-black px-12 py-2 ${full ? 'w-full' : 'w-fit'} text-[12px] font-[500] flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300`}>
            {children}
        </button>
    )
}
export const ButtonGhost = ({children, large}:{children:ReactNode, large?: boolean}) =>{
    return(
        <button className={`cursor-pointer uppercase bg-transparent text-white border-white/10 hover:border-white/30 border-[1px] px-12 py-2 hover:scale-105 ${large ? "text-[18px]": "text-[12px]"} font-[500] transition-all duration-300`}>
            {children}
        </button>
    )
}
export const ButtonShade = ({children}:{children:ReactNode}) =>{
    return(
        <button className="cursor-pointer uppercase bg-[rgba(14,14,14)] text-white border-white/10 hover:border-white/30 border-[1px] px-12 py-2 w-fit text-[12px] font-[500] transiton-all duration-300">
            {children}
        </button>
    )
}