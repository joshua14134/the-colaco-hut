import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Navbar({ currentView, setCurrentView }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'The Experience' },
    { id: 'menu', label: 'Gourmet Menu' },
    { id: 'about', label: 'Goan Heritage' },
    { id: 'reservation', label: 'Reservations' },
    { id: 'gallery', label: 'Masonry Gallery' },
    { id: 'private-dining', label: 'Private Suite' },
    { id: 'chef', label: 'Culinary Team' },
    { id: 'events', label: 'Curated Events' },
    { id: 'testimonials', label: 'Guest Reviews' },
    { id: 'blog', label: 'Chronicles' },
    { id: 'careers', label: 'Hospitality Careers' },
    { id: 'contact', label: 'Contact & Hours' },
    { id: 'admin', label: 'Staff Console 🔒' }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sticky top bar */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 glass-navbar border-b border-gold/10 px-6 md:px-12 flex justify-between items-center">
        {/* Left: Hamburger menu toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 group text-white hover:text-gold transition-colors duration-300"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden md:inline font-sans text-xs uppercase tracking-[0.2em] font-semibold">Menu</span>
          </button>
        </div>

        {/* Center: Brand Name (Clickable to Home) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center cursor-pointer" onClick={() => handleNavClick('home')}>
          <h1 className="font-serif text-lg md:text-2xl tracking-[0.25em] text-white hover:text-gold transition-colors duration-500 font-bold uppercase">
            THE COLACO HUT
          </h1>
          <span className="block text-[8px] md:text-[10px] font-sans tracking-[0.5em] text-gold/80 uppercase font-semibold">
            Reserve — Goa
          </span>
        </div>

        {/* Right: Direct Reservation Quick Action */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavClick('reservation')}
            className={`font-sans text-xs uppercase tracking-[0.2em] font-semibold border border-gold/30 px-5 py-2.5 hover:bg-gold hover:text-charcoal transition-all duration-500 rounded-none ${
              currentView === 'reservation' ? 'bg-gold text-charcoal' : 'text-gold'
            }`}
          >
            Reserve
          </button>
        </div>
      </header>

      {/* Full-Screen Premium Navigation Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-charcoal/95 z-[60] backdrop-blur-sm"
            />

            {/* Sidebar drawer panel */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed top-0 left-0 bottom-0 w-full sm:w-[450px] bg-charcoal-light border-r border-gold/10 z-[70] p-8 md:p-12 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Close Button and branding */}
                <div className="flex justify-between items-center mb-16">
                  <div>
                    <h2 className="font-serif text-xl tracking-[0.2em] text-white font-bold">
                      THE COLACO HUT
                    </h2>
                    <p className="text-[10px] font-sans tracking-[0.3em] text-gold uppercase mt-1">
                      Coastal Sanctuary
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 border border-gold/10 hover:border-gold/50 text-gold hover:text-white transition-colors duration-300"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Editorial links */}
                <nav className="flex flex-col gap-5">
                  {navLinks.map((link, index) => {
                    const isActive = currentView === link.id;
                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => handleNavClick(link.id)}
                        className="group flex items-center justify-between py-2 border-b border-white/5 text-left"
                      >
                        <span className={`font-serif text-lg md:text-xl tracking-wider transition-all duration-300 ${
                          isActive ? 'text-gold pl-2 border-l-2 border-gold font-bold' : 'text-white/70 group-hover:text-white group-hover:pl-2'
                        }`}>
                          {link.label}
                        </span>
                        <ArrowUpRight className={`w-4 h-4 text-gold/50 group-hover:text-gold transition-all duration-300 ${
                          isActive ? 'opacity-100 rotate-45' : 'opacity-0 group-hover:opacity-100'
                        }`} />
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer contact info */}
              <div className="mt-16 pt-8 border-t border-gold/10 text-white/50 space-y-2">
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold">Location</p>
                <p className="font-sans text-xs tracking-wide">Vagator Beach Road, North Goa, India</p>
                <div className="pt-4 flex justify-between text-[10px] font-sans tracking-widest uppercase">
                  <span>Tel: +91 832 999 8888</span>
                  <span className="text-gold">Open Daily from 12:00</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
