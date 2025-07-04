// Tipos para las actividades
export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  duration: string;
  category: string;
  subTopics?: Array<{
    icon: React.ReactNode;
    name: string;
  }>;
}

// Datos de las actividades educativas
export const activities: Activity[] = [
  {
    id: 'aprende-con-cortana',
    title: 'Aprende con Cortana',
    description: '¡Descubre cosas nuevas con tu asistente de aprendizaje!',
    icon: '🤖',
    color: 'blue.400',
    path: '/app/learn/cortana',
    difficulty: 'Fácil',
    duration: '15 min',
    category: 'General'
  },
  {
    id: 'matematicas-basicas',
    title: 'Jugando con las Matemáticas',
    description: 'Suma, resta y diviértete con los números',
    icon: '➕',
    color: 'green.400',
    path: '/cursos/curso/matematicas-basicas',
    difficulty: 'Fácil',
    duration: '20 min',
    category: 'Matemáticas'
  },
  {
    id: 'sistema-solar',
    title: 'Nuestro Sistema Solar',
    description: 'Explora los planetas y las estrellas',
    icon: '🪐',
    color: 'purple.400',
    path: '/cursos/curso/sistema-solar',
    difficulty: 'Intermedio',
    duration: '25 min',
    category: 'Ciencias'
  },
  {
    id: 'astronomos',
    title: 'Grandes Astrónomos',
    description: 'Conoce a los científicos que estudiaron el espacio',
    icon: '🔭',
    color: 'yellow.400',
    path: '/cursos/curso/astronomos',
    difficulty: 'Intermedio',
    duration: '20 min',
    category: 'Ciencias'
  },
  {
    id: 'tecnologia',
    title: 'Tecnología para Niños',
    description: 'Descubre cómo funcionan las computadoras y robots',
    icon: '💻',
    color: 'pink.400',
    path: '/cursos/curso/tecnologia',
    difficulty: 'Intermedio',
    duration: '30 min',
    category: 'Tecnología'
  },
  {
    id: 'arte',
    title: 'Jugando a ser Artista',
    description: 'Pinta, dibuja y crea obras maestras',
    icon: '🎨',
    color: 'red.400',
    path: '/cursos/curso/arte',
    difficulty: 'Fácil',
    duration: '40 min',
    category: 'Arte'
  },
  {
    id: 'musica',
    title: 'Explorando la Música',
    description: 'Aprende notas, ritmos y toca instrumentos virtuales',
    icon: '🎵',
    color: 'teal.400',
    path: '/cursos/curso/musica',
    difficulty: 'Fácil',
    duration: '25 min',
    category: 'Música'
  },
  {
    id: 'emociones',
    title: 'Mis Emociones',
    description: 'Aprende a identificar y expresar lo que sientes',
    icon: '😊',
    color: 'orange.400',
    path: '/cursos/curso/emociones',
    difficulty: 'Fácil',
    duration: '20 min',
    category: 'Desarrollo Personal'
  },
  {
    id: 'deportes',
    title: 'Deportes y Salud',
    description: 'Ejercicios divertidos para mantenerte activo',
    icon: '⚽',
    color: 'green.500',
    path: '/cursos/curso/deportes',
    difficulty: 'Fácil',
    duration: '30 min',
    category: 'Deportes'
  },
  {
    id: 'astronomia-ninos',
    title: 'Astronomía para Niños',
    description: 'El universo explicado de manera divertida',
    icon: '🌌',
    color: 'blue.500',
    path: '/cursos/curso/astronomia-ninos',
    difficulty: 'Intermedio',
    duration: '35 min',
    category: 'Ciencias'
  },
  {
    id: 'cuerpo-humano',
    title: 'Descubriendo el Cuerpo Humano',
    description: 'Aprende sobre tus órganos y cómo funcionan',
    icon: '👤',
    color: 'red.500',
    path: '/cursos/curso/cuerpo-humano',
    difficulty: 'Intermedio',
    duration: '30 min',
    category: 'Ciencias',
    subTopics: [
      { icon: '👃', name: 'Sistema Respiratorio' },
      { icon: '❤️', name: 'Sistema Circulatorio' },
      { icon: '🧠', name: 'Sistema Nervioso' }
    ]
  },
  {
    id: 'naturaleza',
    title: 'Naturaleza Mágica',
    description: 'Animales, plantas y los elementos de la naturaleza',
    icon: '🌿',
    color: 'green.600',
    path: '/cursos/curso/naturaleza',
    difficulty: 'Fácil',
    duration: '40 min',
    category: 'Ciencias',
    subTopics: [
      { icon: '💧', name: 'El Agua' },
      { icon: '🔥', name: 'El Fuego' },
      { icon: '🌿', name: 'Flora y Fauna' }
    ]
  }
];

// Obtener todas las actividades
export const getAllActivities = () => {
  return activities;
};

// Obtener actividades por categoría
export const getActivitiesByCategory = (category: string) => {
  return activities.filter(activity => activity.category === category);
};

// Obtener actividad por ID
export const getActivityById = (id: string) => {
  return activities.find(activity => activity.id === id);
};

// Obtener categorías únicas
export const getUniqueCategories = () => {
  const categories = new Set(activities.map(activity => activity.category));
  return Array.from(categories);
};
