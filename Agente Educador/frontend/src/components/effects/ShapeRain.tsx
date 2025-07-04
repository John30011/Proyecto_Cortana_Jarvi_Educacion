import { useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

type Shape = 'circle' | 'square' | 'triangle' | 'diamond';

interface ShapeItem {
  id: number;
  type: Shape;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  rotation: number;
  opacity: number;
}

const colors = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
  '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
  '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'
];

const getRandomShape = (): Shape => {
  const shapes: Shape[] = ['circle', 'square', 'triangle', 'diamond'];
  return shapes[Math.floor(Math.random() * shapes.length)];
};

const ShapeRain = () => {
  const [shapes, setShapes] = useState<ShapeItem[]>([]);
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const createShape = useCallback((id: number): ShapeItem => ({
    id,
    type: getRandomShape(),
    x: Math.random() * dimensions.width,
    y: -50,
    size: 10 + Math.random() * 20,
    speed: 1 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    opacity: 0.3 + Math.random() * 0.7,
  }), [dimensions.width]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prev) => {
        // Add new shape
        if (Math.random() > 0.8) {
          const newShape = createShape(Date.now() + Math.random());
          
          // Update existing shapes
          const updatedShapes = prev
            .map((shape) => ({
              ...shape,
              y: shape.y + shape.speed,
              rotation: shape.rotation + (Math.random() * 2 - 1),
            }))
            .filter((shape) => shape.y < dimensions.height + 100);

          return [...updatedShapes, newShape].slice(-100);
        }
        
        // Only update existing shapes if no new one is added
        return prev
          .map((shape) => ({
            ...shape,
            y: shape.y + shape.speed,
            rotation: shape.rotation + (Math.random() * 2 - 1),
          }))
          .filter((shape) => shape.y < dimensions.height + 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [createShape, dimensions.height]);

  const renderShape = (shape: ShapeItem) => {
    const style = {
      position: 'absolute' as const,
      left: `${shape.x}px`,
      top: `${shape.y}px`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      backgroundColor: shape.color,
      opacity: shape.opacity,
      transform: `rotate(${shape.rotation}deg)`,
      pointerEvents: 'none' as const,
    };

    switch (shape.type) {
      case 'circle':
        return <Box {...style} borderRadius="50%" />;
      case 'square':
        return <Box {...style} />;
      case 'triangle':
        return (
          <Box
            {...style}
            width="0"
            height="0"
            backgroundColor="transparent"
            borderLeft={`${shape.size / 2}px solid transparent`}
            borderRight={`${shape.size / 2}px solid transparent`}
            borderBottom={`${shape.size}px solid ${shape.color}`}
          />
        );
      case 'diamond':
        return (
          <Box
            {...style}
            width={shape.size}
            height={shape.size}
            transform={`rotate(45deg) rotate(${shape.rotation}deg)`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      pointerEvents="none"
      overflow="hidden"
    >
      {shapes.map((shape) => (
        <Box key={shape.id}>
          {renderShape(shape)}
        </Box>
      ))}
    </Box>
  );
};

export default ShapeRain;
