import React, { useState } from 'react';
import { ShieldCheck, Mail, Calendar, Compass, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PrivateDining() {
  const [enquiry, setEnquiry] = useState({
    name: '',
    email: '',
    phone: '',
    date: '2026-07-15',
    eventType: 'Anniversary Celebration',
    guests: '8 Guests',
    details: ''
  });
  const [isSent, setIsSent] = useState(false);

  const eventTypes = [
    'Anniversary Celebration',
    'Private Yacht Dinner Pre-Party',
    'Corporate Executive Dinner',
    'Bespoke Birthday Toast',
    'Artisanal Wine Tasting Event'
  ];

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.email || !enquiry.phone) {
      alert('Please fill out your name, contact phone, and email to send the enquiry.');
      return;
    }
    setIsSent(true);
  };

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        {/* Left text column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-gold" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold">
              Curated Exclusivity
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight font-light">
            The Velvet Room: <br />
            <span className="italic text-gold font-normal">Private Dining</span>
          </h2>
          <p className="font-sans text-white/80 leading-relaxed text-sm md:text-base font-light">
            For moments that demand absolute discretion and customized grandeur. Our oceanfront private suite, The Velvet Room, accommodates up to 12 esteemed guests for bespoke fine dining celebrations.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-gold mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-sm uppercase tracking-wider text-white font-semibold">Dedicated Concierge Butler</h4>
                <p className="text-xs text-white/60 mt-1">A dedicated white-glove hospitality specialist caters entirely to your party’s requirements throughout the evening.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="w-5 h-5 text-gold mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-sm uppercase tracking-wider text-white font-semibold">Bespoke 9-Course Tasting Menu</h4>
                <p className="text-xs text-white/60 mt-1">Chef Marcus Colaco will collaborate with you to create a personalized menu reflecting specific preferences or allergies.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right picture column with capacity badge */}
        <div className="lg:col-span-7 relative">
          <div className="w-full aspect-[16/10] overflow-hidden shadow-2xl border border-gold/15">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLXy-gcQGKOad3tnERIU99uZ3eU81QfL3wLAJuG50rej_JzA72wTRv9qFLFW-LgXZlXy3rgGjM63fsmHT-wsezrHhvjVSUjF93HUZAI0Ylq0_AFI44VQD20IhOyZ-nRy2NROOpOLWO9ksPTt7d1_juhC2JwU1errLq1HOBceBYbYwY03MGowS7samPI3_8DijB0v2Fdpd0ExBVcCYa855wqVDqCr3pLnqKGgRW2tS0pa6OztYXQngNHQ"
              alt="The Velvet Room high-end table setup"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-charcoal-light border border-gold/20 p-6 hidden md:block">
            <p className="font-sans text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">SUITE CAPACITY</p>
            <p className="font-serif text-lg text-white mt-1">6 to 12 Guests</p>
          </div>
        </div>
      </div>

      {/* Enquiry Form Box */}
      <div className="bg-charcoal-light border border-gold/15 p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="enquiry-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h3 className="font-serif text-2xl md:text-3xl tracking-wide uppercase">Enquire Privately</h3>
                <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-1">Direct Line to our VIP Hospitality Desk</p>
              </div>

              <form onSubmit={handleEnquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">YOUR FULL NAME</label>
                    <input
                      type="text"
                      value={enquiry.name}
                      onChange={(e) => setEnquiry(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={enquiry.email}
                      onChange={(e) => setEnquiry(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Eg: host@michelin.com"
                      className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">TELEPHONE CONTACT</label>
                    <input
                      type="tel"
                      value={enquiry.phone}
                      onChange={(e) => setEnquiry(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Eg: +91 98221..."
                      className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">EVENT DATE</label>
                    <input
                      type="date"
                      value={enquiry.date}
                      onChange={(e) => setEnquiry(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans [color-scheme:dark]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">CELEBRATION TYPE</label>
                    <select
                      value={enquiry.eventType}
                      onChange={(e) => setEnquiry(prev => ({ ...prev, eventType: e.target.value }))}
                      className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans text-white/95"
                    >
                      {eventTypes.map(type => (
                        <option key={type} value={type} className="bg-charcoal text-white">{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">ADDITIONAL NOTES / SPECIFIC REQUESTS</label>
                    <input
                      type="text"
                      value={enquiry.details}
                      onChange={(e) => setEnquiry(prev => ({ ...prev, details: e.target.value }))}
                      placeholder="E.g. Pre-flight champagne requests, rare seafood options..."
                      className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-charcoal transition-all"
                  >
                    Submit Suite Enquiry
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="enquiry-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-16 h-16 mx-auto bg-gold/15 rounded-full flex items-center justify-center text-gold border border-gold">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-2xl text-white uppercase tracking-wider">Suite Proposal Sent</h4>
                <p className="font-sans text-xs text-gold uppercase tracking-widest">A Concierge Specialist Will Contact You Within 2 Hours</p>
              </div>
              <p className="font-sans text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                Thank you, {enquiry.name}. We have logged your request for the <span className="text-gold font-medium">{enquiry.eventType}</span> on {enquiry.date}. Our direct reservation line remains at your service.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="font-sans text-xs uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-white transition-colors"
              >
                Send Another Enquiry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
