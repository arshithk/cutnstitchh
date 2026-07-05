import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProcessTimeline from "@/components/ProcessTimeline";
import ProductCategories from "@/components/ProductCategories";
import Customizer from "@/components/Customizer";
import WhyChooseUs from "@/components/WhyChooseUs";
import IndustriesServed from "@/components/IndustriesServed";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <ProcessTimeline />
        <ProductCategories />
        <Customizer />
        <WhyChooseUs />
        <IndustriesServed />
        <Gallery />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
