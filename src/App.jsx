import PreferredAgents from "./components/home/PreferredAgents"
import Navbar from "./components/common/Navbar";
import Hero from "./components/home/Hero";
import PopularProperties from './components/home/PopularProperties'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <PopularProperties />
      <PreferredAgents />
    </div>
  );
}

export default App;