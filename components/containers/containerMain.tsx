import { ReactNode } from "react"

export const ContainerMain = ({children}:{children:ReactNode}) =>{
    return(
        <article className="max-w-[1500px] max-lg:mx-4 px-4 h-full border-[1px] border-white/10 mx-auto">
            {children}
        </article>
    )
}