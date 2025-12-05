import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Globe } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10, boxShadow: "0 10px 30px -10px rgba(0,255,255,0.3)" }}
    className="bg-gray-900/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-neon-purple/20 blur-3xl group-hover:bg-neon-pink/30 transition-colors"></div>
    <Icon className="w-12 h-12 text-neon-cyan mb-4 group-hover:text-neon-pink transition-colors duration-300" />
    <h3 className="text-2xl font-orbitron font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 font-rajdhani leading-relaxed">{desc}</p>
  </motion.div>
);

const Body: React.FC = () => {
  return (
    <section className="relative min-h-screen py-20 px-4 md:px-12 z-20 overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black z-0 animate-pulse-fast"></div>
      <motion.div 
         animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
         transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
         className="absolute inset-0 z-0 bg-[linear-gradient(270deg,#050505,#1a0b2e,#050505,#001220)] bg-[length:400%_400%] opacity-80"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-6xl font-orbitron font-black text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          >
            HYPER <span className="text-neon-purple">REALITY</span>
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-pink mx-auto"></div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <FeatureCard 
            icon={Zap} 
            title="Instant Speed" 
            desc="Lightning fast rendering with optimized WebGL core engines."
            delay={0.1}
          />
          <FeatureCard 
            icon={Shield} 
            title="Secure Core" 
            desc="Quantum-resistant encryption for all your digital assets."
            delay={0.2}
          />
          <FeatureCard 
            icon={Cpu} 
            title="AI Integration" 
            desc="Built-in neural networks processing real-time data."
            delay={0.3}
          />
          <FeatureCard 
            icon={Globe} 
            title="Global Scale" 
            desc="Deployed on edge networks for zero-latency access anywhere."
            delay={0.4}
          />
        </div>

        {/* Interactive Visual Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden border border-neon-cyan/30 h-[400px] shadow-[0_0_30px_rgba(0,255,255,0.1)]"
            >
               <img src="https://picsum.photos/800/800?random=10" alt="Cyber City" className="w-full h-full object-cover filter brightness-75 contrast-125 hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-orbitron text-white">Cyber Architecture</h3>
                  <p className="text-neon-cyan">Next Gen Design</p>
               </div>
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
               <h3 className="text-3xl font-orbitron font-bold text-white">
                 Immersive <span className="text-neon-pink">Experience</span>
               </h3>
               <p className="text-gray-300 font-rajdhani text-lg leading-loose">
                 Step into a world where digital boundaries dissolve. Hemontu Incorporation brings you a seamless blend of aesthetics and functionality. Our interfaces react to your presence, creating a unique bond between user and machine.
               </p>
               <button className="text-neon-cyan font-bold font-orbitron border-b-2 border-neon-cyan pb-1 hover:text-white hover:border-white transition-all hover:shadow-[0_0_10px_#00ffff]">
                 READ MORE &rarr;
               </button>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Body;