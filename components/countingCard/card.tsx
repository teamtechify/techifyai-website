import { ReactNode } from "react";

export type CardProps = {
    children: ReactNode;
    className?: string;
}

export const Card = ({
    children,
    className = ""
}: CardProps) => {
    return (
        <article className={`px-4 w-full flex flex-col justify-between border-[2px] bg-text-secondary/10 border-white/20 ${className}`}>
            {children}
        </article>
    );
};