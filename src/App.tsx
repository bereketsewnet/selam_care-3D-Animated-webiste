import { Header } from './components/Header';
import { Section1 } from './components/sections/Section1';
import { Section2 } from './components/sections/Section2';
import { Section3 } from './components/sections/Section3';
import { Section4 } from './components/sections/Section4';
import { IrisTransition } from './components/IrisTransition';
import { VaultTransition } from './components/VaultTransition';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-[#020814] text-slate-50 font-sans selection:bg-selam-cyan selection:text-white overflow-x-hidden relative">
      <main className="relative z-10 bg-[#020814] shadow-[0_40px_100px_rgba(0,0,0,1)] rounded-b-[2.5rem] overflow-hidden">
        <Header />
        <Section1 />
        <Section2 />
        <IrisTransition />
        <Section3 />
        <VaultTransition />
        <Section4 />
      </main>

      <Footer />
    </div>
  );
}
