'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

interface Rocket {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  direction: number; // 1 for down, -1 for up
  rotation: number;
}

const RocketAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const animationFrameRef = useRef<number>();
  
  const colors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', 
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
    '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'
  ];

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
    
    // Initialize rockets
    const initRockets = () => {
      const rockets: Rocket[] = [];
      const rocketCount = Math.floor(window.innerWidth / 100); // Adjust density based on screen width
      
      for (let i = 0; i < rocketCount; i++) {
        rockets.push(createRocket());
      }
      
      return rockets;
    };
    
    const createRocket = (): Rocket => {
      const size = Math.random() * 30 + 20; // Size between 20 and 50
      const isLeftSide = Math.random() > 0.5;
      const direction = Math.random() > 0.5 ? 1 : -1; // Random direction (up or down)
      
      // More vibrant colors
      const hue = Math.floor(Math.random() * 360);
      const saturation = 70 + Math.random() * 30; // 70-100%
      const lightness = 40 + Math.random() * 30; // 40-70%
      
      return {
        x: Math.random() * window.innerWidth, // Start at random x position
        y: direction > 0 ? -size : window.innerHeight + size, // Start above or below viewport
        size,
        speed: Math.random() * 3 + 2, // Faster movement
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        direction,
        rotation: 0 // No rotation for emoji
      };
    };
    
    rocketsRef.current = initRockets();
    
    // Draw rocket with emoji
    const drawRocket = (rocket: Rocket) => {
      if (!ctx) return;
      
      const { x, y, size, color } = rocket;
      
      // Draw rocket emoji
      ctx.save();
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add a subtle shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw the rocket emoji
      ctx.fillText('🚀', x, y);
      
      // Add a small trail
      const trailLength = size * 0.8;
      const gradient = ctx.createLinearGradient(x, y + size/2, x, y + size/2 + trailLength);
      gradient.addColorStop(0, `rgba(255, 0, 0, 0.5)`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x - size/4, y + size/2, size/2, trailLength);
      
      ctx.restore();
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw rockets
      rocketsRef.current.forEach((rocket, index) => {
        // Update position
        rocket.y += rocket.speed * rocket.direction;
        rocket.rotation += (Math.random() - 0.5) * 2;
        
        // Reset rocket if it goes off screen
        if (
          (rocket.direction === 1 && rocket.y > canvas.height + rocket.size * 2) ||
          (rocket.direction === -1 && rocket.y < -rocket.size * 2)
        ) {
          rocketsRef.current[index] = createRocket();
          // Ensure new rocket starts from the correct edge
          rocketsRef.current[index].y = 
            rocket.direction === 1 
              ? -rocket.size 
              : canvas.height + rocket.size;
        }
        
        // Draw rocket
        drawRocket(rocket);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      pointerEvents="none"
      style={{
        backgroundColor: 'white',
        opacity: 0.9
      }}
    />
  );
};

export default RocketAnimation;
