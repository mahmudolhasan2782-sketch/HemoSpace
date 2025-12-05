import React, { Suspense } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import GravityFooter from './components/GravityFooter';

// Loading fallback
const Loader = () => (
  <div className="h-screen w-full bg-black flex items-center justify-center">
    <div className="text-neon-cyan font-orbitron animate-pulse">INITIALIZING SYSTEM...</div>
  </div>
);

function App() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-neon-pink selection:text-white">
      <Suspense fallback={<Loader />}>
        {/* Header Section: 360 Fluid & Genie */}
        <Header />
        
        {/* Main Body Content */}
        <Body />
        
        {/* Footer: Gravity Physics */}
        <GravityFooter />
      </Suspense>
    </div>
  );
}

export default App;
