import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CanvasSequenceProps {
    folder: string;
    frameCount: number;
    id?: string;
    children?: React.ReactNode;
    end?: string;
    scrub?: number | boolean;
    sequenceEndRatio?: number;
    sequenceStartRatio?: number;
    additionalTlCallback?: (tl: gsap.core.Timeline) => void;
}

export function CanvasSequence({
    folder,
    frameCount,
    id,
    children,
    end = '+=200%',
    scrub = 0.5,
    sequenceEndRatio = 1,
    sequenceStartRatio = 0,
    additionalTlCallback,
}: CanvasSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        const container = containerRef.current;

        if (!canvas || !context || !container) return;

        const frames: HTMLImageElement[] = [];
        const animation = { frame: 0 };

        const render = (index: number) => {
            if (!frames[index] || !frames[index].complete) return;
            const img = frames[index];

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        // Preload images
        let loadedCount = 0;
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const indexStr = i.toString().padStart(3, '0');
            img.src = `/${folder}/ezgif-frame-${indexStr}.webp`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) {
                    setTimeout(() => {
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                        render(0);
                    }, 0);
                }
            };
            frames.push(img);
        }

        let mainTlRef: { current: gsap.core.Timeline | null } = { current: null };

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                id: 'mainTimeline',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: end,
                    scrub: scrub,
                    pin: true,
                }
            });

            // Leading dead time — canvas frozen on frame 0 while transition plays
            if (sequenceStartRatio > 0) {
                tl.to({}, { duration: sequenceStartRatio });
            }

            // The frames animate over a fraction of the total pin distance
            tl.to(animation, {
                frame: frameCount - 1,
                snap: 'frame',
                ease: 'none',
                duration: sequenceEndRatio,
                onUpdate: () => render(Math.round(animation.frame))
            });

            // If sequenceEndRatio is less than 1, add dead space at the end 
            // so the section stays pinned while the frame stays on the last one.
            if (sequenceEndRatio < 1) {
                tl.to({}, { duration: 1 - sequenceEndRatio - sequenceStartRatio });
            }

            mainTlRef.current = tl;
        });

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(Math.round(animation.frame));
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Subtle parallax effect on the canvas based on mouse position
            if (window.scrollY > window.innerHeight) return; // Only apply when at top

            const xPos = (e.clientX / window.innerWidth - 0.5) * 20; // -10px to 10px
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20; // -10px to 10px

            gsap.to(canvas, {
                x: xPos,
                y: yPos,
                rotationX: -yPos * 0.1,
                ease: "power2.out",
                duration: 1
            });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        // Allow parent to inject custom animations
        if (additionalTlCallback && mainTlRef.current) {
            additionalTlCallback(mainTlRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };
    }, [folder, frameCount, end, scrub, sequenceEndRatio, sequenceStartRatio, additionalTlCallback]);

    return (
        <div id={id} ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] perspective-[1000px]">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-[105%] h-[105%] -left-[2.5%] -top-[2.5%] object-cover z-10 origin-center"
            />
            <div className="absolute inset-0 z-20">
                {children}
            </div>
        </div>
    );
}
