
import { TokenomicsCTASection } from "@/app/tokenomics/(sections)/buyCTASection";
import { FooterBannerSectionBig } from "@/app/tokenomics/(sections)/footerBannerSection";
import { DetailsTitleSection } from "./(sections)/titleSection";
// import { DetailsMintedSection } from "./(sections)/mintedSection";
import { DetailsDAOWalletsSection } from "./(sections)/daoWalletsSection";
import { DetailsProposalsSection } from "./(sections)/latestProposalsSection";

export default function DetailsPage(){
    return(
        <main className="">
            <DetailsTitleSection/>
            {/* <DetailsMintedSection/> */}
            <DetailsDAOWalletsSection/>
            <DetailsProposalsSection/>
            <TokenomicsCTASection/>
            <FooterBannerSectionBig/>
        </main>
    )
}