import React, { useState } from 'react';
import { Compass, BookOpen, Star, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const timelineItems = [
    {
      year: '1968',
      title: 'The Coastal Shack',
      description: 'Grandfather Casimiro Colaco sets up a modest four-table wooden shack on Vagator shore, cooking fresh calamari and kingfish directly over local teak wood fire pits.'
    },
    {
      year: '1994',
      title: 'The Lisbon Journey',
      description: 'Marcus Colaco travels to Lisbon to study classical European culinary arts. Upon returning, he integrates French-Portuguese reduction methods into classical Goan fish masalas.'
    },
    {
      year: '2012',
      title: 'The Heritage Brick',
      description: 'The modest shack is redesigned into a breathtaking stone structure using red laterite stone from local quarries, establishing North Goa’s finest secret fine-dining hideaway.'
    },
    {
      year: '2024',
      title: 'The Luxury Reserve',
      description: 'The Colaco Hut undergo a complete master transformation: incorporating panoramic floor-to-ceiling glass, floating seaside lounges, and a state-of-the-art climate cellar.'
    }
  ];

  return (
    <section className="bg-charcoal text-white py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Narrative Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-gold" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold">
              Our Ancestral Roots
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight font-light">
            Goan Traditions, <br />
            <span className="italic text-gold font-normal">Portuguese Heritage</span>
          </h2>
          <p className="font-sans text-white/80 leading-relaxed text-sm md:text-base font-light">
            Perched elegantly on the high cliffs of Vagator, The Colaco Hut represents a seamless dialogue between ocean currents and ancestral cookery. Our foundations are built on two distinct culinary currents: the vibrant, fire-roasted coconut masalas of the Konkan coast, and the rich, slow-braised wine reductions of classical Lisbon gastronomy.
          </p>
          <p className="font-sans text-white/60 leading-relaxed text-sm">
            Every day, local fishermen drop their anchoring nets at dawn directly below our kitchen, bringing us fresh giant tiger prawns, local mud crabs, and ocean scallops. We treat this harvest with absolute reverence, cooking over native open charcoal grates and serving with curated vintage Portuguese ports.
          </p>

          {/* Philosophy quotes */}
          <div className="border-l-2 border-gold pl-6 py-2 italic text-white/90 text-sm font-serif max-w-xl">
            "A fine meal is an act of geographic storytelling. We do not just cook; we preserve the ocean winds, the woodfires, and the heritage clay pots of Vagator."
            <span className="block text-xs font-sans text-gold/80 uppercase tracking-widest mt-2 not-italic font-bold">
              — Chef Marcus Colaco
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 border-l border-t border-gold/20" />
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-[4/5] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDR0ytlYarh6uZsiXT-zNXCpmsGzwi1Qw1u81IKTPrEc1yIumziNeNr7YF5vjEQtoogeo2V1TeQc9hEkPeFNOPEYy3qtBQQYsCgP22bk07JipBZ76gw5O_AKNQmgv5_d4o6kerm0zcTYjR0SvP2cgS0pJRvR-7vDYAivN8fozgkSGp0KThj4H7d_IuxwY3speO9tS76ClUNG1bN4oSPANCQupInULVR3PmgEtW4pDJqGdCFwhQSgek_zw')`
            }}
          />
          <div className="absolute -bottom-6 -right-6 glass-panel p-6 border border-gold/20">
            <h4 className="font-serif text-sm tracking-widest text-gold uppercase font-bold">Aman-level Design</h4>
            <p className="text-[10px] font-sans text-white/60 mt-1 uppercase tracking-widest">Architectural Teak & Stone</p>
          </div>
        </div>
      </div>

      {/* Philosophy Three-Pillars Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div className="bg-charcoal-light border border-gold/15 p-10 flex flex-col justify-between h-[320px] hover:border-gold/50 transition-colors duration-500">
          <div>
            <Compass className="w-8 h-8 text-gold mb-6" />
            <h3 className="font-serif text-xl mb-4 tracking-wide text-white uppercase">The Territory</h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed font-light">
              We sourcing exclusively within a 25-kilometer radius. Our mud crabs are caught in backwater estuaries, and spices are stone-ground daily.
            </p>
          </div>
          <span className="text-[10px] font-sans tracking-widest text-gold/60 uppercase">01 / LOCAL TERROIR</span>
        </div>

        <div className="bg-charcoal-light border border-gold/15 p-10 flex flex-col justify-between h-[320px] hover:border-gold/50 transition-colors duration-500">
          <div>
            <BookOpen className="w-8 h-8 text-gold mb-6" />
            <h3 className="font-serif text-xl mb-4 tracking-wide text-white uppercase">The Lineage</h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed font-light">
              We preserve family secrets, such as the 48-hour toddy vinegar pork belly marination, and layered Bebinca custard cakes.
            </p>
          </div>
          <span className="text-[10px] font-sans tracking-widest text-gold/60 uppercase">02 / HERITAGE METRIC</span>
        </div>

        <div className="bg-charcoal-light border border-gold/15 p-10 flex flex-col justify-between h-[320px] hover:border-gold/50 transition-colors duration-500">
          <div>
            <Star className="w-8 h-8 text-gold mb-6" />
            <h3 className="font-serif text-xl mb-4 tracking-wide text-white uppercase">The Perfection</h3>
            <p className="font-sans text-xs text-white/70 leading-relaxed font-light">
              Premium marble table setups, temperature-controlled glassware, and personalized white-glove beach resort butler hospitality.
            </p>
          </div>
          <span className="text-[10px] font-sans tracking-widest text-gold/60 uppercase">03 / UNCOMPROMISING LUXURY</span>
        </div>
      </div>

      {/* Heritage Timeline Section */}
      <div className="border-t border-gold/15 pt-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h3 className="font-serif text-2xl md:text-3xl tracking-wider uppercase text-white">Lineage Timeline</h3>
          <p className="font-sans text-xs text-gold/70 uppercase tracking-widest mt-2">A Half-Century Culinary Voyage</p>
        </div>

        {/* Timeline selector tabs */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-12 mb-12 border-b border-white/5 pb-6">
          {timelineItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTimeline(index)}
              className={`font-sans text-sm md:text-lg tracking-widest transition-all duration-300 pb-2 border-b-2 uppercase ${
                activeTimeline === index 
                  ? 'text-gold border-gold font-semibold scale-105' 
                  : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* Timeline card */}
        <div className="bg-charcoal-light border border-gold/10 p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Calendar className="w-32 h-32 text-gold" />
          </div>
          <motion.div
            key={activeTimeline}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="font-serif text-gold text-2xl tracking-widest block">
              {timelineItems[activeTimeline].year}
            </span>
            <h4 className="font-serif text-xl md:text-2xl text-white uppercase tracking-wider">
              {timelineItems[activeTimeline].title}
            </h4>
            <p className="font-sans text-sm text-white/75 leading-relaxed font-light max-w-2xl">
              {timelineItems[activeTimeline].description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
