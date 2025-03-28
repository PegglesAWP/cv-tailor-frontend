import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CV Tailor</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<div>Welcome to CV Tailor!</div>} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
