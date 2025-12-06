import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10, y: 100 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0, rotate: 10, y: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Multicolor Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#bd00ff] via-[#00ffff] to-[#ff00ff] animate-pulse-fast opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
            
            {/* Rotating Glow Border Effect */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            />

            <div className="relative z-10 bg-black/80 m-[2px] rounded-2xl overflow-hidden backdrop-blur-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/20 bg-gradient-to-r from-white/5 to-transparent">
                  <div className="flex items-center gap-2">
                      <Sparkles className="text-yellow-400 animate-spin-slow" />
                      <h2 className="text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-cyan drop-shadow-md">
                        {title}
                      </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300 group"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-8 font-rajdhani text-lg text-white leading-relaxed text-center min-h-[200px] flex flex-col items-center justify-center">
                  {content}
                </div>

                {/* Footer Deco */}
                <div className="h-2 w-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;