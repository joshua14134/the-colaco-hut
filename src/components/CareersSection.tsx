import React, { useState } from 'react';
import { Briefcase, Clock, Shield, Star, Check, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareerPosition } from '../types';

export default function CareersSection() {
  const [selectedRole, setSelectedRole] = useState<CareerPosition | null>(null);
  const [applyData, setApplyData] = useState({
    name: '',
    email: '',
    experience: '2-4 Years',
    portfolio: '',
    coverLetter: ''
  });
  const [isApplied, setIsApplied] = useState(false);

  const roles: CareerPosition[] = [
    {
      id: 'role-1',
      title: 'Senior Pastry Demi-Chef',
      department: 'Culinary',
      type: 'Full-Time',
      experienceRequired: '4+ Years classical training',
      description: 'Join Joao Santos in crafting layered Bebinca custards and Serra Dura sawdust puddings. Strong background in sugar art, yeast fermentation, and old-world Portuguese desserts required.'
    },
    {
      id: 'role-2',
      title: 'Sommelier Butler',
      department: 'Beverage',
      type: 'Full-Time',
      experienceRequired: '2+ Years in michelin environments',
      description: 'Provide pristine white-glove wine and port hospitality to esteemed guests in The Velvet Room. Extensive knowledge of Douro reds, Madeira, and local premium aged feni is essential.'
    },
    {
      id: 'role-3',
      title: 'Chef de Partie (Shellfish & Grills)',
      department: 'Culinary',
      type: 'Full-Time',
      experienceRequired: '3+ Years handling ocean seafood',
      description: 'Manage our open beachfront firewood and charcoal clay ovens. Demands extreme temperature control precision, seasoning mastery, and respect for our early dawn landings.'
    }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyData.name || !applyData.email) {
      alert('Please provide your name and email address to apply.');
      return;
    }
    setIsApplied(true);
  };

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Editorial Title */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] font-bold block mb-2">
          Join our Legacy
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-wide uppercase font-light">
          Hospitality <span className="italic text-gold font-normal">Careers</span>
        </h2>
        <div className="w-16 h-[1px] bg-gold/50 mx-auto mt-6" />
        <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed mt-4 font-light">
          We train to uncompromising standards of Michelin fine dining and five-star coastal hospitality. Explore our open positions at Vagator.
        </p>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-charcoal-light border border-gold/10 p-8 flex flex-col justify-between h-[380px] hover:border-gold/30 hover:shadow-2xl transition-all duration-500 relative"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-sans tracking-widest text-gold uppercase font-bold">
                <span>{role.department} DEP</span>
                <span className="bg-white/5 px-2.5 py-0.5">{role.type}</span>
              </div>

              <h3 className="font-serif text-xl uppercase tracking-wider text-white">
                {role.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-white/50 font-sans">
                <Shield className="w-3.5 h-3.5 text-gold" /> {role.experienceRequired}
              </div>

              <p className="font-sans text-xs text-white/70 leading-relaxed font-light line-clamp-4">
                {role.description}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <button
                onClick={() => {
                  setSelectedRole(role);
                  setIsApplied(false);
                }}
                className="w-full py-3 bg-transparent border border-gold/25 hover:bg-gold hover:text-charcoal text-gold font-sans text-xs uppercase tracking-widest font-semibold transition-all"
              >
                Apply For Position
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application overlay modal */}
      <AnimatePresence>
        {selectedRole && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRole(null)}
              className="fixed inset-0 bg-black/90 z-[100] backdrop-blur-md"
            />

            {/* Form box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] bg-charcoal-light border border-gold/30 z-[110] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute top-6 right-6 p-2 border border-gold/10 hover:border-gold/45 text-gold hover:text-white transition-colors"
                aria-label="Close application form"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {!isApplied ? (
                  <motion.div
                    key="apply-inputs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-gold/15 pb-4">
                      <span className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold">APPLICATION FORM</span>
                      <h3 className="font-serif text-2xl text-white uppercase tracking-wider mt-1">
                        {selectedRole.title}
                      </h3>
                      <p className="font-sans text-xs text-white/50 mt-1 uppercase tracking-widest">{selectedRole.department} Department</p>
                    </div>

                    <form onSubmit={handleApplySubmit} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">YOUR FULL NAME</label>
                        <input
                          type="text"
                          value={applyData.name}
                          onChange={(e) => setApplyData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Eg: Arthur Sinclair"
                          className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">EMAIL ADDRESS</label>
                        <input
                          type="email"
                          value={applyData.email}
                          onChange={(e) => setApplyData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Eg: hospitality@pro.com"
                          className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">RELEVANT EXPERIENCE</label>
                        <select
                          value={applyData.experience}
                          onChange={(e) => setApplyData(prev => ({ ...prev, experience: e.target.value }))}
                          className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans text-white/95"
                        >
                          <option value="1-3 Years" className="bg-charcoal text-white">1 - 3 Years</option>
                          <option value="4-6 Years" className="bg-charcoal text-white">4 - 6 Years</option>
                          <option value="7+ Years" className="bg-charcoal text-white">7+ Years Masters</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">LINK TO LINKEDIN / PORTFOLIO</label>
                        <input
                          type="url"
                          value={applyData.portfolio}
                          onChange={(e) => setApplyData(prev => ({ ...prev, portfolio: e.target.value }))}
                          placeholder="https://linkedin.com/in/username"
                          className="bg-transparent border-b border-white/20 py-2 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold">BRIEF COVER STATEMENT</label>
                        <textarea
                          value={applyData.coverLetter}
                          onChange={(e) => setApplyData(prev => ({ ...prev, coverLetter: e.target.value }))}
                          placeholder="Tell us about your passion for Goan gastronomy and wine..."
                          rows={3}
                          className="bg-transparent border border-white/10 p-3 text-xs focus:outline-none focus:border-gold transition-all font-sans placeholder:text-white/20 rounded-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Send Application Portfolio
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="apply-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gold/15 rounded-full flex items-center justify-center text-gold border border-gold">
                      <Check className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl text-white uppercase tracking-wider">Application Logged</h4>
                      <p className="font-sans text-xs text-gold uppercase tracking-widest">Our Talent Director Will Reach Out Within 48 Hours</p>
                    </div>
                    <p className="font-sans text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                      Thank you, {applyData.name}. We have logged your application for the <span className="text-gold font-medium">{selectedRole.title}</span>. A copy of your details has been dispatched to {applyData.email}.
                    </p>
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="px-8 py-3 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all"
                    >
                      Close Form
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
