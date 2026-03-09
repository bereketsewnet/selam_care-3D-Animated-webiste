import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import gsap from 'gsap';

interface PreloaderProps {
    onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let isLoaded = false;
        
        // 1. Force explicitly download the very first massive 3D frame visually
        const preloadImage = new Image();
        
        const markLoaded = () => {
            isLoaded = true;
        };

        // BUGFIX: MUST attach onload/onerror handlers BEFORE declaring the src, otherwise cached images fire their load event before we are listening!
        preloadImage.onload = markLoaded;
        preloadImage.onerror = markLoaded; // Failsafe: if the image 404s, don't lock the user on the loading screen forever
        preloadImage.src = '/section 1/ezgif-frame-000.webp';
        
        if (preloadImage.complete) {
            markLoaded();
        }

        // 2. Fast progress timer optimized for ~0.5 second cinematic minimum
        let currentProgress = 0;
        let elapsedMs = 0;
        
        const intervalId = window.setInterval(() => {
            elapsedMs += 50;
            
            // Failsafe: Absolute maximum of 5 seconds. If a user's network drops or an adblocker stalls the image, force the site to open anyway.
            if (elapsedMs >= 5000) {
                isLoaded = true;
            }

            if (currentProgress < 90) {
                // Rush to 90% very quickly (approx 300ms)
                currentProgress += 15 + Math.random() * 10;
            } else if (isLoaded && currentProgress < 100) {
                // Snap to 100% once the single asset is ready
                currentProgress += 20;
            }

            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(intervalId);
                
                // Animate out the loader screen elegantly but swiftly
                gsap.to('.preloader-container', {
                    opacity: 0,
                    duration: 0.4, // Faster fade
                    ease: 'power2.inOut',
                    delay: 0.05, // Almost no buffer
                    onComplete: onComplete // Tells App.tsx to mount the real site
                });
            }

            setProgress(Math.min(100, Math.floor(currentProgress)));
        }, 50); // Updates every 50ms instead of 100ms for a tighter, faster feel

        return () => {
            clearInterval(intervalId);
            preloadImage.onload = null;
            preloadImage.onerror = null;
        };
    }, [onComplete]);

    return (
        <div className="preloader-container fixed inset-0 z-[100] bg-[#020814] flex flex-col items-center justify-center pointer-events-none">
            {/* Dark background radial atmospheric light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-selam-cyan/10 via-transparent to-transparent opacity-50" />
            
            <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm px-8">
                {/* Logo Pulse element */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-selam-cyan/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,220,255,0.15)] relative z-10">
                        <Activity className="text-selam-cyan w-8 h-8" style={{ animation: 'node-blink 1.5s ease-in-out infinite' }} />
                    </div>
                    {/* Expanding ripple effect beneath logo */}
                    <div className="absolute inset-0 border border-selam-cyan/50 rounded-2xl animate-ping" style={{ animationDuration: '2s' }} />
                </div>

                {/* Progress Bar Container */}
                <div className="w-full flex flex-col gap-3">
                    <div className="flex justify-between items-end text-selam-cyan/70 font-mono text-xs font-semibold tracking-widest uppercase">
                        <span>Establishing Connection</span>
                        <span>{progress}%</span>
                    </div>
                    
                    {/* The Track */}
                    <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                        {/* The Fill */}
                        <div 
                            className="absolute top-0 left-0 h-full bg-selam-cyan transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,220,255,1)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
