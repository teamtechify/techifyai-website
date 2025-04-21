// 'use client';

// import { useEffect, useRef } from 'react';

// export const HeroCanvas = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     let particlesArray: Particle[] = [];

//     class Particle {
//       x: number;
//       y: number;
//       directionX: number;
//       directionY: number;
//       size: number;
//       color: string;

//       constructor(x: number, y: number, dx: number, dy: number, size: number, color: string) {
//         this.x = x;
//         this.y = y;
//         this.directionX = dx;
//         this.directionY = dy;
//         this.size = size;
//         this.color = color;
//       }

//       draw(ctx: CanvasRenderingContext2D) {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
//         ctx.fillStyle = this.color;
//         ctx.fill();
//       }

//       update(ctx: CanvasRenderingContext2D) {
//         if (this.x + this.size > canvas.width || this.x - this.size < 0) {
//           this.directionX = -this.directionX;
//         }
//         if (this.y + this.size > canvas.height || this.y - this.size < 0) {
//           this.directionY = -this.directionY;
//         }
//         this.x += this.directionX;
//         this.y += this.directionY;
//         this.draw(ctx);
//       }
//     }

//     function init() {
//       particlesArray = [];
//       const numParticles = (canvas.width * canvas.height) / 9000;
//       for (let i = 0; i < numParticles; i++) {
//         const size = Math.random() * 5 + 1;
//         const x = Math.random() * (canvas.width - size * 2);
//         const y = Math.random() * (canvas.height - size * 2);
//         const dx = (Math.random() - 0.5) * 2;
//         const dy = (Math.random() - 0.5) * 2;
//         const color = '#ffffff';
//         particlesArray.push(new Particle(x, y, dx, dy, size, color));
//       }
//     }

//     function connect() {
//       for (let a = 0; a < particlesArray.length; a++) {
//         for (let b = a; b < particlesArray.length; b++) {
//           const dx = particlesArray[a].x - particlesArray[b].x;
//           const dy = particlesArray[a].y - particlesArray[b].y;
//           const distance = dx * dx + dy * dy;

//           if (distance < 10000) {
//             const opacity = 1 - distance / 10000;
//             ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
//             ctx.lineWidth = 1;
//             ctx.beginPath();
//             ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
//             ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
//             ctx.stroke();
//           }
//         }
//       }
//     }

//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particlesArray.forEach((p) => p.update(ctx));
//       connect();
//       requestAnimationFrame(animate);
//     }

//     init();
//     animate();

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       init();
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="w-full h-screen z-0"
//     />
//   );
// };
