import Navbar from "./components/common/Navbar";
import Hero from "./components/home/Hero";
import PopularProperties from "./components/home/PopularProperties";
import PreferredAgents from "./components/home/PreferredAgents";
import InvestmentAdvisory from "./components/home/InvestmentAdvisory";
import Testimonials from "./components/home/Testimonials";
import Footer from "./components/home/Footer";
function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <PopularProperties />
      <PreferredAgents />
      <InvestmentAdvisory />
      <Testimonials />
      <Footer />
    </>
  );
}

export default App;