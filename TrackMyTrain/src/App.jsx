import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LiveStatus from './pages/LiveStatus';
import PNRStatus from './pages/PNRStatus';
import TrainResults from './pages/TrainResults';
import TrainDetails from './pages/TrainDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live-status/:trainNo" element={<LiveStatus />} />
        <Route path="/pnr-status/:pnr" element={<PNRStatus />} />
        <Route path="/trains" element={<TrainResults />} />
        <Route path="/train-details/:trainNo" element={<TrainDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
