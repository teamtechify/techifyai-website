import { LiveUpdates } from "../liveUpdates/liveUpdates";
import { NavItem } from "../nav/nav";



export const FooterBanner = () => {
  return (
    <section className="my-[80px] p-8 w-full">
      <div className="flex lg:flex-row flex-col max-lg:gap-10 justify-between">
        <LiveUpdates />
        <div className="text-start max-lg:text-center">
          <h2 className="lg:text-[180px] text-[90px] max-lg:py-8 text-white uppercase leading-none">
            o.sol
          </h2>
          <h2 className="text-[26px] text-white uppercase leading-none">
            the s&p 500 of solana's ai ecosystem
          </h2>
        </div>
      </div>
      <div className="w-full flex lg:flex-row flex-col max-lg:gap-5 justify-between mt-8">
        <div>
          <p className="small text-white">
            O.XYZ
            <span className="text-text-secondary">
              {" "}
              ©2025. O System Corp. Panama City, Panama & O.SYSTEMS Doha, Qatar
              RESERVED.
            </span>
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <NavItem data={{name: 'PRIVACY POLICY', href: '/privacyPolicy'}}/>
          <NavItem data={{name: 'TERMS AND CONDITIONS', href: '/privacyPolicy'}}/>
        </div>
      </div>
      <div className="w-full h-[1px] bg-text-secondary/30 my-4"></div>
      <div className="text-text-secondary">
        <p className="smaller">
          IMPORTANT USER INFORMATION: CRYPTO PRODUCTS ARE HIGHLY RISKY AND
          REGULATORY TREATMENT IS UNSETTLED IN MANY AREAS. THERE MAY BE NO
          REGULATORY RECOURSE FOR LOSSES FROM TRANSACTIONS IN $OSOL COIN. THE
          VALUE OF $OSOL TOKENS CAN CHANGE RAPIDLY AND MAY BE COMPLETELY LOST.
        </p>
        <br />
        <p className="smaller">
          AVAILABILITY: $OSOL COINS ARE NOT AVAILABLE TO RESIDENTS OR ENTITIES
          IN THE UNITED STATES OR THOSE LOCATED, INCORPORATED, OR WITH A
          REGISTERED AGENT THERE.
        </p>
        <br />
        <p className="smaller">
          DISCLAIMER: CRYPTOCURRENCIES ARE HIGHLY SPECULATIVE AND INVOLVE
          SIGNIFICANT RISKS. THE VALUE OF $OSOL TOKENS MAY FLUCTUATE RAPIDLY,
          AND PARTICIPANTS SHOULD BE FULLY AWARE OF THE RISKS INVOLVED IN
          CRYPTOCURRENCY INVESTMENT BEFORE PARTICIPATING. $OSOL IS NOT AVAILABLE
          TO U.S. PERSONS OR ENTITIES, AS DEFINED UNDER U.S. SECURITIES LAWS AND
          REGULATIONS. IT IS THE RESPONSIBILITY OF PARTICIPANTS TO ENSURE THAT
          THEIR JURISDICTION ALLOWS PARTICIPATION BEFORE GETTING INVOLVED.
        </p>
      </div>
    </section>
  );
};
