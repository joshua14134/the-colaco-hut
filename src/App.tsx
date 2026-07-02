import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Star } from 'lucide-react';

// Import components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import ReservationSection from './components/ReservationSection';
import GallerySection from './components/GallerySection';
import PrivateDining from './components/PrivateDining';
import ChefSection from './components/ChefSection';
import EventsSection from './components/EventsSection';
import TestimonialsSection from './components/TestimonialsSection';
import BlogSection from './components/BlogSection';
import CareersSection from './components/CareersSection';
import ContactSection from './components/ContactSection';
import AdminSection from './components/AdminSection';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');

  // Helper for quick booking
  const handleDirectBook = () => {
    setCurrentView('reservation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-charcoal min-h-screen text-white font-sans flex flex-col selection:bg-gold selection:text-charcoal overflow-x-hidden">
      
      {/* Sticky top bar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Viewport Content with AnimatePresence Page Transitions */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.99, filter: 'blur(8px)', y: 15 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, scale: 0.99, filter: 'blur(8px)', y: -15 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'home' && (
              <>
                {/* Full-screen Hero Section */}
                <Hero 
                  onExplore={() => {
                    setCurrentView('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  onBook={handleDirectBook} 
                />

                {/* Home Page Teaser Section 1: Culinary Spotlight */}
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-gold/10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-5 space-y-8">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-gold" />
                        <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold">
                          Award-Winning
                        </span>
                      </div>
                      <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight font-light">
                        Gastronomy <br />
                        <span className="italic text-gold font-normal">Of Vagator</span>
                      </h2>
                      <p className="font-sans text-white/85 leading-relaxed text-sm md:text-base font-light">
                        Guided by Chef Marcus Colaco, our kitchen merges fire-roasted Goan coconut masalas with classical French reductions. Savour early dawn seafood landings cooked over sweet woodfires.
                      </p>
                      
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            setCurrentView('menu');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-8 py-4 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-500 rounded-none flex items-center gap-3 cursor-pointer"
                        >
                          Discover Our Menu <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                      <div className="aspect-[3/4] overflow-hidden border border-gold/15 relative group">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR0ytlYarh6uZsiXT-zNXCpmsGzwi1Qw1u81IKTPrEc1yIumziNeNr7YF5vjEQtoogeo2V1TeQc9hEkPeFNOPEYy3qtBQQYsCgP22bk07JipBZ76gw5O_AKNQmgv5_d4o6kerm0zcTYjR0SvP2cgS0pJRvR-7vDYAivN8fozgkSGp0KThj4H7d_IuxwY3speO9tS76ClUNG1bN4oSPANCQupInULVR3PmgEtW4pDJqGdCFwhQSgek_zw" 
                          alt="Culinary excellence closeup" 
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 left-4 bg-charcoal/80 px-3 py-1 text-[9px] font-sans text-gold uppercase tracking-widest border border-gold/25">
                          TERROIR
                        </div>
                      </div>
                      <div className="aspect-[3/4] overflow-hidden border border-gold/15 relative mt-8 group">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLXy-gcQGKOad3tnERIU99uZ3eU81QfL3wLAJuG50rej_JzA72wTRv9qFLFW-LgXZlXy3rgGjM63fsmHT-wsezrHhvjVSUjF93HUZAI0Ylq0_AFI44VQD20IhOyZ-nRy2NROOpOLWO9ksPTt7d1_juhC2JwU1errLq1HOBceBYbYwY03MGowS7samPI3_8DijB0v2Fdpd0ExBVcCYa855wqVDqCr3pLnqKGgRW2tS0pa6OztYXQngNHQ" 
                          alt="Luxury ocean table setup" 
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 left-4 bg-charcoal/80 px-3 py-1 text-[9px] font-sans text-gold uppercase tracking-widest border border-gold/25">
                          ATMOSPHERE
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Home Page Teaser Section 2: Heritage Bento Grid */}
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-charcoal-light py-24 px-6 md:px-12 border-y border-gold/10"
                >
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-16">
                      <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] font-bold block mb-2">
                        The Lineage
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl tracking-wide uppercase">
                        Half-Century of Culinary Craft
                      </h3>
                      <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="border border-gold/10 p-8 space-y-4 bg-charcoal">
                        <span className="font-serif text-gold text-2xl font-bold tracking-widest">1968</span>
                        <h4 className="font-serif text-lg text-white uppercase tracking-wider">The Shore Shack</h4>
                        <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                          Our family legacy began as a humble beachside shack, serving clay-cooked catches directly to visiting mariners.
                        </p>
                      </div>

                      <div className="border border-gold/10 p-8 space-y-4 bg-charcoal">
                        <span className="font-serif text-gold text-2xl font-bold tracking-widest">1994</span>
                        <h4 className="font-serif text-lg text-white uppercase tracking-wider">The Lisbon Exchange</h4>
                        <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                          Chef Marcus brought European reduction methods and premium port wine integration home to Vagator.
                        </p>
                      </div>

                      <div className="border border-gold/10 p-8 space-y-4 bg-charcoal">
                        <span className="font-serif text-gold text-2xl font-bold tracking-widest">2024</span>
                        <h4 className="font-serif text-lg text-white uppercase tracking-wider">The Luxury Reserve</h4>
                        <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                          Rebuilt into North Goa’s premiere architectural destination, setting global fine-dining standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Home Page Teaser Section 3: Testimonials spotlight excerpt */}
                <TestimonialsSection />

                {/* Final Booking Call-to-Action on Home */}
                <motion.section 
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-charcoal py-20 px-6 text-center border-t border-gold/10 max-w-4xl mx-auto"
                >
                  <div className="space-y-6">
                    <Sparkles className="w-5 h-5 text-gold mx-auto animate-pulse" />
                    <h3 className="font-serif text-2xl md:text-4xl uppercase tracking-wider font-light">
                      Secure Your Sanctuary At Vagator
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-white/70 max-w-lg mx-auto leading-relaxed font-light">
                      Our dining suites fill rapidly. Reserve online to secure white-glove beachside hospitality and masterfully curated menus.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={handleDirectBook}
                        className="px-12 py-5 bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-white hover:text-charcoal transition-all duration-500 rounded-none cursor-pointer"
                      >
                        Secure A Table
                      </button>
                    </div>
                  </div>
                </motion.section>
              </>
            )}

            {currentView === 'menu' && <MenuSection />}
            {currentView === 'about' && <About />}
            {currentView === 'reservation' && <ReservationSection />}
            {currentView === 'gallery' && <GallerySection />}
            {currentView === 'private-dining' && <PrivateDining />}
            {currentView === 'chef' && <ChefSection />}
            {currentView === 'events' && <EventsSection />}
            {currentView === 'testimonials' && <TestimonialsSection />}
            {currentView === 'blog' && <BlogSection />}
            {currentView === 'careers' && <CareersSection />}
            {currentView === 'contact' && <ContactSection />}
            {currentView === 'admin' && <AdminSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Sticky Quick Booking bar */}
      {currentView !== 'reservation' && currentView !== 'admin' && (
        <div id="reservation-bar" className="fixed bottom-0 left-0 w-full bg-charcoal-light border-t border-gold/20 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gold shrink-0 animate-pulse" />
            <div className="text-left">
              <span className="block text-[8px] font-sans tracking-[0.2em] text-gold uppercase font-bold">LIMITED SEATING FOR TONIGHT</span>
              <p className="text-[11px] font-sans tracking-wide text-white/80">Secure white-glove fine dining overlooking Vagator sunset.</p>
            </div>
          </div>
          <button
            onClick={handleDirectBook}
            className="w-full md:w-auto px-8 py-3 bg-gold text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all cursor-pointer rounded-none"
          >
            Instant Reservation
          </button>
        </div>
      )}

      {/* Footer view container */}
      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}
