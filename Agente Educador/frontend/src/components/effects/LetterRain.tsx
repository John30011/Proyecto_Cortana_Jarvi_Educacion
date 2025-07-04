import { useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface Letter {
  id: number;
  char: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  size: number;
  opacity: number;
  isExploding: boolean;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const colors = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
  '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
  '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40'
];

const explosion = keyframes({
  '0%': { 
    transform: 'scale(1)', 
    opacity: 1 
  },
  '50%': { 
    transform: 'scale(1.5)', 
    opacity: 0.8 
  },
  '100%': { 
    transform: 'scale(0.1)', 
    opacity: 0 
  }
});

const LetterRain = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const createLetter = useCallback((id: number): Letter => ({
    id,
    char: alphabet[Math.floor(Math.random() * alphabet.length)],
    x: Math.random() * dimensions.width,
    y: -20,
    speed: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 14 + Math.random() * 8,
    opacity: 0.8 + Math.random() * 0.2,
    isExploding: false,
  }), [dimensions.width]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLetters((prev) => {
        // Add new letter
        if (Math.random() > 0.7) { // Controla la frecuencia de aparición
          const newLetter = createLetter(Date.now() + Math.random());
          
          // Update existing letters
          const updatedLetters = prev
            .map((letter) => ({
              ...letter,
              y: letter.y + letter.speed,
            }))
            .filter((letter) => letter.y < dimensions.height + 50 && !letter.isExploding);

          return [...updatedLetters, newLetter].slice(-150); // Limita a 150 letras
        }
        
        // Solo actualiza las letras existentes si no se agrega una nueva
        return prev
          .map((letter) => ({
            ...letter,
            y: letter.y + letter.speed,
          }))
          .filter((letter) => letter.y < dimensions.height + 50 && !letter.isExploding);
      });
    }, 50); // Aumenta la fluidez reduciendo el intervalo

    return () => clearInterval(interval);
  }, [createLetter, dimensions.height]);

  const handleLetterClick = (id: number) => {
    setLetters(prev => 
      prev.map(letter => 
        letter.id === id 
          ? { ...letter, isExploding: true }
          : letter
      )
    );
    
    // Eliminar la letra después de la animación
    setTimeout(() => {
      setLetters(prev => prev.filter(letter => letter.id !== id));
    }, 500);
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
      {letters.map((letter) => (
        <Box
          key={letter.id}
          position="absolute"
          left={`${letter.x}px`}
          top={`${letter.y}px`}
          color={letter.color}
          fontSize={`${letter.size}px`}
          fontWeight="bold"
          cursor="pointer"
          userSelect="none"
          opacity={letter.opacity}
          zIndex={1}
          pointerEvents="auto"
          onClick={() => handleLetterClick(letter.id)}
          sx={{
            transform: 'translateY(0)',
            transition: 'all 0.1s ease-out',
            '&:hover': {
              transform: 'scale(1.3)',
              opacity: 1,
              transition: 'all 0.2s ease-out',
              zIndex: 2
            },
            ...(letter.isExploding && {
              animation: `${explosion} 0.5s ease-out forwards`,
              zIndex: 3
            })
          }}
        >
          {letter.char}
        </Box>
      ))}
    </Box>
  );
};

export default LetterRain;
