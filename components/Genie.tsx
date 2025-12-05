import React from 'react';
import { motion } from 'framer-motion';

const Genie: React.FC = () => {
  // Generates particles for the "Magic" effect coming from the lamp
  const magicParticles = Array.from({ length: 15 }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        x: Math.random() * 100 - 50,
        y: -100 - Math.random() * 100,
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 2 + Math.random(),
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeOut"
      }}
      className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-neon-cyan blur-[1px]"
    />
  ));

  return (
    <div className="relative w-[300px] h-[400px] pointer-events-none md:scale-125 origin-bottom-right">
       {/* Magic Lamp Text Emitter */}
       <div className="absolute bottom-20 left-10 z-20">
          {magicParticles}
          {/* Repeated Welcome Text */}
          <motion.div 
            className="absolute bottom-10 left-0 w-40 h-60 pointer-events-none"
          >
             {Array.from({length: 4}).map((_, i) => (
                <motion.h3
                  key={i}
                  initial={{ opacity: 0, y: 0, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -150, scale: 1.2, rotate: Math.random() * 20 - 10 }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 text-2xl font-orbitron font-bold text-neon-pink drop-shadow-[0_0_5px_#fff]"
                >
                  Welcome...
                </motion.h3>
             ))}
          </motion.div>
       </div>

       {/* Genie Body Animation */}
       <motion.div
         animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 2, 0, -2, 0] // Subtle body sway
         }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         className="w-full h-full relative"
       >
          <img 
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Genie.png" 
            alt="Genie"
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.4)]"
          />
          
          {/* Hand Waving Simulation (Overlaying a glow on the hand area if we can't separate the sprite) 
              Since it's a single image, we animate the rotation of the whole figure slightly to mimic gesture
              and add a magic glow near the hand.
          */}
          <motion.div
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 1, repeat: Infinity }}
             className="absolute top-[30%] right-[20%] w-8 h-8 bg-white rounded-full blur-md"
          />
       </motion.div>
    </div>
  );
};

export default Genie;