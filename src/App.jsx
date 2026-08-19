import NeuralBackground from './components/NeuralBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Mission from './components/Mission'
import Features from './components/Features'
import TechStack from './components/TechStack'
import LogicRed from './components/LogicRed'
import Footer from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen bg-void text-slate-200">
      <NeuralBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Mission />
        <Features />
        <TechStack />
        <LogicRed />
      </main>
      <Footer />
    </div>
  )
}

export default App
