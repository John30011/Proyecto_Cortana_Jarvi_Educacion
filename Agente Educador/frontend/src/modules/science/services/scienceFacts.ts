import { ScienceFact, AgeGroup, ScienceTopic } from '../types';
import { logInfo } from '../../../utils/logger';

// Datos de ejemplo para hechos científicos
const sampleFacts: Record<AgeGroup, ScienceFact[]> = {
  '3-5': [
    {
      id: 'fact-1-3-5',
      title: 'Las mariposas saborean con las patas',
      content: 'Las mariposas tienen papilas gustativas en las patas, lo que les permite saborear las hojas para encontrar las mejores plantas donde poner sus huevos.',
      ageGroup: '3-5',
      topic: 'biology',
      imageUrl: '/images/facts/butterfly.jpg'
    },
    {
      id: 'fact-2-3-5',
      title: 'Los pulpos tienen tres corazones',
      content: 'Los pulpos tienen tres corazones: dos bombean sangre a las branquias y el tercero al resto del cuerpo. ¡Increíble!',
      ageGroup: '3-5',
      topic: 'biology',
      imageUrl: '/images/facts/octopus.jpg'
    }
  ],
  '6-8': [
    {
      id: 'fact-1-6-8',
      title: 'Los relámpagos son más calientes que el Sol',
      content: 'Un rayo puede calentar el aire a su alrededor a más de 30,000°C, ¡eso es más caliente que la superficie del Sol!',
      ageGroup: '6-8',
      topic: 'earth',
      imageUrl: '/images/facts/lightning.jpg'
    },
    {
      id: 'fact-2-6-8',
      title: 'El agua puede existir en tres estados',
      content: 'El agua es única porque puede existir naturalmente en tres estados: sólido (hielo), líquido (agua) y gaseoso (vapor).',
      ageGroup: '6-8',
      topic: 'chemistry'
    }
  ],
  '9-12': [
    {
      id: 'fact-1-9-12',
      title: 'El ADN humano es 99.9% idéntico',
      content: 'Todas las personas comparten aproximadamente el 99.9% de su material genético. ¡Solo el 0.1% nos hace únicos!',
      ageGroup: '9-12',
      topic: 'biology',
      imageUrl: '/images/facts/dna.jpg'
    },
    {
      id: 'fact-2-9-12',
      title: 'El sonido viaja más rápido en el agua',
      content: 'El sonido viaja aproximadamente 4.3 veces más rápido en el agua que en el aire, a unos 1,480 m/s en agua dulce.',
      ageGroup: '9-12',
      topic: 'physics'
    }
  ]
};

/**
 * Obtiene hechos científicos según el grupo de edad
 */
export const getScienceFacts = async (
  ageGroup: AgeGroup,
  topic?: ScienceTopic,
  limit: number = 5
): Promise<ScienceFact[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let facts = [...sampleFacts[ageGroup]];
      
      // Filtrar por tema si se especifica
      if (topic) {
        facts = facts.filter(fact => fact.topic === topic);
      }
      
      // Limitar el número de hechos
      if (limit && limit > 0) {
        facts = facts.slice(0, limit);
      }
      
      // Mezclar los hechos
      facts = shuffleArray(facts);
      
      resolve(facts);
    }, 500);
  });
};

/**
 * Obtiene un hecho aleatorio
 */
export const getRandomFact = async (
  ageGroup?: AgeGroup,
  topic?: ScienceTopic
): Promise<ScienceFact> => {
  return new Promise(async (resolve) => {
    let facts: ScienceFact[] = [];
    
    if (ageGroup) {
      facts = await getScienceFacts(ageGroup, topic);
    } else {
      // Obtener hechos de todos los grupos de edad
      const allFacts = Object.values(sampleFacts).flat();
      facts = topic 
        ? allFacts.filter(fact => fact.topic === topic)
        : allFacts;
    }
    
    // Seleccionar un hecho aleatorio
    const randomIndex = Math.floor(Math.random() * facts.length);
    resolve(facts[randomIndex]);
  });
};

import { shuffleArray } from '../../../utils/array';

/**
 * Obtiene hechos científicos populares
 */
export const getPopularScienceFacts = async (
  limit: number = 3
): Promise<ScienceFact[]> => {
  // En una aplicación real, esto vendría de una API con métricas de popularidad
  const popularFactIds = [
    'fact-1-3-5',  // Mariposas
    'fact-1-6-8',  // Relámpagos
    'fact-1-9-12'  // ADN humano
  ];
  
  // Obtener todos los hechos
  const allFacts = Object.values(sampleFacts).flat();
  
  // Filtrar los hechos populares
  const popularFacts = allFacts.filter(fact => 
    popularFactIds.includes(fact.id)
  );
  
  // Limitar el número de resultados
  return popularFacts.slice(0, limit);
};

/**
 * Marca un hecho como favorito para un usuario
 */
export const saveFavoriteFact = async (
  userId: string,
  factId: string
): Promise<boolean> => {
  // En una aplicación real, esto guardaría en la base de datos
  logInfo(`Usuario ${userId} guardó el hecho ${factId} como favorito`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
