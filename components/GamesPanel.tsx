import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES } from '../constants';
import { X, Play, ArrowLeft, Gamepad, Maximize } from 'lucide-react';
import { ElevateGame, PeakGame, MonumentGame, NeuroNationGame, ImpulseGame, HemoFlyGame } from './MiniGames';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GamesPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const renderGame = () => {
      switch(activeGameId) {
          case '1': return <ElevateGame />;
          case '2': return <PeakGame />;
          case '3': return <MonumentGame />;
          case '4': return <NeuroNationGame />;
          case '5': return <ImpulseGame />;
          case '6': return <HemoFlyGame />;
          default: return <div className="text-white">Loading...</div>;
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
            <div className="w-full h-full flex flex-col relative">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-neon-cyan/30 bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        {activeGameId ? (
                            <button onClick={() => setActiveGameId(null)} className="flex items-center gap-2 text-neon-cyan hover:text-white px-4 py-2 rounded-full border border-neon-cyan hover:bg-neon-cyan/20 transition-all">
                                <ArrowLeft size={20} /> <span className="font-orbitron">BACK TO ARCADE</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 text-neon-pink">
                                <Gamepad className="w-8 h-8" />
                                <h2 className="text-3xl font-orbitron tracking-widest font-black">HEMO<span className="text-white">ARCADE</span></h2>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative overflow-hidden">
                    {activeGameId ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full"
                        >
                            {renderGame()}
                        </motion.div>
                    ) : (
                        <div className="h-full overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto mt-10">
                                {GAMES.map((game, index) => (
                                    <motion.div
                                        key={game.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        onClick={() => setActiveGameId(game.id)}
                                        className="group relative h-[400px] bg-gray-800 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-neon-cyan/50 shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300"
                                    >
                                        <div className="absolute inset-0">
                                            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                        </div>
                                        
                                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-1 bg-neon-purple text-white text-xs font-bold rounded uppercase">{game.category}</span>
                                                <span className="text-neon-cyan text-xs font-rajdhani border border-neon-cyan px-2 py-1 rounded">20 LEVELS</span>
                                            </div>
                                            <h3 className="text-3xl font-orbitron font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{game.title}</h3>
                                            <p className="text-gray-400 text-sm font-rajdhani mb-4 line-clamp-2">{game.description}</p>
                                            
                                            <button className="w-full py-3 bg-neon-cyan text-black font-bold font-orbitron rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                                <Play size={18} fill="black" /> PLAY NOW
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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