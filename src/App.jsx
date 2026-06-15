import AboutUs from "./components/home/AboutUs";
import WhyChooseUs from "./components/home/WhyChooseUs";
import PropertyCategories from "./components/home/PropertyCategories";
import SearchFilters from "./components/home/SearchFilters";
import Navbar from "./components/common/Navbar";
import Hero from "./components/home/Hero";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <AboutUs />
      <WhyChooseUs />
      <PropertyCategories />
      <SearchFilters />
    </div>
  );
}

export default App;