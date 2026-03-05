import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CanvasSequenceProps {
    folder: string;
    frameCount: number;
    id?: string;
    children?: React.ReactNode;
}

export function CanvasSequence({ folder, frameCount, id, children }: CanvasSequenceProps) {
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
                    // Add a small delay for correct layout calculations before first draw
                    setTimeout(() => {
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                        render(0);
                    }, 0);
                }
            };
            frames.push(img);
        }

        // Wait for the next tick to ensure DOM is ready
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=400%', // Gives plenty of scroll space (pin duration)
                    scrub: 0.5,
                    pin: true,
                }
            });

            tl.to(animation, {
                frame: frameCount - 1,
                snap: 'frame',
                ease: 'none',
                onUpdate: () => render(Math.round(animation.frame))
            });
        });

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(Math.round(animation.frame));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            ctx.revert();
        };
    }, [folder, frameCount]);

    return (
        <div id={id} ref={containerRef} className="relative w-full h-screen overflow-hidden bg-selam-dark">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Absolute positioning wrapper for children so they sit on top of the pinned canvas */}
            <div className="absolute inset-0 z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
