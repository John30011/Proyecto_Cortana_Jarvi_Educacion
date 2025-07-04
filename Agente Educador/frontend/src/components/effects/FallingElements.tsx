import { useEffect, useRef, useCallback } from 'react';

interface Element {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  type: 'circle' | 'square' | 'star' | 'triangle';
  rotation: number;
  rotationSpeed: number;
}

const FallingElements = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const elements = useRef<Element[]>([]);
  const lastTime = useRef<number>(0);
  const frameCount = useRef<number>(0);

  // Colores suaves para los elementos
  const colors = [
    '#FF9AA2', // Rosa claro
    '#FFB7B2', // Melocotón claro
    '#FFDAC1', // Melón claro
    '#E2F0CB', // Verde menta claro
    '#B5EAD7', // Verde agua claro
    '#C7CEEA', // Lila claro
    '#F8B195', // Salmón claro
    '#F67280', // Rosa
    '#C06C84', // Rosa oscuro
    '#6C5B7B', // Púrpura
  ];

  // Tipos de elementos
  const types: ('circle' | 'square' | 'star' | 'triangle')[] = ['circle', 'square', 'star', 'triangle'];

  // Crear un nuevo elemento
  const createElement = useCallback((): Element => {
    const windowWidth = window.innerWidth;
    const size = Math.random() * 15 + 5; // Tamaño entre 5 y 20
    const speed = Math.random() * 1.5 + 0.5; // Velocidad entre 0.5 y 2
    const color = colors[Math.floor(Math.random() * colors.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      x: Math.random() * windowWidth,
      y: -size * 2, // Empezar un poco más arriba del borde superior
      size,
      speed,
      color,
      type,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2, // Velocidad de rotación aleatoria
    };
  }, [colors]);

  // Inicializar elementos
  const initElements = useCallback(() => {
    const count = Math.floor(window.innerWidth / 30); // Ajustar cantidad según el ancho de la pantalla
    elements.current = Array(count).fill(null).map(() => createElement());
  }, [createElement]);

  // Dibujar un elemento en el canvas
  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: Element) => {
    const { x, y, size, color, type, rotation } = element;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    switch (type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        break;
        
      case 'square':
        ctx.fillStyle = color;
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
        
      case 'star':
        drawStar(ctx, 0, 0, 5, size / 2, size / 4, color);
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }, []);

  // Función auxiliar para dibujar estrellas
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  // Bucle de animación
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configuración del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar elementos
    elements.current = elements.current.map(element => {
      // Actualizar posición
      const newY = element.y + element.speed;
      const newRotation = element.rotation + element.rotationSpeed;
      
      // Si el elemento sale de la pantalla, reiniciarlo en la parte superior
      if (newY > canvas.height + element.size * 2) {
        return createElement();
      }
      
      // Dibujar el elemento
      drawElement(ctx, { ...element, y: newY, rotation: newRotation });
      
      return { ...element, y: newY, rotation: newRotation };
    });
    
    // Control de FPS
    frameCount.current++;
    if (timestamp - lastTime.current >= 1000) {
      lastTime.current = timestamp;
      frameCount.current = 0;
    }
    
    // Siguiente frame
    animationRef.current = requestAnimationFrame(animate);
  }, [createElement, drawElement]);

  // Efecto para inicializar y limpiar la animación
  useEffect(() => {
    // Inicializar elementos
    initElements();
    
    // Iniciar animación
    animationRef.current = requestAnimationFrame(animate);
    
    // Manejar redimensionamiento
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        initElements();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Limpieza
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, initElements]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
};

export default FallingElements;
