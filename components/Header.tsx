import React, { useState } from 'react';
import ThreeScene from './ThreeBackground';
import Genie from './Genie';
import GamesPanel from './GamesPanel';
import Modal from './Modal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gamepad2, UserPlus } from 'lucide-react';

const Header: React.FC = () => {
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { scrollY } = useScroll();
  
  // Parallax rotation effect for the barrel sensation
  const rotateX = useTransform(scrollY, [0, 500], [0, 45]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <header className="relative w-full h-screen overflow-hidden bg-black perspective-1000">
      {/* 3D Background (Fluid/Particles) */}
      <ThreeScene mode="header" />
      
      {/* Genie Overlay - Positioned to the right or corner */}
      <div className="absolute bottom-0 right-0 z-30 pointer-events-none">
         <Genie />
      </div>
      
      {/* Main Content Container with 3D Barrel Transform */}
      <motion.div 
        style={{ rotateX, scale }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 transform-style-3d origin-bottom"
      >
        {/* Shark Fin Logo - Fixed Position */}
        <motion.div
           initial={{ y: -100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-4 z-40"
        >
           <div className="relative w-16 h-16 md:w-20 md:h-20 bg-neon-purple/20 rounded-xl p-2 border border-neon-purple/50 backdrop-blur-md shadow-[0_0_20px_rgba(189,0,255,0.4)]">
             {/* Embedded SVG for guaranteed visibility */}
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                <path d="M 10 80 Q 25 70 40 80 T 70 80 T 100 80 V 90 H 10 Z" fill="#4d4dff" />
                <path d="M 20 80 Q 50 10 90 70 L 80 80 H 20 Z" fill="#6b2cf5" />
                {/* Shark Fin shape */}
                <path d="M 30 75 C 35 40, 60 10, 80 50 L 70 75 Z" fill="#bd00ff" /> 
                <path d="M 30 75 Q 40 50 45 45 L 50 48 Q 45 55 35 75 Z" fill="#ff00ff" opacity="0.5" />
             </svg>
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-xl"></div>
           </div>
           <div className="flex flex-col">
             <span className="text-3xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
               HEMONTU
             </span>
             <span className="text-sm font-rajdhani text-white/90 tracking-[0.3em] font-bold">INCORPORATION</span>
           </div>
        </motion.div>

        {/* 360 Barrel Content Center */}
        <div className="text-center space-y-8 max-w-5xl z-20">
           <motion.h1 
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8, type: "spring" }}
             className="text-6xl md:text-9xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-[0_0_30px_rgba(189,0,255,0.5)]"
           >
             Hemo<span className="text-neon-pink inline-block animate-pulse-fast">Space</span>
           </motion.h1>

           <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="text-2xl md:text-3xl font-rajdhani text-neon-cyan tracking-wide"
           >
             Hyper-Realistic Digital Experience
           </motion.p>

           {/* Dynamic Buttons */}
           <div className="flex flex-wrap gap-8 justify-center mt-16">
             <motion.button
               onClick={() => setModalOpen(true)}
               whileHover={{ scale: 1.1, boxShadow: "0 0 30px #bd00ff", textShadow: "0 0 10px white" }}
               whileTap={{ scale: 0.95 }}
               className="group relative px-10 py-5 bg-black/50 backdrop-blur-sm border-2 border-neon-pink rounded-full overflow-hidden"
             >
               <div className="absolute inset-0 bg-neon-pink opacity-10 group-hover:opacity-30 transition-opacity"></div>
               <div className="relative z-10 flex items-center gap-3 font-orbitron font-bold text-xl text-white">
                 <UserPlus className="w-6 h-6" />
                 <span>SIGN UP</span>
               </div>
             </motion.button>

             <motion.button
               onClick={() => setIsGamesOpen(!isGamesOpen)}
               whileHover={{ scale: 1.1, boxShadow: "0 0 30px #00ffff", textShadow: "0 0 10px white" }}
               whileTap={{ scale: 0.95 }}
               className="group relative px-10 py-5 bg-black/50 backdrop-blur-sm border-2 border-neon-cyan rounded-full overflow-hidden"
             >
               <div className="absolute inset-0 bg-neon-cyan opacity-10 group-hover:opacity-30 transition-opacity"></div>
               <div className="relative z-10 flex items-center gap-3 font-orbitron font-bold text-xl text-white">
                 <Gamepad2 className="w-6 h-6" />
                 <span>MY GAME</span>
               </div>
             </motion.button>
           </div>
        </div>
      </motion.div>

      {/* Games Panel Component */}
      <GamesPanel isOpen={isGamesOpen} onClose={() => setIsGamesOpen(false)} />

      {/* Sign Up Dummy Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Join the Federation"
        content="Our registration portal is currently synchronizing with the galactic server. Please check back after the next solar flare."
      />

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center z-20"
      >
        <span className="text-[10px] font-orbitron mb-2 tracking-widest text-neon-cyan">EXPLORE</span>
        <div className="w-6 h-10 border-2 border-neon-cyan/50 rounded-full flex justify-center pt-2 box-border">
          <div className="w-1 h-2 bg-neon-pink rounded-full animate-bounce"></div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;