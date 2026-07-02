import React from 'react';
import { Award, Star, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChefSection() {
  const chefs = [
    {
      name: 'Chef Marcus Colaco',
      role: 'Executive Chef & Founder',
      desc: 'Trained under world-class culinary icons in Lisbon and Paris, Chef Marcus is the creative engine behind our Goan-Portuguese culinary dialogue.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAZUi1RM_BrMmWIyvEyN-swUJDkMcD1r_ZtTWIm4syZcxkfgJtDMq8cDrRkxqUESC73GSKvy3llKnAZN2nTShg404Fi6MuoIFGuC7NzOoAJhlPHa3VYE0p4vWmVHkULjJTCUyceJAqNQ1HN34wZG3_l8wmVElcRGrOYym_WDAVDr6bATFDQmVtLfJnaGaHMycj9ddE3v_pj6J--5EXFIN_njwaQ07FCbiCe1PQM_xOyVg_DzQG2TXBSQ',
      highlights: ['30+ Years Experience', 'Gastronomy Innovator Award', 'Cas Cas Ambassador']
    },
    {
      name: 'Priya Naik',
      role: 'Sous Chef (Konkan Spices)',
      desc: 'An expert in Goan heritage kitchens, Priya ensures our Recheado and Xacuti spice masalas are hand-roasted and stone-ground daily.',
      highlights: ['Konkan Terroir Expert', 'Stone-Grinder Custodian']
    },
    {
      name: 'Joao Santos',
      role: 'Head Pastry Chef (Heritage bakes)',
      desc: 'Trained in classical Porto pâtisseries, Joao combines egg-custard Portuguese methods with local coconut syrup to bake our legendary Bebinca.',
      highlights: ['Bebinca Custard Master', 'Porto Culinary Honors']
    }
  ];

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] font-bold block mb-2">
          Culinary Sovereignty
        </span>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase font-light">
          Meet The <span className="italic text-gold font-normal">Founders &amp; Team</span>
        </h2>
        <div className="w-16 h-[1px] bg-gold/50 mx-auto mt-6" />
      </div>

      {/* Main Executive Chef spotlight card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24 border-b border-gold/10 pb-20">
        {/* Chef Portrait */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -top-8 -left-8 w-44 h-44 border-l-2 border-t-2 border-gold/20" />
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-[4/5] bg-cover bg-center grayscale shadow-2xl border border-gold/15"
            style={{
              backgroundImage: `url('${chefs[0].image}')`
            }}
          />
          <div className="absolute -bottom-6 -right-6 glass-panel p-6 border border-gold/20 text-center">
            <Award className="w-8 h-8 text-gold mx-auto mb-1 animate-pulse" />
            <span className="text-[10px] font-sans tracking-widest text-gold uppercase font-bold">CHEF OF THE YEAR</span>
            <p className="font-serif text-white text-sm mt-0.5">Vagator Guild 2025</p>
          </div>
        </div>

        {/* Chef Bio */}
        <div className="lg:col-span-7 space-y-6">
          <span className="font-sans text-xs text-gold uppercase tracking-[0.2em] font-semibold">
            {chefs[0].role}
          </span>
          <h3 className="font-serif text-3xl md:text-4xl uppercase tracking-wider text-white">
            {chefs[0].name}
          </h3>
          <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed font-light">
            {chefs[0].desc} Chef Marcus returned to his native Vagator shores with a single mission: to prove that traditional Goan coastal cooking possesses the depth and complexity to stand proudly alongside the finest classical cuisines of Europe.
          </p>
          <p className="font-sans text-xs text-white/60 leading-relaxed">
            "Growing up, I watched my grandfather Casimiro cook fresh fish directly on the beach planks using sweet mango wood twigs. He taught me that the ocean is our master, and our task is simply to translate its language through spices."
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {chefs[0].highlights.map((h, i) => (
              <div key={i} className="bg-charcoal-light border border-gold/10 p-4 text-center">
                <Star className="w-4 h-4 text-gold mx-auto mb-2" />
                <span className="font-sans text-[10px] tracking-wider text-white/95 uppercase font-medium">
                  {h}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culinary Team Subsections (Sous & Pastry) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chefs.slice(1).map((chef, idx) => (
          <div key={idx} className="bg-charcoal-light border border-gold/10 p-10 flex flex-col justify-between h-[340px] hover:border-gold/30 transition-all duration-500 relative group">
            <div className="space-y-4">
              <span className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold block">
                {chef.role}
              </span>
              <h4 className="font-serif text-2xl uppercase tracking-wide text-white group-hover:text-gold transition-colors duration-300">
                {chef.name}
              </h4>
              <p className="font-sans text-xs text-white/70 leading-relaxed font-light">
                {chef.desc}
              </p>
            </div>

            <div className="flex gap-4 border-t border-white/5 pt-6 flex-wrap">
              {chef.highlights.map((h, i) => (
                <span key={i} className="text-[9px] font-sans text-gold/80 uppercase tracking-widest bg-white/5 px-2.5 py-1">
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
