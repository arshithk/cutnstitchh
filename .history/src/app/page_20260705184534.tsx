import Header from "@/components/Header";
import About from "@/components/About";
import IndustriesServed from "@/components/IndustriesServed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <About />
        <IndustriesServed />
      </main>
      <Footer />
    </>
  );
}