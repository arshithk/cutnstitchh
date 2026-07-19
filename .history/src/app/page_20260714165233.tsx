import Image from "next/image";
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

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8 xl:pb-10">
          <div className="overflow-hidden rounded-[2rem] border border-border-custom/20 bg-card/80 shadow-2xl">
            <Image
              src="/images/first-page-image.jpeg"
              alt="First page feature"
              width={1600}
              height={900}
              className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[520px]"
              priority
            />
          </div>
        </div>
      </section>

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