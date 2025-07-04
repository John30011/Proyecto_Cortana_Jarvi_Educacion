// Re-exportar todos los componentes del módulo de Matemáticas
export * from './components';
export * from './pages';
export * from './services';
export * from './hooks';
export * from './types';

export { MathModule } from './MathModule';

export { default as MathExercisePage } from './pages/MathExercisePage';
export { default as MathExercise } from './components/MathExercise';

export { useMathExercises } from './hooks/useMathExercises';

export * as mathServices from './services/mathExercises';

export { default as MathRoutes } from './routes';
