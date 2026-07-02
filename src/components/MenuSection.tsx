import React, { useState, useMemo } from 'react';
import { Search, Flame, Award, Clock, Star, Sparkles, X, Heart, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import { gourmetMenu } from '../data/menu';

export default function MenuSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All Viewports' },
    { id: 'starters', label: 'Starters' },
    { id: 'seafood', label: 'Signature Seafood' },
    { id: 'goan', label: 'Goan Specialties' },
    { id: 'portuguese', label: 'Portuguese Classics' },
    { id: 'desserts', label: 'Premium Desserts' },
    { id: 'cellar', label: 'Cellar Selection' }
  ];

  // Filtering logic
  const filteredMenu = useMemo(() => {
    return gourmetMenu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto text-white">
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase font-light">
          The Gourmet <span className="italic text-gold font-normal">Chronicle</span>
        </h2>
        <p className="font-sans text-xs text-gold uppercase tracking-[0.3em] mt-3 font-semibold">
          Award-Winning Beachfront Cuisine
        </p>
        <p className="font-sans text-white/60 text-xs md:text-sm leading-relaxed mt-4 font-light">
          Each culinary creation is prepared by hand using daily Vagator marine landings and local stone-milled spice masalas.
        </p>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between border-y border-gold/15 py-8 mb-16">
        {/* Category horizontal scroller */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 xl:pb-0 no-scrollbar w-full xl:w-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`font-sans text-[11px] md:text-xs uppercase tracking-widest px-4 py-2 border-b-2 transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'text-gold border-gold font-semibold scale-105'
                  : 'text-white/50 border-transparent hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Text Search input */}
        <div className="relative w-full xl:w-80">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="SEARCH OUR MENU..."
            className="w-full bg-transparent border-b border-gold/30 py-2.5 pl-2 pr-10 font-sans text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-gold transition-colors placeholder:text-white/30"
          />
          <Search className="absolute right-2 bottom-3 w-4 h-4 text-gold/80" />
        </div>
      </div>

      {/* Grid listing */}
      {filteredMenu.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map(dish => {
              const isFav = favorites.includes(dish.id);
              return (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setSelectedDish(dish)}
                  className="group bg-charcoal-light border border-gold/10 hover:border-gold/35 p-6 md:p-8 flex flex-col justify-between h-[280px] hover:shadow-[0_12px_40px_rgba(200,169,106,0.06)] transition-all duration-500 cursor-pointer relative overflow-hidden"
                >
                  {/* Subtle top ambient glow */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Top line badges & fav */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2">
                        {dish.recommended && (
                          <span className="bg-gold/15 text-gold text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                            RECOMMENDED
                          </span>
                        )}
                        {dish.bestSeller && (
                          <span className="bg-white/10 text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                            BEST SELLER
                          </span>
                        )}
                        {dish.seasonal && (
                          <span className="bg-forest/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                            SEASONAL
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(dish.id, e)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                        aria-label="Add to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
                      </button>
                    </div>

                    {/* Dish title & Spice level */}
                    <div className="flex items-baseline justify-between gap-2 mb-3">
                      <h3 className="font-serif text-lg md:text-xl text-white group-hover:text-gold transition-colors duration-300 uppercase truncate">
                        {dish.name}
                      </h3>
                      {dish.spicyLevel !== undefined && dish.spicyLevel > 0 && (
                        <div className="flex gap-0.5" title={`Spicy level: ${dish.spicyLevel}`}>
                          {Array.from({ length: dish.spicyLevel }).map((_, i) => (
                            <Flame key={i} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description excerpt */}
                    <p className="font-sans text-xs text-white/60 leading-relaxed font-light line-clamp-3 mb-6">
                      {dish.description}
                    </p>
                  </div>

                  {/* Pricing footer with details arrow */}
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <span className="font-sans text-xs tracking-widest text-white/50 uppercase">INR</span>
                    <span className="font-serif text-xl text-gold group-hover:scale-105 transition-transform duration-300 font-bold">
                      {dish.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 border border-gold/10 p-8">
          <p className="font-serif text-lg text-white/50 uppercase">No gourmet match found</p>
          <p className="font-sans text-xs text-white/30 mt-2">Try adjusting your filters or search keywords.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} 
            className="mt-6 px-6 py-2 bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal transition-colors font-sans text-xs uppercase tracking-widest"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Dish details modal screen */}
      <AnimatePresence>
        {selectedDish && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDish(null)}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] bg-charcoal-light border border-gold/30 z-[110] p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-6 right-6 p-2 border border-gold/10 hover:border-gold/40 text-gold hover:text-white transition-colors"
                aria-label="Close details modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div className="flex gap-2">
                  <span className="bg-gold/15 text-gold text-[9px] font-bold px-3 py-1 tracking-widest uppercase">
                    {selectedDish.category.toUpperCase()}
                  </span>
                  {selectedDish.recommended && (
                    <span className="bg-white/10 text-white text-[9px] font-bold px-3 py-1 tracking-widest uppercase flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-gold text-gold" /> Chef Approved
                    </span>
                  )}
                </div>

                {/* Title and price */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 border-b border-gold/10 pb-4">
                  <h3 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wider font-light">
                    {selectedDish.name}
                  </h3>
                  <div className="flex items-baseline gap-1 text-gold">
                    <span className="text-[10px] font-sans">INR</span>
                    <span className="font-serif text-2xl md:text-3xl font-bold">
                      {selectedDish.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Extended description */}
                <p className="font-sans text-sm text-white/80 leading-relaxed font-light">
                  {selectedDish.description} Our culinary team ensures each ingredient is handpicked from Vagator’s local cooperative markets and our fishers’ early morning beach hauls.
                </p>

                {/* Culinary info items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gold/10">
                  <div className="bg-charcoal p-4 border border-white/5 space-y-1">
                    <p className="text-[10px] font-sans text-gold/80 uppercase tracking-widest">Beverage Pairings</p>
                    <p className="text-xs text-white/75 font-light">
                      {selectedDish.category === 'cellar' 
                        ? 'Pairs perfectly with our raw seafood plates.'
                        : selectedDish.category === 'seafood'
                        ? 'Best matched with white Alentejo Port or Cloudy Bay Sauv.'
                        : selectedDish.category === 'goan'
                        ? 'Complemented beautifully by our oak-aged cashew feni.'
                        : 'Ask your sommelier for classical vintage pairings.'}
                    </p>
                  </div>

                  <div className="bg-charcoal p-4 border border-white/5 space-y-1">
                    <p className="text-[10px] font-sans text-gold/80 uppercase tracking-widest">Allergen Sourcing</p>
                    <p className="text-xs text-white/75 font-light">
                      {selectedDish.category === 'seafood' || selectedDish.category === 'starters'
                        ? 'Contains Shellfish. Prepared in a workspace handling tree nuts.'
                        : '100% Organic dairy and locally grown non-GMO grains.'}
                    </p>
                  </div>
                </div>

                {/* Instant actions */}
                <div className="pt-6 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setSelectedDish(null)}
                    className="w-full md:w-1/2 py-4 bg-transparent border border-white/20 text-white font-sans text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
                  >
                    Back to Menu
                  </button>
                  <a
                    href="#reservation-bar"
                    onClick={() => {
                      setSelectedDish(null);
                      // Action handled via context/tabs in parent
                    }}
                    className="w-full md:w-1/2 py-4 bg-gold text-charcoal text-center block font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all cursor-pointer"
                  >
                    Table Reservations
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
