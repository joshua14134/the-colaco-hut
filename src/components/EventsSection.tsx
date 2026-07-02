import React from 'react';
import { Calendar, Clock, Sparkles, MapPin, Music, Utensils, Wine } from 'lucide-react';
import { motion } from 'motion/react';

export default function EventsSection() {
  const events = [
    {
      id: 'event-1',
      title: 'Jazz & Shellfish Soirée',
      icon: <Music className="w-8 h-8 text-gold" />,
      date: 'Every Thursday Evening',
      time: '19:30 onwards',
      price: '3,500 PP',
      desc: 'Savor an evening of coastal cool on our starlit teak deck. Features live smooth jazz saxophone, grilled giant prawns, fresh oysters, and complimentary premium Portuguese ports.'
    },
    {
      id: 'event-2',
      title: 'Chef’s Table Masterclass',
      icon: <Utensils className="w-8 h-8 text-gold" />,
      date: 'Bi-Monthly Saturday',
      time: '12:00 - 15:30',
      price: '5,500 PP',
      desc: 'An intimate culinary masterclass limited to exactly 6 guests. Join Chef Marcus Colaco as he demonstrates ancient Konkan stone-grinding, slow-braising of pork belly, and multi-layer Bebinca plating.'
    },
    {
      id: 'event-3',
      title: 'Alentejo Wine Chronicles',
      icon: <Wine className="w-8 h-8 text-gold" />,
      date: 'First Monday of July',
      time: '20:00 - 23:00',
      price: '8,500 PP',
      desc: 'An exclusive 7-course seafood banquet curated alongside Clara Mendes. Each course is paired with rare white and red vintages sourced from the Herdade do Esporão estate in Alentejo.'
    }
  ];

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Narrative block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16 border-b border-gold/10 pb-12">
        <div className="lg:col-span-8">
          <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] block mb-2 font-bold">
            Curated Occasions
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase font-light leading-tight">
            Seaside Events &amp; <br />
            <span className="italic text-gold font-normal">Celebrations</span>
          </h2>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
            We transform ordinary evenings into extraordinary visual and acoustic memories. Explore our weekly jazz sessions, masterclasses, and port tastings.
          </p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {events.map((evt, index) => (
          <div key={evt.id} className="bg-charcoal-light border border-gold/10 p-8 flex flex-col justify-between h-[420px] hover:border-gold/30 hover:shadow-[0_12px_40px_rgba(200,169,106,0.05)] transition-all duration-500 relative overflow-hidden group">
            {/* Top gold line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-all" />

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 border border-gold/10 bg-charcoal group-hover:bg-gold/5 transition-colors">
                  {evt.icon}
                </div>
                <div className="text-right">
                  <span className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold block">ADMISSION</span>
                  <span className="font-serif text-sm text-white font-semibold">INR {evt.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl uppercase tracking-wider text-white group-hover:text-gold transition-colors duration-300">
                  {evt.title}
                </h3>
                <div className="flex flex-col gap-1 text-[11px] font-sans text-white/50 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-gold" /> {evt.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gold" /> {evt.time}</span>
                </div>
              </div>

              <p className="font-sans text-xs text-white/70 leading-relaxed font-light line-clamp-4">
                {evt.desc}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 text-center">
              <a
                href="#reservation-bar"
                className="text-[10px] font-sans text-gold group-hover:text-white uppercase tracking-widest block transition-colors duration-300 font-semibold"
              >
                Inquire For Seating →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
