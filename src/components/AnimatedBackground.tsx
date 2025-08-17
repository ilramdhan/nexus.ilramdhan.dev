import { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Initialize particles with more variety
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#00ff41' : Math.random() > 0.4 ? '#00d4ff' : '#ff6b35'
      });
    }

    // Dynamic grid with animation
    let gridOffset = 0;
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 60;
      gridOffset += 0.2; // Moving grid effect
      
      // Vertical lines with movement
      for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
        const offsetX = x + (gridOffset % gridSize);
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, canvas.height);
        ctx.globalAlpha = 0.3 + Math.sin(gridOffset * 0.01 + x * 0.001) * 0.2;
        ctx.stroke();
      }
      
      // Horizontal lines with movement
      for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
        const offsetY = y + (gridOffset % gridSize);
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(canvas.width, offsetY);
        ctx.globalAlpha = 0.3 + Math.sin(gridOffset * 0.01 + y * 0.001) * 0.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    // Draw particles
    const drawParticles = () => {
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;
        
        // Pulse opacity
        particle.opacity += Math.sin(Date.now() * 0.002 + particle.x * 0.01) * 0.01;
        particle.opacity = Math.max(0.1, Math.min(0.4, particle.opacity));
      });
    };

    // Advanced particle connections and effects
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            // Dynamic connection colors
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, particles[i].color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
            gradient.addColorStop(1, particles[j].color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = (120 - distance) / 120 * 2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = (120 - distance) / 120 * 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    // Floating data nodes effect
    const drawDataNodes = () => {
      const time = Date.now() * 0.001;
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * 0.1 + Math.sin(time + i) * 100;
        const y = canvas.height * 0.2 + Math.cos(time + i * 0.5) * 50 + i * 100;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
        
        // Pulse rings
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.sin(time * 2 + i) * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 65, ${0.2 - Math.sin(time * 2 + i) * 0.1})`;
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dynamic gradient background
      const time = Date.now() * 0.0005;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time) * 100, 
        canvas.height / 2 + Math.cos(time * 0.7) * 50, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, `rgba(34, 40, 49, ${0.92 + Math.sin(time * 2) * 0.03})`);
      gradient.addColorStop(0.5, 'rgba(24, 30, 39, 0.96)');
      gradient.addColorStop(1, 'rgba(14, 20, 29, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();
      drawConnections();
      drawDataNodes();
      drawParticles();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};