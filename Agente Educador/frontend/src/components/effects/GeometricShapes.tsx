import { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  'rgba(66, 153, 225, 0.5)',  // azul
  'rgba(49, 151, 149, 0.5)',  // teal
  'rgba(159, 122, 234, 0.5)', // morado
  'rgba(236, 201, 75, 0.5)',  // amarillo
  'rgba(237, 137, 54, 0.5)',  // naranja
  'rgba(224, 33, 138, 0.5)'   // rosa
];

export const GeometricShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const nextId = useRef(0);
  const lastSpawnTime = useRef(0);
  const containerSize = useRef({ width: 0, height: 0 });

  const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  const spawnShape = () => {
    if (!containerRef.current) return;
    
    const { width, height } = containerSize.current;
    const size = getRandomNumber(15, 60); // Figuras un poco más pequeñas
    const type = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle';
    
    // Posición inicial aleatoria en los bordes
    let x, y;
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    
    if (side === 0) { // top
      x = Math.random() * width;
      y = -size;
    } else if (side === 1) { // right
      x = width + size;
      y = Math.random() * height;
    } else if (side === 2) { // bottom
      x = Math.random() * width;
      y = height + size;
    } else { // left
      x = -size;
      y = Math.random() * height;
    }
    
    // Velocidad más rápida y dirección más aleatoria
    const centerX = width / 2 + (Math.random() - 0.5) * width * 0.5;
    const centerY = height / 2 + (Math.random() - 0.5) * height * 0.5;
    const angle = Math.atan2(centerY - y, centerX - x) + (Math.random() - 0.5) * 0.8;
    const speed = getRandomNumber(1.5, 3.5); // Aumentar la velocidad
    
    const newShape: Shape = {
      id: nextId.current++,
      type,
      x,
      y,
      size,
      color: getRandomColor(),
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      rotationSpeed: getRandomNumber(-3, 3) // Rotación más rápida
    };
    
    setShapes(prev => [...prev, newShape]);
  };

  const updateShapes = () => {
    const { width, height } = containerSize.current;
    
    setShapes(prev => 
      prev
        .map(shape => {
          // Actualizar posición
          let newX = shape.x + shape.speedX;
          let newY = shape.y + shape.speedY;
          let newSpeedX = shape.speedX;
          let newSpeedY = shape.speedY;
          
          // Rebotar en los bordes con menos desaceleración
          if (newX < -shape.size * 2 || newX > width + shape.size * 2) {
            newSpeedX *= -0.9; // Menos pérdida de velocidad al rebotar
            newX = Math.max(-shape.size * 1.5, Math.min(width + shape.size * 1.5, newX));
          }
          
          if (newY < -shape.size * 2 || newY > height + shape.size * 2) {
            newSpeedY *= -0.9; // Menos pérdida de velocidad al rebotar
            newY = Math.max(-shape.size * 1.5, Math.min(height + shape.size * 1.5, newY));
          }
          
          return {
            ...shape,
            x: newX,
            y: newY,
            speedX: newSpeedX * 0.99, // Ligera desaceleración
            speedY: newSpeedY * 0.99,
            rotation: shape.rotation + shape.rotationSpeed
          };
        })
        .filter(shape => {
          // Mantener las formas que están dentro de un rango razonable
          return (
            shape.x > -shape.size * 3 && 
            shape.x < width + shape.size * 3 && 
            shape.y > -shape.size * 3 && 
            shape.y < height + shape.size * 3
          );
        })
    );

    // Generar más formas más frecuentemente
    const now = Date.now();
    if (now - lastSpawnTime.current > 300) { // Nueva forma cada 300ms
      // Crear 2-3 formas a la vez
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawnShape(), i * 50);
      }
      lastSpawnTime.current = now;
    }

    animationRef.current = requestAnimationFrame(updateShapes);
  };

  useEffect(() => {
    // Actualizar tamaño del contenedor
    const updateSize = () => {
      if (containerRef.current) {
        containerSize.current = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        };
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Iniciar con más formas
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnShape, i * 100);
    }
    
    // Iniciar la animación
    animationRef.current = requestAnimationFrame(updateShapes);
    
    // Limpiar al desmontar
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderShape = (shape: Shape) => {
    const style = {
      position: 'absolute' as const,
      left: `${shape.x}px`,
      top: `${shape.y}px`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      backgroundColor: shape.color,
      transform: `rotate(${shape.rotation}deg)`,
      opacity: 0.7,
      transition: 'all 0.5s ease-out',
      pointerEvents: 'none' as const,
      zIndex: 0,
      borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'triangle' ? '50% 50% 0 0' : '4px',
      clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
    };
    
    return <Box key={shape.id} sx={style} />;
  };

  return (
    <Box
      ref={containerRef}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      overflow="hidden"
      zIndex={0}
      pointerEvents="none"
    >
      {shapes.map(renderShape)}
    </Box>
  );
};

export default GeometricShapes;
