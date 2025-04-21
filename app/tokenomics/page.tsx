
import { TokenomicsCTASection } from "./(sections)/buyCTASection";
import { FooterBannerSectionBig } from "./(sections)/footerBannerSection";
import { TokenomicsHeroSection } from "./(sections)/heroSection";
import { RichTextSection } from "./(sections)/richTextSection";
import { TokenomicsTreasuriesSection } from "./(sections)/treasuriesSection";

export default function TokenomicsPage(){
    return(
        <main className="">
           
            <TokenomicsHeroSection/>
            <TokenomicsTreasuriesSection/>
            <RichTextSection/>
            <TokenomicsCTASection/>
            <FooterBannerSectionBig/>
            
        </main>
    )
}