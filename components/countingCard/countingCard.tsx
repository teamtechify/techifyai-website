import { ReactNode } from "react";

export type CountingCardProps={
    value: number;
    children: ReactNode
    symbol?: string
}

export const CountingCard =({children, value, symbol}:CountingCardProps) =>{
    return(
        <article className=" px-4 w-full h-[180px] flex flex-col justify-between border-[2px] bg-text-secondary/10 border-white/10 m ">
            <h2 className=" text-white text-[64px] font-[600]">{Math.abs(value).toLocaleString()}{symbol}</h2>
            {children}
        </article>
    )
}