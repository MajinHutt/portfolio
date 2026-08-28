import { Hero } from "@/components/Hero";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { AboutBlock } from "@/components/AboutBlock";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortfolioGrid />
      <AboutBlock />
    </>
  );
}
