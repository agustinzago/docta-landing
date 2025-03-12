import Hero from "@/components/Hero";
import OurTeam from "@/components/Team/OurTeam";
import Pricing from "@/components/Pricing/Pricing";
import FAQ from "@/components/FAQ";
import Logos from "@/components/Logos";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Logos />
      <Container>
        <Benefits />

        <Section
          id="pricing"
          title="Pricing"
          description="Simple, transparent pricing. No surprises."
        >
          <Pricing />
        </Section>

        <Section
          id="team"
          title="Our Team"
          description="Meet the team behind docta."
        >
          <OurTeam />
        </Section>

        <FAQ />

        <Stats />
        
        <CTA />
      </Container>
    </>
  );
};

export default HomePage;
