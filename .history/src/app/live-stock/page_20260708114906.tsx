import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveStockPage from "@/components/LiveStockPage";

export default function LiveStockRoutePage() {
  return (
    <>
      <Header />
      <main>
        <LiveStockPage />
      </main>
      <Footer />
    </>
  );
}
