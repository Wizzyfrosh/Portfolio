import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SplashWrapper from "@/components/SplashWrapper";

export default function Home() {
  return (
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
        <Contact />
        <Footer />
      </main>
    </SplashWrapper>
  );
}
