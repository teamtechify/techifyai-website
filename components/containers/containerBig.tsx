import { ReactNode } from "react"

export const ContainerBig = ({children}:{children:ReactNode}) =>{
    return(
        <article className="h-full border-[1px] border-white/10 mx-auto max-w-[1500px]">
            {children}
        </article>
    )
}