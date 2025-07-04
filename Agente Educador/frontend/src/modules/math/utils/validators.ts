/**
 * Valida si un valor es un número
 */
export const isNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Valida si un valor es un número entero
 */
export const isInteger = (value: any): boolean => {
  return isNumber(value) && value % 1 === 0;
};

/**
 * Valida si un valor es un número positivo
 */
export const isPositive = (value: number): boolean => {
  return isNumber(value) && value > 0;
};

/**
 * Valida si un valor está dentro de un rango
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return isNumber(value) && value >= min && value <= max;
};

/**
 * Valida si una respuesta matemática es correcta
 */
export const validateMathAnswer = (
  answer: any, 
  correctAnswer: number, 
  tolerance: number = 0
): boolean => {
  if (!isNumber(answer)) return false;
  
  // Para respuestas con decimales, permite un margen de tolerancia
  if (tolerance > 0) {
    return Math.abs(Number(answer) - correctAnswer) <= tolerance;
  }
  
  // Para respuestas enteras, debe ser exacta
  return Number(answer) === correctAnswer;
};

/**
 * Valida si un email tiene un formato válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 */
export const isValidPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Valida si un valor es una cadena no vacía
 */
export const isNonEmptyString = (value: any): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Valida si un valor es un array no vacío
 */
export const isNonEmptyArray = (value: any): boolean => {
  return Array.isArray(value) && value.length > 0;
};
