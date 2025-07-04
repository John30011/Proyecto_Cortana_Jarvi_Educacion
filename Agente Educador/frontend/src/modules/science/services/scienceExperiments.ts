import { ScienceExperiment, AgeGroup, ScienceTopic } from '../types';
import { logInfo } from '../../../utils/logger';

// Datos de ejemplo para experimentos científicos
const sampleExperiments: Record<AgeGroup, ScienceExperiment[]> = {
  '3-5': [
    {
      id: 'exp-1',
      title: 'Volcán de Colores',
      description: 'Crea un volcán en miniatura que hace erupción con colores.',
      materials: [
        'Bicarbonato de sodio',
        'Vinagre',
        'Colorante alimenticio',
        'Botella de plástico pequeña',
        'Arcilla o plastilina'
      ],
      steps: [
        'Forma un volcán alrededor de la botella con la arcilla.',
        'Añade 2 cucharadas de bicarbonato en la botella.',
        'Añade unas gotas de colorante alimenticio.',
        'Vierte vinagre lentamente y observa la erupción.'
      ],
      safetyNotes: [
        'Realizar bajo supervisión de un adulto.',
        'Usar ropa que se pueda manchar.'
      ],
      ageGroup: '3-5',
      topic: 'chemistry',
      duration: 15,
      difficulty: 'easy',
      imageUrl: '/images/experiments/volcano.jpg'
    }
  ],
  '6-8': [
    {
      id: 'exp-2',
      title: 'Circuito Eléctrico Simple',
      description: 'Crea un circuito eléctrico básico con una pila y una bombilla.',
      materials: [
        'Pila de 9V',
        'Bombilla pequeña',
        'Cables con pinzas cocodrilo',
        'Cinta aislante'
      ],
      steps: [
        'Conecta un cable al polo positivo de la pila.',
        'Conecta el otro extremo a un lado de la bombilla.',
        'Conecta otro cable del otro lado de la bombilla al polo negativo.',
        'Observa cómo se enciende la bombilla.'
      ],
      safetyNotes: [
        'No tocar los cables pelados cuando el circuito esté conectado.',
        'No cortocircuitar la pila.'
      ],
      ageGroup: '6-8',
      topic: 'physics',
      duration: 20,
      difficulty: 'medium',
      imageUrl: '/images/experiments/circuit.jpg'
    }
  ],
  '9-12': [
    {
      id: 'exp-3',
      title: 'Extracción de ADN de una Fruta',
      description: 'Extrae el ADN de una fresa de forma sencilla.',
      materials: [
        'Fresas maduras',
        'Bolsa de plástico con cierre',
        'Agua',
        'Sal',
        'Jabón líquido para platos',
        'Alcohol frío',
        'Filtro de café',
        'Vaso transparente'
      ],
      steps: [
        'Machaca las fresas en una bolsa con un poco de agua y una pizca de sal.',
        'Añade una cucharada de jabón líquido y mezcla suavemente.',
        'Filtra la mezcla con un colador o filtro de café.',
        'Vierte el líquido filtrado en un vaso y añade alcohol frío por las paredes.',
        'Observa cómo se forma el ADN como una sustancia blanca y fibrosa.'
      ],
      safetyNotes: [
        'Usar guantes y gafas de protección.',
        'No ingerir ninguna de las sustancias.',
        'Realizar bajo supervisión de un adulto.'
      ],
      ageGroup: '9-12',
      topic: 'biology',
      duration: 30,
      difficulty: 'hard',
      imageUrl: '/images/experiments/dna.jpg'
    }
  ]
};

/**
 * Obtiene experimentos científicos según el grupo de edad
 */
export const getScienceExperiments = async (ageGroup: AgeGroup): Promise<ScienceExperiment[]> => {
  // Simulamos una llamada a la API con un retraso
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...sampleExperiments[ageGroup]]);
    }, 500);
  });
};

/**
 * Obtiene un experimento por su ID
 */
export const getExperimentById = async (id: string): Promise<ScienceExperiment | undefined> => {
  // Buscamos en todos los grupos de edad
  const allExperiments = Object.values(sampleExperiments).flat();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allExperiments.find(exp => exp.id === id));
    }, 300);
  });
};

/**
 * Obtiene experimentos por tema
 */
export const getExperimentsByTopic = async (
  topic: ScienceTopic, 
  ageGroup?: AgeGroup
): Promise<ScienceExperiment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let experiments: ScienceExperiment[] = [];
      
      if (ageGroup) {
        experiments = sampleExperiments[ageGroup].filter(exp => exp.topic === topic);
      } else {
        experiments = Object.values(sampleExperiments)
          .flat()
          .filter(exp => exp.topic === topic);
      }
      
      resolve(experiments);
    }, 500);
  });
};

/**
 * Obtiene experimentos por nivel de dificultad
 */
export const getExperimentsByDifficulty = async (
  difficulty: 'easy' | 'medium' | 'hard',
  ageGroup?: AgeGroup
): Promise<ScienceExperiment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let experiments: ScienceExperiment[] = [];
      
      if (ageGroup) {
        experiments = sampleExperiments[ageGroup].filter(exp => exp.difficulty === difficulty);
      } else {
        experiments = Object.values(sampleExperiments)
          .flat()
          .filter(exp => exp.difficulty === difficulty);
      }
      
      resolve(experiments);
    }, 500);
  });
};

/**
 * Guarda el progreso de un experimento completado
 */
export const saveExperimentProgress = async (
  userId: string, 
  experimentId: string,
  notes?: string
): Promise<boolean> => {
  // En una aplicación real, esto guardaría en la base de datos
  logInfo(`Guardando progreso para el usuario ${userId}: experimento ${experimentId} completado`);
  if (notes) {
    logInfo(`Notas: ${notes}`);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 800);
  });
};
