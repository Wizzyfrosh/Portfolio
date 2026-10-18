import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import Contact from "@/components/Contact";
import SupportWork from "@/components/SupportWork";
import Footer from "@/components/Footer";
import SplashWrapper from "@/components/SplashWrapper";

// Featured template prices must never be frozen in a static homepage build.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.froshcodeorbit.site/#website",
      url: "https://www.froshcodeorbit.site/",
      name: "Frosh CodeOrbit",
      description: "Portfolio showcasing web and software development projects.",
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": "https://www.froshcodeorbit.site/#person",
      name: "Umanor Wisdom",
      alternateName: "WizzyFrosh",
      url: "https://www.froshcodeorbit.site/",
      jobTitle: "Web and Software Developer",
      knowsAbout: ["Web development", "React", "Next.js", "Software development"],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SplashWrapper>
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <ExperienceSection />
        <div id="projects">
          <ProjectsSection />
        </div>
        <SupportWork />
        <Contact />
        <Footer />
      </main>
      </SplashWrapper>
    </>
  );
}
