import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
            className="relative w-full max-w-2xl bg-gray-900 border border-neon-cyan rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-2xl font-orbitron font-bold text-neon-pink">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8 font-rajdhani text-lg text-gray-300 leading-relaxed min-h-[200px]">
              {content}
            </div>

            {/* Decorative Glow */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-purple/30 blur-3xl pointer-events-none"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;