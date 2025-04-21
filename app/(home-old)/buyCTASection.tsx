import { ButtonGhost, ButtonMain } from "@/components/buttons/buttons"
import { ContainerMain } from "@/components/containers/containerMain"
import Link from "next/link"

export const BuyCTASection = () => {
    return (
        <section className="section max-w-[1500px] flex flex-col max-lg:px-4 items-center gap-6 mx-4 lg:mx-auto border-white/20 border-[1px] p-4 lg:py-20 hover:scale-105 duration-300 transition-all">
            <h2 className="text-white large text-center">START TODAY</h2>
            <p className="text-text-secondary max-w-[512px] text-center mx-auto text-[14px] lg:text-lg mb-4">
                Will you be on the winning side of business?
                <br /><br />
                <span className="text-white font-bold">AI changed the game</span> and its impact on businesses is already enormous.
                <br /><br />
                History WILL repeat itself. New, efficient approaches WILL replace obsolete ones.
                <br /><br />
                You can <span className="text-white font-bold">act now and scale your business faster</span> than ever before…
                <br /><br />
                Or stay stagnant, wishing the technology won&apos;t put “the old way” out of business.
            </p>
            <Link href='/'><ButtonMain>BOOK A CALL NOW</ButtonMain></Link>
            {/* <div className="p-5 border-[1px] border-white/10 flex lg:flex-row flex-col justify-between gap-20 items-center mt-[48px]">
                <div className="flex flex-col gap-1.5">
                    <p className="text-text-secondary small">SOLANA CONTRACT ADDRESS</p>
                    <p className="text-white small">2otVNpcHXn9MKeDk3Zby5uanF3s7tki4toaJ3PZcXaUd</p>
                </div>
                <div><ButtonGhost>copy address</ButtonGhost></div>
            </div> */}
            {/* <p className="small text-text-secondary max-w-[1000px] text-center mt-4">Disclaimer: Cryptocurrencies are highly speculative and involve significant risks. The value of OSOL tokens may fluctuate rapidly, and
                participants should be fully aware of the risks involved in cryptocurrency investments before participating. OSOL is not available to
                U.S. persons or entities, as defined under U.S. securities laws and regulations. It is the responsibility of participants to ensure that
                their jurisdiction allows participation before getting involved.</p> */}
        </section>
    )
}