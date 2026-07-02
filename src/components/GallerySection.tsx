import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { galleryItems } from '../data/gallery';
import { GalleryItem } from '../types';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Viewports' },
    { id: 'atmosphere', label: 'Atmosphere' },
    { id: 'cuisine', label: 'Cuisine' },
    { id: 'heritage', label: 'Heritage' },
    { id: 'celebrations', label: 'Celebrations' }
  ];

  // Filtering images based on active tab
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const handleOpenLightbox = (index: number) => {
    // We map back to the filtered item index to maintain proper carousel navigation
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Editorial Title */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 border-b border-gold/10 pb-12">
        <div className="md:col-span-8">
          <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] block mb-2 font-bold">
            Visual Storytelling
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase font-light leading-tight">
            Chronicles of <br />
            <span className="italic text-gold font-normal">Coastal Luxury</span>
          </h2>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
            A meticulous curated portfolio mapping the sunsets, details, design pairings, and gourmet achievements of The Colaco Hut.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-4 md:gap-8 justify-center mb-12 pb-6 border-b border-white/5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`font-sans text-[11px] md:text-xs uppercase tracking-widest px-3 py-1.5 transition-all duration-300 relative ${
              activeCategory === cat.id
                ? 'text-gold font-semibold scale-105'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <motion.div
                layoutId="gallery-active-bar"
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gold"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Masonry-like grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="gallery-item aspect-square md:aspect-[4/3] group relative overflow-hidden bg-charcoal-light cursor-pointer"
              onClick={() => handleOpenLightbox(index)}
            >
              {/* Image with slow hover zoom */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1.2s] ease-out brightness-[0.8] group-hover:brightness-[0.4]"
                referrerPolicy="no-referrer"
              />

              {/* Luxury gold hover focus border lines */}
              <div className="absolute inset-4 border border-gold/0 group-hover:border-gold/25 transition-all duration-700 pointer-events-none" />

              {/* Expanded details text overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-charcoal to-transparent">
                <span className="font-sans text-[9px] text-gold uppercase tracking-[0.2em] font-semibold mb-1 block">
                  {item.category.toUpperCase()}
                </span>
                <h3 className="font-serif text-lg text-white uppercase tracking-wider font-light mb-2 flex items-center justify-between">
                  {item.title}
                  <Maximize2 className="w-3.5 h-3.5 text-gold" />
                </h3>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed font-light line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Zoom Portal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md">
            {/* Close button top right */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 p-3 border border-gold/10 hover:border-gold/50 text-gold hover:text-white transition-colors z-50 bg-charcoal/50"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Carousel trigger */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-4 md:left-8 p-3 border border-white/5 hover:border-gold/30 text-white/50 hover:text-gold transition-colors z-30 bg-charcoal/50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox content block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full max-w-3xl overflow-hidden bg-charcoal-light shadow-2xl">
                <img
                  src={filteredItems[lightboxIndex].imageUrl}
                  alt={filteredItems[lightboxIndex].title}
                  className="w-full h-full object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Informative footer */}
              <div className="text-center max-w-xl space-y-2">
                <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] font-semibold">
                  {filteredItems[lightboxIndex].category} — Photo {lightboxIndex + 1} of {filteredItems.length}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-white uppercase tracking-wider font-light">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-white/70 leading-relaxed font-light">
                  {filteredItems[lightboxIndex].description}
                </p>
              </div>
            </motion.div>

            {/* Right Carousel trigger */}
            <button
              onClick={handleNextLightbox}
              className="absolute right-4 md:right-8 p-3 border border-white/5 hover:border-gold/30 text-white/50 hover:text-gold transition-colors z-30 bg-charcoal/50"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
