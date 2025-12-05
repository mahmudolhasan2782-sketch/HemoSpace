import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// --- Game 1: Clicker ---
export const CosmicClicker = () => {
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState<{id: number, x: number, y: number}[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setScore(s => s + 1);
    const id = Date.now();
    setClicks(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden select-none" onClick={handleClick}>
       <h3 className="text-4xl font-orbitron text-white mb-4 z-10">Minerals: {score}</h3>
       <p className="text-neon-cyan animate-pulse z-10">Click anywhere to mine!</p>
       <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 animate-spin-slow"></div>
       </div>
       {clicks.map(c => (
           <motion.div 
             key={c.id}
             initial={{ opacity: 1, y: 0 }}
             animate={{ opacity: 0, y: -50 }}
             className="absolute text-neon-pink font-bold text-xl pointer-events-none"
             style={{ left: c.x, top: c.y }}
           >
               +1
           </motion.div>
       ))}
    </div>
  );
};

// --- Game 2: Tic Tac Toe ---
export const SpaceTicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const winner = calculateWinner(board);

    function handleClick(i: number) {
        if (winner || board[i]) return;
        const next = [...board];
        next[i] = xIsNext ? 'X' : 'O';
        setBoard(next);
        setXIsNext(!xIsNext);
    }

    function calculateWinner(squares: any[]) {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let i=0; i<lines.length; i++) {
            const [a,b,c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
        }
        return null;
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-black/50">
            <div className="mb-4 text-2xl font-orbitron text-neon-cyan">
                {winner ? `Winner: ${winner}` : `Next Player: ${xIsNext ? 'X (Hero)' : 'O (Alien)'}`}
            </div>
            <div className="grid grid-cols-3 gap-2 bg-neon-purple p-2 rounded">
                {board.map((val, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleClick(i)}
                        className="w-16 h-16 bg-gray-900 text-3xl font-bold flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                    >
                        {val === 'X' && <span className="text-neon-cyan">X</span>}
                        {val === 'O' && <span className="text-neon-pink">O</span>}
                    </button>
                ))}
            </div>
            <button onClick={() => setBoard(Array(9).fill(null))} className="mt-6 px-4 py-2 border border-white text-white rounded hover:bg-white/20">Reset</button>
        </div>
    )
}

// --- Game 3: Reaction Timer ---
export const ReactionTest = () => {
    const [state, setState] = useState<'waiting' | 'ready' | 'now' | 'finished'>('waiting');
    const [startTime, setStartTime] = useState(0);
    const [score, setScore] = useState<number | null>(null);
    const timeoutRef = useRef<number>(0);

    const start = () => {
        setState('ready');
        setScore(null);
        timeoutRef.current = window.setTimeout(() => {
            setState('now');
            setStartTime(Date.now());
        }, 1000 + Math.random() * 2000);
    };

    const handleClick = () => {
        if (state === 'ready') {
            clearTimeout(timeoutRef.current);
            setState('waiting');
            alert("Too early!");
        } else if (state === 'now') {
            const time = Date.now() - startTime;
            setScore(time);
            setState('finished');
        } else if (state === 'finished' || state === 'waiting') {
            start();
        }
    };

    return (
        <div 
            className={`h-full w-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                ${state === 'waiting' || state === 'finished' ? 'bg-gray-800' : ''}
                ${state === 'ready' ? 'bg-red-900' : ''}
                ${state === 'now' ? 'bg-green-600' : ''}
            `}
            onMouseDown={handleClick}
        >
            <h3 className="text-3xl font-orbitron text-white text-center px-4 select-none">
                {state === 'waiting' && "Click to Start"}
                {state === 'ready' && "Wait for Green..."}
                {state === 'now' && "CLICK NOW!"}
                {state === 'finished' && `${score} ms`}
            </h3>
            {state === 'finished' && <p className="text-gray-300 mt-2">Click to try again</p>}
        </div>
    )
}

// --- Game 4: Memory Match ---
const CARDS = ['🚀', '👽', '🪐', '☄️', '🌌', '🌠'];
export const MemoryMatch = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);

    useEffect(() => {
        const deck = [...CARDS, ...CARDS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, id) => ({ id, emoji }));
        setCards(deck);
    }, []);

    const handleClick = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);
        
        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                setSolved(prev => [...prev, first, second]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900">
             <div className="grid grid-cols-4 gap-2">
                 {cards.map((card, i) => (
                     <motion.div
                        key={i}
                        className={`w-12 h-16 md:w-16 md:h-20 flex items-center justify-center text-2xl bg-gray-700 rounded cursor-pointer ${flipped.includes(i) || solved.includes(i) ? 'bg-neon-purple' : ''}`}
                        onClick={() => handleClick(i)}
                        animate={{ rotateY: flipped.includes(i) || solved.includes(i) ? 180 : 0 }}
                     >
                         {(flipped.includes(i) || solved.includes(i)) ? <div style={{transform: 'rotateY(180deg)'}}>{card.emoji}</div> : '?'}
                     </motion.div>
                 ))}
             </div>
             {solved.length === cards.length && cards.length > 0 && (
                 <div className="mt-4 text-neon-cyan font-bold">Mission Complete!</div>
             )}
        </div>
    );
};

// --- Game 5: Simple Dodger (Canvas) ---
export const VoidDodger = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let playerY = 150;
        let obstacles: {x:number, y:number}[] = [];
        let frameId = 0;
        let speed = 2;
        let running = true;
        let scoreCount = 0;

        const handleMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            playerY = e.clientY - rect.top;
        };
        canvas.addEventListener('mousemove', handleMove);

        const loop = () => {
            if (!running) return;
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Player
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(30, playerY, 10, 0, Math.PI * 2);
            ctx.fill();

            // Obstacles
            if (Math.random() < 0.05) {
                obstacles.push({ x: canvas.width, y: Math.random() * canvas.height });
            }

            obstacles.forEach(obs => {
                obs.x -= speed;
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(obs.x, obs.y, 20, 20);

                // Collision
                const dist = Math.sqrt(Math.pow(obs.x - 30, 2) + Math.pow(obs.y - playerY, 2));
                if (dist < 20) {
                    running = false;
                    setGameOver(true);
                }
            });

            obstacles = obstacles.filter(obs => obs.x > -20);
            
            scoreCount++;
            if (scoreCount % 100 === 0) speed += 0.5;
            setScore(Math.floor(scoreCount / 10));

            frameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(frameId);
            canvas.removeEventListener('mousemove', handleMove);
        }
    }, [gameOver]);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-black relative">
            <canvas ref={canvasRef} width={300} height={300} className="border border-neon-cyan/30 cursor-crosshair touch-none" />
            <div className="absolute top-2 right-2 text-white font-mono">{score}</div>
            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                    <h3 className="text-red-500 font-bold text-2xl mb-2">GAME OVER</h3>
                    <button onClick={() => setGameOver(false)} className="px-4 py-2 bg-neon-cyan text-black font-bold rounded">Retry</button>
                </div>
            )}
        </div>
    )
}
