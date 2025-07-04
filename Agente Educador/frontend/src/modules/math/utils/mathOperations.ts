/**
 * Genera un número aleatorio entre min y max (ambos inclusive)
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Genera una pregunta de suma aleatoria
 */
export const generateAdditionQuestion = (max: number = 20) => {
  const a = getRandomNumber(1, max);
  const b = getRandomNumber(1, max);
  return {
    question: `¿Cuánto es ${a} + ${b}?`,
    answer: a + b,
    options: generateOptions(a + b, 4, max * 2)
  };
};

/**
 * Genera una pregunta de resta aleatoria (asegura que el resultado no sea negativo)
 */
export const generateSubtractionQuestion = (max: number = 20) => {
  const a = getRandomNumber(1, max);
  const b = getRandomNumber(1, a); // Asegura que a >= b
  return {
    question: `¿Cuánto es ${a} - ${b}?`,
    answer: a - b,
    options: generateOptions(a - b, 4, max)
  };
};

/**
 * Genera una pregunta de multiplicación aleatoria
 */
export const generateMultiplicationQuestion = (max: number = 12) => {
  const a = getRandomNumber(1, max);
  const b = getRandomNumber(1, max);
  return {
    question: `¿Cuánto es ${a} × ${b}?`,
    answer: a * b,
    options: generateOptions(a * b, 4, max * max)
  };
};

/**
 * Genera una pregunta de división aleatoria (solo divisiones enteras)
 */
export const generateDivisionQuestion = (max: number = 10) => {
  const b = getRandomNumber(1, max);
  const result = getRandomNumber(1, max);
  const a = b * result;
  return {
    question: `¿Cuánto es ${a} ÷ ${b}?`,
    answer: result,
    options: generateOptions(result, 4, max * 2)
  };
};

/**
 * Genera opciones de respuesta para una pregunta
 */
const generateOptions = (correctAnswer: number, count: number, max: number): number[] => {
  const options = new Set<number>([correctAnswer]);
  
  while (options.size < Math.min(count, max + 1)) {
    // Genera un número aleatorio cercano a la respuesta correcta
    const offset = getRandomNumber(-5, 5);
    const option = correctAnswer + offset;
    
    // Asegura que la opción sea positiva y no se repita
    if (option > 0 && option <= max) {
      options.add(option);
    }
  }
  
  // Convertir a array y mezclar
  return Array.from(options).sort(() => Math.random() - 0.5);
};

/**
 * Formatea un número grande con separadores de miles
 */
export const formatLargeNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Calcula el porcentaje de respuestas correctas
 */
export const calculatePercentage = (correct: number, total: number): number => {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};
