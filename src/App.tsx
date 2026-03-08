import { Header } from './components/Header';
import { Section1 } from './components/sections/Section1';
import { Section2 } from './components/sections/Section2';
import { Section3 } from './components/sections/Section3';
import { Section4 } from './components/sections/Section4';
import { IrisTransition } from './components/IrisTransition';
import { VaultTransition } from './components/VaultTransition';

export default function App() {
  return (
    <main className="bg-slate-950 w-full min-h-screen text-slate-50 font-sans selection:bg-selam-cyan selection:text-white overflow-x-hidden">
      <Header />
      <Section1 />
      <Section2 />
      <IrisTransition />
      <Section3 />
      <VaultTransition />
      <Section4 />

      <footer className="w-full py-24 bg-slate-950 flex flex-col items-center justify-center text-center border-t border-white/10 relative z-50">
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-selam-cyan to-blue-500 mb-6 tracking-tight">
          Ready to transform your practice?
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">
          Join leading professionals who have already upgraded to Selam Care.
        </p>
        <button className="glass-button bg-selam-cyan/10 hover:bg-selam-cyan/20 border-selam-cyan/30 text-white font-bold px-12 py-4">
          Request Early Access
        </button>
      </footer>
    </main>
  );
}
