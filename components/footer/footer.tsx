import { ScrollingBanner } from "../scrollingBanner/scrollingBanner"

export const Footer = () =>{
    return(
        <footer className="w-full bg-black/80 h-[44px] fixed bottom-0 left-0 z-40">
            <ScrollingBanner/>
        </footer>
    )
}