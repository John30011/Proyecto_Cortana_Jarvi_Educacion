import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MathExercisePage from './pages/MathExercisePage';

const MathRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/math" element={<MathExercisePage />} />
      <Route path="/math/:ageGroup" element={<MathExercisePage />} />
    </Routes>
  );
};

export default MathRoutes;
