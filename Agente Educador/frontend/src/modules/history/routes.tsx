import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HistoryModule from './HistoryModule';

const HistoryRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HistoryModule />} />
      <Route path=":ageGroup" element={<HistoryModule />} />
    </Routes>
  );
};

export default HistoryRoutes;
