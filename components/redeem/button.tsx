import { ReactNode } from "react"

export const RedeemButton = ({children}:{children: ReactNode}) =>{
    return(
        <button className="w-full border-white/10 bg-white/3 border-[1px] uppercase text-white text-[14px] p-4 py-5 hover:border-white/30 transition-all duration-300">
            {children}
        </button>
    )
}