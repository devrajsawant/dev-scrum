import CtaSection from "@/components/landingPage/ctaSection";
import FaqSection from "@/components/landingPage/faqSection";
import FeatureSection from "@/components/landingPage/featureSection";
import HeroSection from "@/components/landingPage/heroSection";
import TrustedBySection from "@/components/landingPage/trustedBySection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <TrustedBySection />
      <FaqSection />
      <CtaSection/>
    </div>
  );
}
