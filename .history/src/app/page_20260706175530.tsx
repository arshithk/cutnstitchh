import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatisticsSection from "@/components/StatisticsSection";
import About from "@/components/About";
import IndustriesServed from "@/components/IndustriesServed";
import ProductCategories from "@/components/ProductCategories";
import ProcessTimeline from "@/components/ProcessTimeline";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <StatisticsSection />
        <About />
        <IndustriesServed />
        <ProductCategories />
        <ProcessTimeline />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </>
  );
}