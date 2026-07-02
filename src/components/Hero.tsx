import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExplore: () => void;
  onBook: () => void;
}

export default function Hero({ onExplore, onBook }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<{ id: number; size: number; x: number; y: number; delay: number; duration: number }[]>([]);

  // Generate luxury floating ambient particle data once on mount
  useEffect(() => {
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, // 1px to 4px delicate golden embers
      x: Math.random() * 100, // percentage left
      y: Math.random() * 100, // percentage top
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10 // slow drift (10s to 20s)
    }));
    setParticles(generated);
  }, []);

  // Mouse move handler for luxury image parallax translation
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 18; // subtlest 18px range
    const y = (clientY / window.innerHeight - 0.5) * 18;
    setMousePos({ x, y });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Absolute background image container with slow cinematic Ken Burns scale & mouse parallax */}
      <div className="absolute inset-0 z-0 brightness-[0.42] pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            x: mousePos.x, 
            y: mousePos.y,
            scale: 1.05
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 1.2 }}
          className="w-[105%] h-[105%] -left-[2.5%] -top-[2.5%] absolute bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuuhIpUQWA0OcRe2WLXmvqsrMQwvY2ayoAZbcma6Mw5eCVF3H9ipb91u8ffxmFYSR_V4J5G-pyhakZevzNxV9BEApTODoY4s-W9-zFdr-jgKuF6-WObIrvsf25Y8QfXkIqIxpnA_VdP2ZZ76B9vK63LanhEHxW4Rr5UjkCo1kRoFxCTGckssOx5vppAvOqkvGV8ZjZC8Xcvy9TlIM_me53SnkLg_AbW0ftxJcuH5TAzYcqoQbAUCpi5Tg')`
          }}
        />
      </div>

      {/* Luxury subtle ambient color bloom gradient overlays */}
      <div className="absolute inset-0 bg-radial-gradient from-gold/10 via-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-charcoal to-transparent pointer-events-none z-10" />

      {/* Floating golden spark particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: '110%' }}
            animate={{ 
              opacity: [0, 0.6, 0.6, 0], 
              y: '-10%',
              x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`, `${p.x + (Math.random() * 20 - 10)}%`]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              backgroundColor: '#C8A96A',
              borderRadius: '50%',
              filter: 'blur(0.5px) drop-shadow(0 0 3px #C8A96A)'
            }}
          />
        ))}
      </div>

      {/* Hero content container */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold font-semibold">
            MICHELIN-INSPIRED COASTAL NOIR
          </span>
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
        </motion.div>

        {/* Cinematic headline */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.06em] leading-[1.1] uppercase font-light">
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            The Art Of
          </motion.span>
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="block text-gold mt-2 font-normal italic tracking-wider font-serif"
          >
            Coastal Indulgence
          </motion.span>
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-xs sm:text-sm md:text-lg text-white/70 font-light tracking-[0.1em] max-w-2xl mx-auto mt-8 leading-relaxed"
        >
          Where ancestral Goan flavors and Portuguese fine-dining traditions meet the golden sun and rhythmic tides of Vagator Beach.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2, boxShadow: '0 10px 30px rgba(200, 169, 106, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onBook}
            className="w-full sm:w-auto px-10 py-5 bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-2xl rounded-none cursor-pointer"
          >
            Experience The Hut
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03, y: -2, borderColor: '#C8A96A', color: '#C8A96A' }}
            whileTap={{ scale: 0.98 }}
            onClick={onExplore}
            className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-white/20 font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 rounded-none cursor-pointer"
          >
            Explore The Menu
          </motion.button>
        </motion.div>
      </div>

      {/* Floating scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer"
        onClick={onExplore}
      >
        <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/50">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
