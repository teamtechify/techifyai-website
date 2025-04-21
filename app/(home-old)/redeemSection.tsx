import { ContainerMain } from "@/components/containers/containerMain";
import { RedeemButton } from "@/components/redeem/button";
import { RedeemTag, RedeemTagProps } from "@/components/redeem/tag";

const redeemTags: RedeemTagProps[] = [
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/2otVNpcHXn9MKeDk3Zby5uanF3s7tki4toaJ3PZcXaUd.png?key=1d5579",
    ticker: "OSOL",
    price: 1.983990673451,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/AKzAhPPLMH5NG35kGbgkwtrTLeGyVrfCtApjnvqAATcm.png?key=f2f383",
    ticker: "OI",
    price: 0.097,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K.png?key=238e32",
    ticker: "IO",
    price: 0.002463273803,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs.png?key=f4d065",
    ticker: "GRASS",
    price: 0.03413751836,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP.png?key=cfe49b",
    ticker: "GRIFFAIN",
    price: 0.011613344843,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC.png?key=b380cb",
    ticker: "AI16Z",
    price: 0.00244395903,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/BivtZFQ5mVdjMM3DQ8vxzvhKKiVs27fz1YUF8bRFdKKc.png?key=c13f90",
    ticker: "FLAME",
    price: 0.18106628799,
  },
  {
    src: "https://dd.dexscreener.com/ds-data/tokens/solana/4zdAbkyoYoT2F8ZSt6va4WZrmAwgFCfQsTEUo8zNpump.png?key=0fd385",
    ticker: "DIT",
    price: 0.040000017768,
  },
];

export const ReedemSection = () => {
  return (
    <section className="mx-auto ">
      <ContainerMain>
        <div className="py-8 lg:px-10 max-lg:px-2 lg:mb-[96px]">
          <h2 className="title mb-[40px]">Redeem OSOL</h2>
          <div className="w-full flex justify-between items-center ">
            <h2 className="text-text-secondary lg:text-[64px] text-[40px]">100</h2>
            <div className="flex flex-row items-center gap-2">
              <p className="uppercase text-white small">
                0 OSOL
                <span className="text-text-secondary px-1"> available</span>
              </p>
              <RedeemTag
                src="https://dd.dexscreener.com/ds-data/tokens/solana/2otVNpcHXn9MKeDk3Zby5uanF3s7tki4toaJ3PZcXaUd.png?key=1d5579"
                ticker="OSOL "
              />
            </div>
          </div>
          <div className="w-full flex flex-row items-center max-lg:py-4 pb-2">
            <div className="lg:w-[45%] max-lg:w-[25%] bg-text-secondary/30 h-[1px]"></div>
            <div className="lg:w-[10%] max-lg:w-[50%] text-center">
              <p className="text-text-secondary small uppercase">
                you will receive
              </p>
            </div>
            <div className="lg:w-[45%] max-lg:w-[25%] bg-text-secondary/30 h-[1px]"></div>
          </div>
          <div className="flex flex-row flex-wrap gap-0.5 mb-8">
            {redeemTags.map((tag, index) => (
              <RedeemTag
                key={`${index}-${tag.ticker}`}
                ticker={tag.ticker}
                src={tag.src}
                price={tag.price}
              />
            ))}
          </div>
          <div className="mb-2">
            <RedeemButton>connect wallet to redeem</RedeemButton>
          </div>
          <div className="w-full bg-warning-yellow/5 flex flex-row p-2.5 gap-3  ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="max-lg:w-[64px] max-lg:h-[64px] max-lg:mt-[-1rem]">
              <path
                d="M12 9V14"
                stroke="#FFF7AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 21.41H5.93999C2.46999 21.41 1.01999 18.93 2.69999 15.9L5.81999 10.28L8.75999 5.00003C10.54 1.79003 13.46 1.79003 15.24 5.00003L18.18 10.29L21.3 15.91C22.98 18.94 21.52 21.42 18.06 21.42H12V21.41Z"
                stroke="#FFF7AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M11.995 17H12.004"
                stroke="#FFF7AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <p className=" uppercase text-warning-yellow small">WARNING: REDEEMING WILL RESULT IN LOSING UP TO 60% OF YOUR TOTAL BALANCE.<br/>
            THIS ACTION IS IRREVERSIBLE. PLEASE ENSURE YOU UNDERSTAND THE IMPLICATIONS BEFORE PROCEEDING.</p>
          </div>
        </div>
      </ContainerMain>
    </section>
  );
};
