import { HeroSection } from "@/app/(home)/hero";
import { StatsSection } from "@/app/(home)/stats";
import { CompanyBannerSection } from "@/app/(home)/companybanner";
// import { DreamSection } from "./dream";
import { FadeInComponent } from "@/components/animations";
import { GraphSection } from "./(home)/graph";
import { NovaSections } from "./(home)/nova";
import { BookFormComponent } from "@/components/form/book";

export default function HomePage() {
  return(
    <main className="overflow-hidden">
        {/* Hero */}
        <HeroSection />
        
        {/* Company Banner */}
        <CompanyBannerSection />

        {/* Stats */}
        <FadeInComponent>
          <StatsSection/>
        </FadeInComponent>
        
        <FadeInComponent>
          <GraphSection />
        </FadeInComponent>

        <NovaSections />
    </main>
  )
}