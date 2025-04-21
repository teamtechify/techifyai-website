import { ButtonMain, ButtonGhost } from "@/components/buttons/buttons";
import { ContainerBig } from "@/components/containers/containerBig";

export const TokenomicsCTASection = () => {
    return (
        <ContainerBig>
            <section className="my-[80px] flex flex-col max-lg:px-4 items-center gap-6">
                <h2 className="text-white large font-light font-inter">Buy $OSOL</h2>
                <ButtonMain>connect wallet</ButtonMain>
                <div className="p-5 border-[1px] border-white/10 flex lg:flex-row flex-col justify-between gap-20 items-center mt-[48px]">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-text-secondary small">SOLANA CONTRACT ADDRESS</p>
                        <p className="text-white small">2otVNpcHXn9MKeDk3Zby5uanF3s7tki4toaJ3PZcXaUd</p>
                    </div>
                    <div><ButtonGhost>copy address</ButtonGhost></div>
                </div>
                <p className="small text-text-secondary max-w-[1000px] text-center mt-4">
                    Disclaimer: Cryptocurrencies are highly speculative and involve significant risks. The value of OSOL tokens may fluctuate rapidly, and
                    participants should be fully aware of the risks involved in cryptocurrency investments before participating. OSOL is not available to
                    U.S. persons or entities, as defined under U.S. securities laws and regulations. It is the responsibility of participants to ensure that
                    their jurisdiction allows participation before getting involved.
                </p>
            </section>
        </ContainerBig>
    );
};