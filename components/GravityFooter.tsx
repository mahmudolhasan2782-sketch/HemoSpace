import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Canvas } from '@react-three/fiber';
import FooterBackground from './FooterBackground';
import Ocean from './Ocean';
import { CONTACT_INFO, CONTENT } from '../constants';
import { Mail, Phone, ExternalLink, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';

const GravityFooter: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null });

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

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 200, width, 50, { isStatic: true, label: 'seaFloor' }); 
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });
    
    Composite.add(world, [ground, leftWall, rightWall]);

    // Create bodies initially static in the air
    const spacing = width / (items.length + 1);
    
    items.forEach((item, index) => {
        const x = spacing * (index + 1);
        const y = 100;
        const body = Bodies.rectangle(x, y, 140, 50, { 
            isStatic: true, 
            restitution: 0.6,
            friction: 0.01,
            label: item.id
        });
        bodiesRef.current.set(item.id, body);
        Composite.add(world, body);
    });

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

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.1, render: { visible: false } }
    });
    Composite.add(world, mouseConstraint);

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
          Matter.Body.setStatic(body, false);
          Matter.Body.applyForce(body, body.position, { x: (Math.random() - 0.5) * 0.05, y: 0.02 });
      }

      // Determine content based on ID
      let title = '';
      let contentNode: React.ReactNode = null;

      if (id === 'Contact') {
          title = "GET IN TOUCH";
          contentNode = (
              <div className="flex flex-col gap-6 w-full">
                  <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 text-xl hover:text-neon-cyan transition-colors bg-white/5 p-4 rounded-xl border border-white/10 hover:border-neon-cyan/50">
                      <Mail className="text-neon-purple w-6 h-6" /> 
                      <span>{CONTACT_INFO.email}</span>
                  </a>
                  <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-4 text-xl hover:text-neon-cyan transition-colors bg-white/5 p-4 rounded-xl border border-white/10 hover:border-neon-cyan/50">
                      <Phone className="text-neon-purple w-6 h-6" /> 
                      <span>{CONTACT_INFO.phone}</span>
                  </a>
                  <a href="https://www.facebook.com/hemontu.snigdho/" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-xl hover:text-neon-cyan transition-colors bg-white/5 p-4 rounded-xl border border-white/10 hover:border-neon-cyan/50">
                      <Facebook className="text-neon-purple w-6 h-6" /> 
                      <span>Facebook Page</span>
                  </a>
              </div>
          );
      } else {
          let text = '';
          let image = '';

          switch(id) {
              case 'Home':
                  title = CONTENT.HOME.title;
                  text = CONTENT.HOME.text;
                  break;
              case 'Gallery':
                  title = CONTENT.GALLERY.title;
                  text = CONTENT.GALLERY.text;
                  break;
              case 'About':
                  title = CONTENT.ABOUT.title;
                  text = CONTENT.ABOUT.text;
                  break;
              case 'Service': // @Hemontu Inc.
                  title = CONTENT.FOUNDER.title;
                  text = CONTENT.FOUNDER.text;
                  image = CONTENT.FOUNDER.image;
                  break;
          }

          contentNode = (
              <div className="flex flex-col gap-6 items-center">
                  {image && (
                      <div className="w-full flex justify-center">
                          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-neon-cyan shadow-[0_0_20px_#00ffff]">
                              <img src={image} alt="Founder" className="w-full h-full object-cover" />
                          </div>
                      </div>
                  )}
                  <p className="text-xl md:text-2xl font-rajdhani text-gray-200 text-center leading-relaxed">
                      {text}
                  </p>
              </div>
          );
      }

      setModalData({ title, content: contentNode });
      setModalOpen(true);
  };

  return (
    <div className="relative w-full h-[700px] border-t-2 border-neon-blue overflow-hidden bg-black mt-20">
        <div className="absolute inset-0 z-0">
             <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
                 <FooterBackground />
                 <Ocean />
             </Canvas>
        </div>
        
        <div ref={sceneRef} className="absolute inset-0 z-10 pointer-events-none" />

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
        
        <div className="absolute bottom-4 w-full text-center z-30 pointer-events-none">
             <p className="text-white/50 font-rajdhani text-sm tracking-widest bg-black/50 inline-block px-4 rounded">
                 @Hemontu Incorporation এর একটি ডিজিটাল সার্ভিস
             </p>
        </div>

        <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            title={modalData.title} 
            content={modalData.content}
        />
    </div>
  );
};

export default GravityFooter;