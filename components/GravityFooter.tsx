import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Canvas } from '@react-three/fiber';
import FooterBackground from './FooterBackground';
import Ocean from './Ocean';
import { CONTACT_INFO } from '../constants';
import { Mail, Phone, ExternalLink, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';

const GravityFooter: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const [showContact, setShowContact] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const [items] = useState([
      { id: 'Home', label: 'Home' },
      { id: 'Gallery', label: 'Gallery' },
      { id: 'About', label: 'About' },
      { id: 'Contact', label: 'Contact' },
      { id: 'Service', label: '@Hemontu Inc.' },
  ]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    // Set low gravity for space feel
    world.gravity.y = 1;

    const width = sceneRef.current.clientWidth;
    const height = 600;

    // Boundaries - removed bottom boundary so things fall into "Ocean"
    const ground = Bodies.rectangle(width / 2, height + 200, width, 50, { isStatic: true, label: 'seaFloor' }); // Deep sea floor
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });
    
    Composite.add(world, [ground, leftWall, rightWall]);

    // Create bodies initially static in the air
    const spacing = width / (items.length + 1);
    
    items.forEach((item, index) => {
        const x = spacing * (index + 1);
        const y = 100;
        const body = Bodies.rectangle(x, y, 140, 50, { 
            isStatic: true, // Starts static
            restitution: 0.6,
            friction: 0.01,
            label: item.id
        });
        bodiesRef.current.set(item.id, body);
        Composite.add(world, body);
    });

    // Render Setup
    const render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
            width,
            height,
            background: 'transparent',
            wireframes: false
        }
    });

    // Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.1, render: { visible: false } }
    });
    Composite.add(world, mouseConstraint);

    // Sync Loop
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const updateLoop = () => {
        items.forEach(item => {
            const body = bodiesRef.current.get(item.id);
            const el = document.getElementById(`gravity-item-${item.id}`);
            if (body && el) {
                const { x, y } = body.position;
                const angle = body.angle;
                // If it falls too far, reset it
                if (y > height + 100) {
                     Matter.Body.setPosition(body, { x: spacing * (items.indexOf(item) + 1), y: -50 });
                     Matter.Body.setVelocity(body, { x: 0, y: 0 });
                     Matter.Body.setStatic(body, true);
                }
                el.style.transform = `translate(${x - 70}px, ${y - 25}px) rotate(${angle}rad)`;
            }
        });
        requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
        Render.stop(render);
        Runner.stop(runner);
        Engine.clear(engine);
        if(render.canvas) render.canvas.remove();
    };
  }, [items]);

  const handleInteraction = (id: string, label: string) => {
      const body = bodiesRef.current.get(id);
      if (body) {
          // Release gravity
          Matter.Body.setStatic(body, false);
          // Add small random force
          Matter.Body.applyForce(body, body.position, { x: (Math.random() - 0.5) * 0.05, y: 0.02 });
      }

      if (id === 'Contact') {
          setTimeout(() => setShowContact(true), 500); // Delay slightly for effect
      } else if (id !== 'Service') {
         // Show modal for others
         setModalContent({
             title: label,
             content: `Navigating to ${label}... (This is a demo interaction)`
         });
         setModalOpen(true);
      }
  };

  return (
    <div className="relative w-full h-[700px] border-t-2 border-neon-blue overflow-hidden bg-black mt-20">
        {/* 3D Ocean Background */}
        <div className="absolute inset-0 z-0">
             <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
                 <FooterBackground />
                 <Ocean />
             </Canvas>
        </div>
        
        {/* Physics Container */}
        <div ref={sceneRef} className="absolute inset-0 z-10 pointer-events-none" />

        {/* DOM Elements (Synced) */}
        <div className="absolute inset-0 z-20">
             {items.map((item) => (
                 <div
                    key={item.id}
                    id={`gravity-item-${item.id}`}
                    className={`absolute top-0 left-0 w-[140px] h-[50px] flex items-center justify-center rounded-lg font-orbitron font-bold text-sm select-none shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer transition-colors
                        ${item.id === 'Service' 
                            ? 'bg-neon-purple/80 border-2 border-white text-white' 
                            : 'bg-neon-cyan/80 border border-white text-black hover:bg-white'}
                    `}
                    onMouseEnter={() => handleInteraction(item.id, item.label)}
                    onTouchStart={() => handleInteraction(item.id, item.label)}
                    onClick={() => handleInteraction(item.id, item.label)}
                 >
                     {item.label}
                 </div>
             ))}
        </div>
        
        {/* Footer Credit */}
        <div className="absolute bottom-4 w-full text-center z-30 pointer-events-none">
             <p className="text-white/50 font-rajdhani text-sm tracking-widest bg-black/50 inline-block px-4 rounded">
                 @Hemontu Incorporation এর একটি ডিজিটাল সার্ভিস
             </p>
        </div>

        {/* Contact Popup */}
        <AnimatePresence>
            {showContact && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-20 right-10 z-[60] bg-black/90 border border-neon-pink p-6 rounded-xl shadow-[0_0_30px_#ff00ff]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-neon-pink font-orbitron text-xl">Contact Link</h3>
                        <button onClick={() => setShowContact(false)} className="text-white hover:text-red-500"><ExternalLink size={16}/></button>
                    </div>
                    <div className="space-y-4 font-rajdhani text-lg text-white">
                        <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 hover:text-neon-cyan transition-colors">
                            <Mail className="text-neon-purple" /> {CONTACT_INFO.email}
                        </a>
                        <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 hover:text-neon-cyan transition-colors">
                            <Phone className="text-neon-purple" /> {CONTACT_INFO.phone}
                        </a>
                        <a href="https://www.facebook.com/hemontu.snigdho/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-neon-cyan transition-colors">
                            <Facebook className="text-neon-purple" /> Facebook Page
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        
        <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            title={modalContent.title} 
            content={modalContent.content}
        />
    </div>
  );
};

export default GravityFooter;