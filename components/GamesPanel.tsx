import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES } from '../constants';
import { X, Play, ArrowLeft } from 'lucide-react';
import { CosmicClicker, SpaceTicTacToe, ReactionTest, MemoryMatch, VoidDodger } from './MiniGames';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GamesPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const renderGame = () => {
      switch(activeGameId) {
          case '1': return <VoidDodger />;
          case '2': return <SpaceTicTacToe />;
          case '3': return <MemoryMatch />;
          case '4': return <CosmicClicker />;
          case '5': return <ReactionTest />;
          default: return <div className="text-white">Game Loading...</div>;
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div className="relative w-full max-w-6xl h-[80vh] bg-gray-900 border border-neon-cyan/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-4">
                  {activeGameId && (
                      <button onClick={() => setActiveGameId(null)} className="text-neon-cyan hover:text-white transition-colors">
                          <ArrowLeft />
                      </button>
                  )}
                  <h2 className="text-2xl font-orbitron text-neon-cyan">
                      {activeGameId ? GAMES.find(g => g.id === activeGameId)?.title : 'Hemontu Arcade'}
                  </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <X />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                {activeGameId ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full flex items-center justify-center bg-black rounded-lg border border-white/10 overflow-hidden"
                    >
                        {renderGame()}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {GAMES.map((game, index) => (
                        <motion.div
                        key={game.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        onClick={() => setActiveGameId(game.id)}
                        className="bg-gray-800 rounded-lg overflow-hidden border border-neon-purple/30 group cursor-pointer relative shadow-lg"
                        >
                        <div className="h-40 overflow-hidden">
                            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-orbitron text-base text-neon-pink truncate">{game.title}</h3>
                            <p className="text-xs text-gray-400 font-rajdhani mt-1">{game.category}</p>
                            <div className="mt-3 flex items-center gap-2 text-neon-cyan text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={12} fill="currentColor" /> PLAY NOW
                            </div>
                        </div>
                        </motion.div>
                    ))}
                    </div>
                )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GamesPanel;