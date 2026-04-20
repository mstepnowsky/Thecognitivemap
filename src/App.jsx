import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ThinkingRoutines from './pages/ThinkingRoutines'
import CognitiveMap from './pages/CognitiveMap'
import ImagineFramework from './pages/ImagineFramework'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/routines" element={<ThinkingRoutines />} />
          <Route path="/map"      element={<CognitiveMap />} />
          <Route path="/imagine"  element={<ImagineFramework />} />
        </Routes>
      </main>
      <footer className="bg-brand-950 text-slate-400 text-center text-xs py-4 mt-8">
        © {new Date().getFullYear()} The Cognitive Map · All rights reserved
      </footer>
    </div>
  )
}
