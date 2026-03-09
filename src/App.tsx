import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { Section1 } from './components/sections/Section1';
import { Section2 } from './components/sections/Section2';
import { Section3 } from './components/sections/Section3';
import { Section4 } from './components/sections/Section4';
import { IrisTransition } from './components/IrisTransition';
import { VaultTransition } from './components/VaultTransition';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // 1. Tell Chrome/Safari NOT to natively jump the scrollbar downward on page load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Trick the browser into saving Y=0 as the scroll state right before a reload
    const handleBeforeUnload = () => window.scrollTo(0, 0);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 3. Immediately scroll to top
    window.scrollTo(0, 0);
    ScrollTrigger.clearScrollMemory("manual");

    // 4. Give React a tiny fraction of a second to paint the DOM, then force GSAP to perfectly sync timelines
    const timer = setTimeout(() => {
      window.scrollTo(0, 0); // Re-anchor
      ScrollTrigger.refresh(true); // Force GSAP to remeasure all elements from Y=0
    }, 100);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timer);
    };
  }, []);

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
