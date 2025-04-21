import { AssetsCardDisplay } from "@/components/assetsCard/assetsCard"

export const AssetsSection = () =>{
    return(
        <section className="max-w-[1500px] px-4 mx-auto section">
            <h2 className="title">AI Power</h2>
             <AssetsCardDisplay/>
        </section>
    )
}