
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, Layers, Box, Gem, Star, RotateCcw, CheckCircle, Bug } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars as DreiStars, Float, Sparkles, Trail, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Game Logic Hook ---
const useGameLogic = (totalLevels = 20) => {
    const [level, setLevel] = useState(1);
    const [diamonds, setDiamonds] = useState(0);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const nextLevel = (reward = 10) => {
        setDiamonds(d => d + reward);
        setShowLevelComplete(true);
        // Auto advance after animation
        setTimeout(() => {
            setShowLevelComplete(false);
            if (level < totalLevels) {
                setLevel(l => l + 1);
            } else {
                setLevel(1);
                setDiamonds(d => d + 100); // Completion bonus
            }
        }, 2000);
    };

    const resetGame = () => {
        setLevel(1);
        setIsGameOver(false);
        setDiamonds(0);
        setShowLevelComplete(false);
    };

    return { level, diamonds, showLevelComplete, isGameOver, setIsGameOver, nextLevel, resetGame };
};

// --- Reward Overlay Component ---
const LevelCompleteOverlay = ({ level, diamonds }: { level: number, diamonds: number }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
    >
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-neon-cyan/20 rounded-full blur-3xl opacity-50"
        />
        <h2 className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10 text-center">
            LEVEL {level} COMPLETE!
        </h2>
        <div className="flex items-center gap-4 text-3xl font-rajdhani text-white mb-8 z-10">
            <Gem className="text-neon-cyan w-10 h-10 animate-bounce" />
            <span>+{10} Diamonds</span>
        </div>
        <div className="flex gap-2 z-10">
            {[1,2,3].map(i => (
                <motion.div 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                >
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_gold]" />
                </motion.div>
            ))}
        </div>
        <p className="mt-8 text-neon-blue animate-pulse font-orbitron z-10">Initializing Next Challenge...</p>
    </motion.div>
);

// --- Game 1: Elevate (Rapid Math) ---
export const ElevateGame = () => {
  const { level, diamonds, showLevelComplete, isGameOver, setIsGameOver, nextLevel, resetGame } = useGameLogic();
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionsToPass, setQuestionsToPass] = useState(3);

  const generateProblem = () => {
      const maxNum = 10 + (level * 8);
      const ops = level < 5 ? ['+'] : level < 10 ? ['+', '-'] : ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      
      const n1 = Math.floor(Math.random() * maxNum) + 1;
      const n2 = Math.floor(Math.random() * (level > 10 ? maxNum : 10)) + 1;
      
      let ans = 0;
      let qStr = '';
      
      if (op === '+') { ans = n1 + n2; qStr = `${n1} + ${n2}`; }
      else if (op === '-') { ans = n1 - n2; qStr = `${n1} - ${n2}`; }
      else { ans = n1 * n2; qStr = `${n1} × ${n2}`; }

      setProblem({ q: qStr, a: ans });
      
      const opts = new Set<number>();
      opts.add(ans);
      while(opts.size < 4) {
          const variance = Math.floor(Math.random() * 10) + 1;
          const wrong = Math.random() > 0.5 ? ans + variance : ans - variance;
          opts.add(wrong);
      }
      setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateProblem();
    setQuestionsToPass(3 + Math.floor(level / 2)); 
    setTimeLeft(Math.max(5, 15 - Math.floor(level / 2)));
  }, [level]);

  useEffect(() => {
      if (timeLeft > 0 && !isGameOver && !showLevelComplete) {
          const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
          return () => clearInterval(timer);
      } else if (timeLeft === 0 && !showLevelComplete) {
          setIsGameOver(true);
      }
  }, [timeLeft, isGameOver, showLevelComplete]);

  const handleAnswer = (val: number) => {
      if (isGameOver || showLevelComplete) return;
      if (val === problem.a) {
          if (questionsToPass <= 1) {
              nextLevel();
          } else {
              setQuestionsToPass(q => q - 1);
              generateProblem();
              setTimeLeft(prev => prev + 2); 
          }
      } else {
          setTimeLeft(t => Math.max(0, t - 5)); 
      }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 relative p-4 text-center overflow-hidden">
       <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white font-rajdhani z-10">
           <div className="flex items-center gap-2 text-neon-pink"><Layers /> Lvl {level}</div>
           <div className="flex items-center gap-2 text-neon-cyan"><Gem /> {diamonds}</div>
           <div className={`text-2xl font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
       </div>

       <AnimatePresence>
         {showLevelComplete && <LevelCompleteOverlay level={level} diamonds={diamonds} />}
       </AnimatePresence>

       {isGameOver ? (
           <div className="text-center z-10">
               <h2 className="text-4xl text-red-500 font-bold mb-4 font-orbitron">SYSTEM FAILURE</h2>
               <button onClick={resetGame} className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-full hover:bg-white hover:scale-110 transition-all flex items-center gap-2 mx-auto">
                   <RotateCcw size={20} /> REBOOT
               </button>
           </div>
       ) : (
           <div className="w-full max-w-2xl z-10">
               <div className="bg-gray-800/80 backdrop-blur border border-neon-purple p-12 rounded-3xl mb-12 shadow-[0_0_30px_rgba(189,0,255,0.3)]">
                   <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-lg">{problem.q}</h2>
                   <p className="text-gray-400 mt-4 font-rajdhani tracking-widest">SOLVE TO ADVANCE • {questionsToPass} LEFT</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                   {options.map((opt, i) => (
                       <motion.button 
                         key={i}
                         whileHover={{ scale: 1.05, backgroundColor: "#00ffff", color: "#000" }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => handleAnswer(opt)}
                         className="h-24 bg-gray-700/50 backdrop-blur border border-white/10 text-white rounded-2xl text-4xl font-bold transition-all duration-200 shadow-lg"
                       >
                           {opt}
                       </motion.button>
                   ))}
               </div>
           </div>
       )}
    </div>
  );
};

// --- Game 2: Peak (Memory) ---
const MEMORY_CARDS = ['⚡', '🧬', '🚀', '🪐', '👽', '💎', '🛡️', '🔮', '🧿', '🧬', '⚛️', '🦠'];
export const PeakGame = () => {
    const { level, diamonds, showLevelComplete, nextLevel } = useGameLogic();
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);

    useEffect(() => {
        const pairCount = Math.min(12, 4 + Math.floor(level / 3)); 
        const selected = MEMORY_CARDS.slice(0, pairCount);
        const deck = [...selected, ...selected]
            .sort(() => Math.random() - 0.5)
            .map((emoji, id) => ({ id, emoji }));
        setCards(deck);
        setSolved([]);
        setFlipped([]);
    }, [level]);

    const handleClick = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);
        
        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                const newSolved = [...solved, first, second];
                setSolved(newSolved);
                setFlipped([]);
                if (newSolved.length === cards.length) {
                    setTimeout(() => nextLevel(20), 500);
                }
            } else {
                setTimeout(() => setFlipped([]), 800);
            }
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 p-4 relative">
             <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-rajdhani z-10">
                <div className="text-neon-pink text-xl">Level {level}</div>
                <div className="text-neon-cyan text-xl">Score {diamonds}</div>
             </div>
             <AnimatePresence>
                {showLevelComplete && <LevelCompleteOverlay level={level} diamonds={diamonds} />}
             </AnimatePresence>
             <div className="grid grid-cols-4 md:grid-cols-6 gap-3 z-10">
                 {cards.map((card, i) => (
                     <motion.div
                        key={i}
                        className={`w-16 h-20 md:w-24 md:h-32 flex items-center justify-center text-4xl bg-gray-800 border-2 rounded-xl cursor-pointer shadow-lg
                            ${flipped.includes(i) || solved.includes(i) 
                                ? 'bg-gradient-to-br from-neon-purple/80 to-blue-900/80 border-neon-cyan shadow-[0_0_15px_#00ffff]' 
                                : 'border-gray-600 hover:border-white'}`}
                        onClick={() => handleClick(i)}
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: flipped.includes(i) || solved.includes(i) ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                     >
                         <div style={{transform: 'rotateY(180deg)'}}>
                            {(flipped.includes(i) || solved.includes(i)) ? card.emoji : <Brain className="text-gray-600 opacity-50" />}
                         </div>
                     </motion.div>
                 ))}
             </div>
        </div>
    );
};

// --- Game 3: Monument Valley (Spatial Logic) ---
export const MonumentGame = () => {
    const { level, diamonds, showLevelComplete, nextLevel } = useGameLogic();
    const [rotations, setRotations] = useState<number[]>([0, 0, 0]);
    const [targets, setTargets] = useState<number[]>([0, 0, 0]);

    useEffect(() => {
        // Complexity increases by potentially misaligning more rings
        const newTargets = [
            Math.floor(Math.random() * 4) * 90,
            Math.floor(Math.random() * 4) * 90,
            Math.floor(Math.random() * 4) * 90
        ];
        setTargets(newTargets);
        setRotations([
            Math.floor(Math.random() * 4) * 90 + 90,
            Math.floor(Math.random() * 4) * 90 + 90,
            Math.floor(Math.random() * 4) * 90 + 90
        ]);
    }, [level]);

    const handleRotate = (index: number) => {
        const newRots = [...rotations];
        newRots[index] += 90;
        setRotations(newRots);
        const isAligned = newRots.every((r, i) => (r % 360) === (targets[i] % 360));
        if (isAligned) {
            setTimeout(() => nextLevel(30), 500);
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#1a1a2e] relative overflow-hidden">
             <AnimatePresence>
                {showLevelComplete && <LevelCompleteOverlay level={level} diamonds={diamonds} />}
             </AnimatePresence>
             <div className="z-10 text-center mb-10">
                 <h3 className="text-white font-rajdhani text-2xl tracking-[0.5em] mb-2">ALIGN THE GEOMETRY</h3>
                 <p className="text-neon-cyan text-sm">LEVEL {level}</p>
             </div>
             <div className="relative w-80 h-80 flex items-center justify-center z-10">
                 {[0, 1, 2].map((i) => (
                    <div 
                        key={`target-${i}`}
                        className="absolute border-4 border-white/5 rounded-full pointer-events-none border-dashed"
                        style={{ width: `${(i + 1) * 30}%`, height: `${(i + 1) * 30}%` }} 
                    >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full" />
                    </div>
                 ))}
                 {[2, 1, 0].map((i) => (
                     <motion.div
                        key={i}
                        animate={{ rotate: rotations[i] }}
                        className={`absolute rounded-full border-[12px] cursor-pointer hover:scale-105 transition-transform flex items-center justify-center
                            ${(rotations[i] % 360) === (targets[i] % 360) ? 'border-neon-cyan shadow-[0_0_20px_#00ffff]' : 'border-gray-700 hover:border-gray-500'}
                        `}
                        style={{ width: `${(i + 1) * 80 + 60}px`, height: `${(i + 1) * 80 + 60}px` }}
                        onClick={() => handleRotate(i)}
                     >
                         <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${(rotations[i] % 360) === (targets[i] % 360) ? 'bg-white' : 'bg-gray-500'}`} />
                     </motion.div>
                 ))}
                 <div className="w-16 h-16 bg-neon-pink rounded-full shadow-[0_0_50px_#ff00ff] animate-pulse relative z-20" />
             </div>
        </div>
    );
};

// --- Game 4: NeuroNation (Focus) ---
export const NeuroNationGame = () => {
    const { level, diamonds, showLevelComplete, nextLevel } = useGameLogic();
    const [grid, setGrid] = useState<string[]>([]);
    const [target, setTarget] = useState('');
    const [foundCount, setFoundCount] = useState(0);
    const [requiredCount, setRequiredCount] = useState(0);
    const symbols = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'π', 'σ'];

    useEffect(() => {
        const gridSize = 16 + Math.min(32, level * 2); 
        const t = symbols[Math.floor(Math.random() * symbols.length)];
        setTarget(t);
        const req = 3 + Math.floor(level / 2);
        setRequiredCount(req);
        setFoundCount(0);

        const newGrid = Array(gridSize).fill('').map((_, i) => {
            if (i < req) return t;
            return symbols[Math.floor(Math.random() * symbols.length)];
        }).sort(() => Math.random() - 0.5);
        setGrid(newGrid);
    }, [level]);

    const handleItemClick = (sym: string, idx: number) => {
        if (sym === target) {
            const newGrid = [...grid];
            newGrid[idx] = ''; 
            setGrid(newGrid);
            setFoundCount(c => {
                const newCount = c + 1;
                if (newCount >= requiredCount) {
                     setTimeout(() => nextLevel(15), 300);
                }
                return newCount;
            });
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 p-4">
            <AnimatePresence>
                {showLevelComplete && <LevelCompleteOverlay level={level} diamonds={diamonds} />}
            </AnimatePresence>
            <div className="flex items-center gap-8 mb-8 bg-gray-800 px-8 py-4 rounded-full border border-neon-blue shadow-lg">
                <div className="text-center">
                    <p className="text-xs text-gray-400 font-orbitron">TARGET</p>
                    <p className="text-4xl font-bold text-neon-pink">{target}</p>
                </div>
                <div className="h-10 w-[1px] bg-gray-600"></div>
                <div className="text-center">
                    <p className="text-xs text-gray-400 font-orbitron">PROGRESS</p>
                    <p className="text-2xl font-bold text-white">{foundCount} / {requiredCount}</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl max-h-[60vh] overflow-auto p-4 custom-scrollbar">
                {grid.map((sym, i) => (
                    sym === '' ? (
                        <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-transparent border border-gray-800 rounded-xl opacity-30" />
                    ) : (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleItemClick(sym, i)}
                            className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-xl flex items-center justify-center text-3xl text-gray-300 hover:bg-neon-cyan hover:text-black border border-gray-700 transition-colors shadow-md"
                        >
                            {sym}
                        </motion.button>
                    )
                ))}
            </div>
        </div>
    );
};

// --- Game 5: Impulse (Reaction) ---
export const ImpulseGame = () => {
    const { level, showLevelComplete, isGameOver, setIsGameOver, nextLevel, resetGame } = useGameLogic();
    const [status, setStatus] = useState<'IDLE' | 'WAITING' | 'READY' | 'FAIL' | 'SUCCESS'>('IDLE');
    const [displayMsg, setDisplayMsg] = useState("TAP TO START");
    
    // Refs for safe async state access
    const statusRef = useRef(status);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // Sync ref
    useEffect(() => { statusRef.current = status; }, [status]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // Difficulty: Time limit decreases as level increases
    const reactionLimit = Math.max(250, 800 - (level * 30)); 

    const startRound = () => {
        if (showLevelComplete) return;

        setStatus('WAITING');
        setDisplayMsg("WAIT FOR GREEN...");
        
        if (timerRef.current) window.clearTimeout(timerRef.current);

        // Random delay 2s - 5s
        const delay = 2000 + Math.random() * 3000;
        
        timerRef.current = window.setTimeout(() => {
            // GREEN LIGHT
            setStatus('READY');
            setDisplayMsg("TAP NOW!");
            startTimeRef.current = Date.now();

            // Fail timer (too slow)
            timerRef.current = window.setTimeout(() => {
                if (statusRef.current === 'READY') {
                    handleFail("TOO SLOW!");
                }
            }, reactionLimit);

        }, delay);
    };

    const handleInteraction = (e: React.SyntheticEvent) => {
        e.preventDefault(); 
        
        const current = statusRef.current;

        if (current === 'IDLE') {
            startRound();
        } else if (current === 'WAITING') {
            handleFail("TOO EARLY!");
        } else if (current === 'READY') {
            const reactionTime = Date.now() - startTimeRef.current;
            handleSuccess(reactionTime);
        } else if (current === 'FAIL' && isGameOver) {
             // Do nothing, let the restart button handle it
        }
    };

    const handleFail = (reason: string) => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setStatus('FAIL');
        setDisplayMsg(reason);
        setIsGameOver(true);
    };

    const handleSuccess = (ms: number) => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setStatus('SUCCESS');
        setDisplayMsg(`${ms}ms!`);
        
        // Delay before next level
        setTimeout(() => {
             nextLevel(20); 
        }, 1000);
    };

    // Auto-reset state when level advances or game resets
    useEffect(() => {
        if (showLevelComplete) {
            setStatus('IDLE');
            setDisplayMsg(`LEVEL ${level + 1} READY`);
        } else if (!isGameOver && status !== 'IDLE' && status !== 'WAITING' && status !== 'READY') {
            setStatus('IDLE');
            setDisplayMsg("TAP TO START");
        }
    }, [showLevelComplete, isGameOver, level]);


    return (
        <div 
            className={`w-full h-full flex flex-col items-center justify-center select-none cursor-pointer transition-colors duration-200 touch-manipulation relative
                ${status === 'IDLE' ? 'bg-gray-900' : ''}
                ${status === 'WAITING' ? 'bg-red-900' : ''}
                ${status === 'READY' ? 'bg-neon-cyan' : ''}
                ${status === 'SUCCESS' ? 'bg-green-600' : ''}
                ${status === 'FAIL' ? 'bg-black' : ''}
            `}
            onMouseDown={handleInteraction}
            onTouchStart={handleInteraction}
        >
             <AnimatePresence>
                {showLevelComplete && <LevelCompleteOverlay level={level} diamonds={0} />}
             </AnimatePresence>
             
             {isGameOver ? (
                 <div className="z-20 text-center absolute inset-0 flex flex-col items-center justify-center bg-black/80" onMouseDown={(e) => e.stopPropagation()}>
                     <Zap className="w-24 h-24 text-red-500 mb-4 animate-pulse" />
                     <h2 className="text-5xl font-orbitron text-red-500 font-bold mb-4 drop-shadow-[0_0_10px_red]">{displayMsg}</h2>
                     <button 
                        onClick={() => { resetGame(); setStatus('IDLE'); setDisplayMsg("TAP TO START"); }} 
                        className="bg-white text-black px-8 py-3 rounded-full font-bold font-orbitron hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                     >
                        <RotateCcw size={20} /> TRY AGAIN
                     </button>
                 </div>
             ) : (
                 <div className="pointer-events-none text-center">
                      <Zap className={`w-24 h-24 mb-6 mx-auto transition-transform ${status === 'READY' ? 'text-black scale-150' : 'text-white'}`} />
                      <h1 className={`text-5xl font-black font-orbitron ${status === 'READY' ? 'text-black' : 'text-white'}`}>{displayMsg}</h1>
                      <p className={`mt-4 font-rajdhani text-xl ${status === 'READY' ? 'text-black' : 'text-gray-400'}`}>
                        LEVEL {level} • LIMIT {reactionLimit}ms
                      </p>
                 </div>
             )}
        </div>
    )
};


// --- Game 6: HemoFly: Butterfly Odyssey ---

// Hyper-Realistic Butterfly Wing
const ButterflyWing = ({ shape, color, ...props }: any) => {
  const wingShape = useMemo(() => {
    const s = new THREE.Shape();
    if (shape === 'fore') {
      // Realistic Forewing shape
      s.moveTo(0, 0);
      s.bezierCurveTo(0.2, 0.5, 0.8, 1.2, 1.8, 0.8);
      s.bezierCurveTo(2.2, 0.4, 2.0, -0.4, 1.0, -0.8);
      s.lineTo(0, 0);
    } else {
      // Realistic Hindwing shape
      s.moveTo(0, 0);
      s.bezierCurveTo(0.5, -0.2, 1.2, -0.8, 0.8, -1.8);
      s.bezierCurveTo(0.2, -2.2, -0.5, -1.2, 0, 0);
    }
    return s;
  }, [shape]);

  return (
    <mesh {...props}>
      <shapeGeometry args={[wingShape]} />
      <meshPhysicalMaterial 
        color={color} 
        side={THREE.DoubleSide} 
        transmission={0.4} 
        thickness={0.05} 
        roughness={0.2}
        metalness={0.1}
        iridescence={0.8}
        iridescenceIOR={1.5}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  )
}

const Butterfly = ({ position }: any) => {
    const group = useRef<THREE.Group>(null!);
    const bodyColor = "#222";
    const wingColor = "#00ffff";
    const veinColor = "#bd00ff";

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
             // Natural hover/bobbing
             group.current.position.y = position[1] + Math.sin(t * 3) * 0.2;
             group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], 0.1);
             
             // Banking/Rolling when moving side to side
             const targetRoll = (position[0] - group.current.position.x) * -0.5;
             group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRoll, 0.1);

             // Wing flap animation
             const wingAngle = Math.sin(t * 20) * 0.8; // Faster, more intense flutter
             
             // Wings are children indices: 2 (Left Group) and 3 (Right Group)
             if(group.current.children[2]) group.current.children[2].rotation.z = wingAngle; 
             if(group.current.children[3]) group.current.children[3].rotation.z = -wingAngle; 
        }
    });

    return (
        <group ref={group} position={position} scale={0.4}>
            {/* --- ANATOMY --- */}
            
            {/* Thorax (Center Body) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
                <meshStandardMaterial color={bodyColor} roughness={0.8} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 0.45, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={bodyColor} roughness={0.5} />
            </mesh>
            
            {/* Eyes */}
            <mesh position={[0.08, 0.48, 0.05]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="black" roughness={0} metalness={0.8} />
            </mesh>
            <mesh position={[-0.08, 0.48, 0.05]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="black" roughness={0} metalness={0.8} />
            </mesh>

            {/* Abdomen (Tail) */}
            <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
                <meshStandardMaterial color={bodyColor} roughness={0.9} />
            </mesh>

            {/* Antennae */}
            <group position={[0, 0.5, 0.1]}>
                 <mesh position={[0.1, 0.3, 0]} rotation={[0, 0, -0.2]}>
                     <cylinderGeometry args={[0.01, 0.02, 0.6]} />
                     <meshStandardMaterial color="black" />
                 </mesh>
                 <mesh position={[-0.1, 0.3, 0]} rotation={[0, 0, 0.2]}>
                     <cylinderGeometry args={[0.01, 0.02, 0.6]} />
                     <meshStandardMaterial color="black" />
                 </mesh>
            </group>

            {/* --- WINGS --- */}
            
            {/* Left Wing Group */}
            <group position={[-0.1, 0, 0.1]} rotation={[0.2, 0.2, 0]}>
                <ButterflyWing shape="fore" color={wingColor} position={[-0.2, 0.2, 0]} rotation={[0, 0, 2.5]} scale={1.5} />
                <ButterflyWing shape="hind" color={wingColor} position={[-0.3, -0.5, 0]} rotation={[0, 0, 2]} scale={1.2} />
                 {/* Trails for effect */}
                <Trail width={0.4} length={3} color={new THREE.Color(veinColor)} attenuation={(t) => t * t} target={undefined} />
            </group>

            {/* Right Wing Group */}
            <group position={[0.1, 0, 0.1]} rotation={[0.2, -0.2, 0]}>
                {/* We flip the scale X for mirroring */}
                <group scale={[-1, 1, 1]}>
                    <ButterflyWing shape="fore" color={wingColor} position={[-0.2, 0.2, 0]} rotation={[0, 0, 2.5]} scale={1.5} />
                    <ButterflyWing shape="hind" color={wingColor} position={[-0.3, -0.5, 0]} rotation={[0, 0, 2]} scale={1.2} />
                </group>
                <Trail width={0.4} length={3} color={new THREE.Color(veinColor)} attenuation={(t) => t * t} target={undefined} />
            </group>

            {/* Magic Sparkles around body */}
            <Sparkles count={15} scale={1.5} size={1} speed={0.4} opacity={0.8} color="#ff00ff" />
        </group>
    );
}

const World = ({ level, onCollide, onCollect }: any) => {
    const obstaclesRef = useRef<THREE.Group>(null!);
    const pollensRef = useRef<THREE.Group>(null!);
    const speed = 5 + level * 2;
    const colorTheme = level > 10 ? (level > 15 ? "#ff0000" : "#bd00ff") : "#00ffff";

    useFrame((state, delta) => {
        // Move obstacles towards camera
        if (obstaclesRef.current) {
            obstaclesRef.current.children.forEach((child: any) => {
                child.position.z += delta * speed;
                if (child.position.z > 5) {
                    child.position.z = -50 - Math.random() * 50;
                    child.position.x = (Math.random() - 0.5) * 10;
                    child.position.y = (Math.random() - 0.5) * 8;
                }
                // Collision
                if (child.position.z > 0 && child.position.z < 1 && Math.abs(child.position.x) < 1 && Math.abs(child.position.y) < 1) {
                    onCollide();
                }
            });
        }
        // Move pollens
        if (pollensRef.current) {
             pollensRef.current.children.forEach((child: any) => {
                child.position.z += delta * speed;
                // Spin
                child.rotation.y += delta;
                child.rotation.z += delta;

                if (child.position.z > 5) {
                    child.position.z = -50 - Math.random() * 50;
                    child.position.x = (Math.random() - 0.5) * 10;
                    child.position.y = (Math.random() - 0.5) * 8;
                    child.visible = true;
                }
                // Collection
                if (child.visible && child.position.z > 0 && child.position.z < 1 && Math.abs(child.position.x) < 1 && Math.abs(child.position.y) < 1) {
                    child.visible = false;
                    onCollect();
                }
            });
        }
    });

    return (
        <>
            <group ref={obstaclesRef}>
                {Array.from({ length: 10 + level }).map((_, i) => (
                    <mesh key={i} position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8, -20 - Math.random() * 50]}>
                        <octahedronGeometry args={[0.5]} />
                        <meshStandardMaterial color={level === 20 ? "red" : "#333"} wireframe={level > 10} />
                    </mesh>
                ))}
            </group>
            <group ref={pollensRef}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <mesh key={i} position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8, -20 - Math.random() * 50]}>
                        <dodecahedronGeometry args={[0.3]} />
                        <meshStandardMaterial color={colorTheme} emissive={colorTheme} emissiveIntensity={2} />
                    </mesh>
                ))}
            </group>
            <fog attach="fog" args={['#000', 5, 30]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        </>
    );
};

export const HemoFlyGame = () => {
    const { level, diamonds, showLevelComplete, isGameOver, setIsGameOver, nextLevel, resetGame } = useGameLogic();
    const [mousePos, setMousePos] = useState([0, 0]);
    const scoreRef = useRef(0);
    const requiredScore = 5 + level * 2;

    const handleMouseMove = (e: React.MouseEvent) => {
        // Normalize mouse to -1 to 1 range approx for movement
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMousePos([x * 5, y * 3]); // Scaling for screen play area
    };

    const handleCollide = () => {
        if (!isGameOver && !showLevelComplete) {
            setIsGameOver(true);
        }
    };

    const handleCollect = () => {
        if (!isGameOver && !showLevelComplete) {
            scoreRef.current += 1;
            if (scoreRef.current >= requiredScore) {
                scoreRef.current = 0;
                nextLevel(20);
            }
        }
    };

    return (
        <div 
            className="w-full h-full relative bg-black cursor-none overflow-hidden" 
            onMouseMove={handleMouseMove}
        >
             <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white font-rajdhani z-10 pointer-events-none">
                <div className="flex items-center gap-2 text-neon-pink"><Bug /> Lvl {level}</div>
                <div className="flex items-center gap-2 text-neon-cyan"><Gem /> {diamonds}</div>
            </div>

            <AnimatePresence>
                {showLevelComplete && <LevelCompleteOverlay level={level} diamonds={diamonds} />}
            </AnimatePresence>

            {isGameOver && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                   <div className="text-center">
                       <h2 className="text-5xl font-orbitron text-red-600 mb-4">CRASHED</h2>
                       <button onClick={resetGame} className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-full hover:bg-white transition-all flex items-center gap-2 mx-auto">
                           <RotateCcw size={20} /> RESPAWN
                       </button>
                   </div>
               </div>
            )}

            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <DreiStars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
                <Butterfly position={[mousePos[0], mousePos[1], 0]} />
                <World level={level} onCollide={handleCollide} onCollect={handleCollect} />
                <Float speed={1} rotationIntensity={1} floatIntensity={1}>
                    <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#bd00ff" />
                </Float>
            </Canvas>
        </div>
    );
};
