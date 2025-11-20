import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './Upload';
import Report from './Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/report/:id" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
