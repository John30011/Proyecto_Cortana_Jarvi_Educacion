import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CursosPage from './pages/CursosPage';
import CategoryPage from './pages/CategoryPage';
import CourseDetailPage from './pages/CourseDetailPage';

const CursosRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CursosPage />} />
      <Route path="categoria/:categoryId" element={<CategoryPage />} />
      <Route path="curso/:courseId" element={<CourseDetailPage />} />
      <Route path=":courseId" element={<CourseDetailPage />} />
    </Routes>
  );
};

export default CursosRoutes;
