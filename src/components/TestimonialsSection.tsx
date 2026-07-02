import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types';

export default function TestimonialsSection() {
  const reviews: Testimonial[] = [
    {
      id: 'rev-1',
      name: 'Clara Mendes',
      role: 'Michelin Food Critic',
      text: '“A breathtaking tribute to Indo-Portuguese lineage. Chef Marcus’s Pork Belly Vindaloo has an extraordinary, wood-distilled toddy vinegar depth that is simply unmatched on the subcontinent.”',
      rating: 5,
      source: 'Michelin Guide'
    },
    {
      id: 'rev-2',
      name: 'Arthur Sinclair',
      role: 'Editorial Director',
      text: '“The floor-to-ceiling glass layout and beachfront placement evokes Aman resorts at their finest. Flawless white-glove service, exquisite ocean scallops, and an extraordinary cashew feni portfolio.”',
      rating: 5,
      source: 'Luxe Digest'
    },
    {
      id: 'rev-3',
      name: 'Joshua D’Silva',
      role: 'Senior Food Columnist',
      text: '“Grandfather Casimiro’s beach legacy has been handled with flawless modern craft. Marcus has elevated simple seaside cooking into highly disciplined, elegant fine art.”',
      rating: 5,
      source: 'Goa Chronicle'
    }
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const nextSlide = useCallback(() => {
    setDirection('right');
    setIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setDirection('left');
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  // Luxury Auto Play interval
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6500); // 6.5s for deep slow luxury reading
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideVariants = {
    initial: (dir: 'left' | 'right') => ({
      opacity: 0,
      x: dir === 'right' ? 60 : -60,
      scale: 0.97,
      filter: 'blur(4px)'
    }),
    active: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: 'left' | 'right') => ({
      opacity: 0,
      x: dir === 'right' ? -60 : 60,
      scale: 0.97,
      filter: 'blur(4px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const currentReview = reviews[index];

  return (
    <section className="bg-charcoal text-white py-24 px-6 md:px-12 max-w-5xl mx-auto overflow-hidden">
      {/* Editorial Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] font-bold block mb-2">
          Critical Acclaim
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-wide uppercase font-light">
          The Chronicles of <span className="italic text-gold font-normal">Praise</span>
        </h2>
        <div className="w-16 h-[1px] bg-gold/50 mx-auto mt-6" />
      </div>

      {/* Majestic Single-Slide Carousel Area */}
      <div className="relative min-h-[400px] md:min-h-[320px] bg-charcoal-light border border-gold/15 p-8 md:p-16 flex flex-col justify-between shadow-2xl relative">
        <Quote className="absolute top-8 right-8 w-24 h-24 text-gold/5 pointer-events-none" />
        
        {/* Border accent corners for luxury aesthetics */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/35" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/35" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentReview.id}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="active"
            exit="exit"
            className="space-y-8 flex-grow flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Star Rating Reveal */}
              <div className="flex gap-1.5 justify-start">
                {Array.from({ length: currentReview.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4, type: 'spring' }}
                  >
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </motion.div>
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="font-serif text-lg md:text-2xl text-white/95 leading-relaxed italic font-light tracking-wide">
                {currentReview.text}
              </blockquote>
            </div>

            {/* Critic Info Section */}
            <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-serif text-base uppercase text-white tracking-widest font-normal">
                  {currentReview.name}
                </h4>
                <p className="font-sans text-[10px] text-gold uppercase tracking-[0.2em] mt-1 font-semibold">
                  {currentReview.role}
                </p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gold/10 px-4 py-1.5 text-[10px] font-sans text-gold uppercase font-bold tracking-widest border border-gold/20 shadow-lg"
              >
                {currentReview.source}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Side Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            className="w-10 h-10 bg-charcoal border border-gold/20 flex items-center justify-center text-gold/80 hover:text-gold hover:border-gold/50 cursor-pointer shadow-xl rounded-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6">
          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            className="w-10 h-10 bg-charcoal border border-gold/20 flex items-center justify-center text-gold/80 hover:text-gold hover:border-gold/50 cursor-pointer shadow-xl rounded-none"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 'right' : 'left');
              setIndex(i);
            }}
            className="group py-2 focus:outline-none cursor-pointer"
          >
            <div className={`h-[2px] transition-all duration-500 rounded-none ${
              i === index ? 'w-8 bg-gold' : 'w-4 bg-white/20 group-hover:bg-white/40'
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
}
