import { useEffect, useRef } from 'react';

interface StarfieldProps {
    className?: string;
    numStars?: number;
    maxStarSize?: number;
}

type ShootingStarType = 'comet' | 'blue-rock' | 'standard';

export function Starfield({ className = '', numStars = 150, maxStarSize = 2.0 }: StarfieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeObserver = new ResizeObserver(() => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            initStars(rect.width, rect.height);
        });

        resizeObserver.observe(canvas.parentElement || document.body);

        let stars: Array<{ x: number, y: number, radius: number, alpha: number, targetAlpha: number, speed: number }> = [];

        // --- Shooting Star Configuration ---
        let shootingStar: {
            x: number, y: number, length: number, speed: number, angle: number,
            active: boolean, opacity: number, type: ShootingStarType, headSize: number
        } = {
            x: 0, y: 0, length: 0, speed: 0, angle: 0, active: false, opacity: 0, type: 'standard', headSize: 2
        };

        let timeSinceLastShootingStar = 0;

        const initStars = (width: number, height: number) => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    // Use maxStarSize prop
                    radius: Math.random() * maxStarSize + 0.5,
                    alpha: Math.random(),
                    targetAlpha: Math.random(),
                    speed: 0.01 + Math.random() * 0.03
                });
            }
        };

        const spawnShootingStar = (width: number, height: number, timeDelta: number) => {
            timeSinceLastShootingStar += timeDelta;

            // Wait at least 3-6 seconds between shooting stars (creating a gap)
            if (timeSinceLastShootingStar < 3000 + Math.random() * 3000) return;

            // Small random chance per frame so they don't look rhythmic
            if (Math.random() > 0.05) return;

            if (shootingStar.active) return;

            timeSinceLastShootingStar = 0;

            // Pick a type
            const typeRoll = Math.random();
            let type: ShootingStarType = 'standard';
            if (typeRoll > 0.6) type = 'comet';        // Fire rock
            else if (typeRoll > 0.3) type = 'blue-rock'; // Blue rock

            // Pick a spawn edge (0=top, 1=right, 2=bottom, 3=left)
            const edge = Math.floor(Math.random() * 4);
            let startX = 0, startY = 0, angle = 0;

            // Angle should point somewhat towards the opposite side for a full screen traverse
            if (edge === 0) { // Top
                startX = Math.random() * width;
                startY = -100;
                angle = Math.PI / 2 + (Math.random() * 0.5 - 0.25); // Downwards roughly
            } else if (edge === 1) { // Right
                startX = width + 100;
                startY = Math.random() * height;
                angle = Math.PI + (Math.random() * 0.5 - 0.25); // Leftwards roughly
            } else if (edge === 2) { // Bottom
                startX = Math.random() * width;
                startY = height + 100;
                angle = -Math.PI / 2 + (Math.random() * 0.5 - 0.25); // Upwards roughly
            } else { // Left
                startX = -100;
                startY = Math.random() * height;
                angle = (Math.random() * 0.5 - 0.25); // Rightwards roughly
            }

            shootingStar = {
                active: true,
                x: startX,
                y: startY,
                length: type === 'comet' ? 200 + Math.random() * 200 : 100 + Math.random() * 150,
                speed: type === 'comet' ? 12 + Math.random() * 5 : 18 + Math.random() * 10,
                angle: angle,
                opacity: 1,
                type: type,
                headSize: type === 'comet' ? 4 : (type === 'blue-rock' ? 3 : 2)
            };
        };

        let lastTime = performance.now();

        const render = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            ctx.clearRect(0, 0, width, height);

            // Render twinkling stars
            stars.forEach(star => {
                star.alpha += (star.targetAlpha - star.alpha) * star.speed;
                if (Math.abs(star.alpha - star.targetAlpha) < 0.05) {
                    star.targetAlpha = Math.random();
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.9})`;
                ctx.fill();
            });

            // Render shooting star
            if (shootingStar.active) {
                shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
                shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
                shootingStar.opacity -= 0.005; // Fade out gradually

                const isOffScreen =
                    shootingStar.x < -shootingStar.length * 2 ||
                    shootingStar.x > width + shootingStar.length * 2 ||
                    shootingStar.y < -shootingStar.length * 2 ||
                    shootingStar.y > height + shootingStar.length * 2;

                if (shootingStar.opacity <= 0 || isOffScreen) {
                    shootingStar.active = false;
                } else {
                    ctx.save();
                    ctx.translate(shootingStar.x, shootingStar.y);
                    ctx.rotate(shootingStar.angle);

                    let headColor = `rgba(255, 255, 255, ${shootingStar.opacity})`;
                    let tailColorStart = `rgba(255, 255, 255, ${shootingStar.opacity})`;
                    let glowColor = 'rgba(255,255,255,0.5)';

                    if (shootingStar.type === 'comet') {
                        headColor = `rgba(255, 120, 50, ${shootingStar.opacity})`;
                        tailColorStart = `rgba(255, 50, 0, ${shootingStar.opacity * 0.8})`;
                        glowColor = 'rgba(255, 100, 0, 0.8)';
                    } else if (shootingStar.type === 'blue-rock') {
                        headColor = `rgba(100, 200, 255, ${shootingStar.opacity})`;
                        tailColorStart = `rgba(0, 150, 255, ${shootingStar.opacity * 0.8})`;
                        glowColor = 'rgba(0, 150, 255, 0.8)';
                    }

                    ctx.shadowBlur = shootingStar.type === 'standard' ? 5 : 15;
                    ctx.shadowColor = glowColor;

                    // Trail (pointing left while traveling right along rotated X access)
                    const gradient = ctx.createLinearGradient(0, 0, -shootingStar.length, 0);
                    gradient.addColorStop(0, tailColorStart);
                    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-shootingStar.length, 0);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = shootingStar.headSize * 0.8;
                    ctx.stroke();

                    // Head 
                    ctx.beginPath();
                    ctx.arc(0, 0, shootingStar.headSize, 0, Math.PI * 2);
                    ctx.fillStyle = headColor;
                    ctx.fill();

                    ctx.restore();
                }
            } else {
                spawnShootingStar(width, height, delta);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`block w-full h-full pointer-events-none ${className}`}
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
