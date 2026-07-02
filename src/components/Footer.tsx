import React, { useState } from 'react';
import { Mail, Compass, HelpCircle, ArrowUp, Send, Check } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleLinkClick = (viewId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-charcoal border-t border-gold/15 py-16 px-6 md:px-12 text-white/50 text-xs mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left column: Brand logo */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h2 className="font-serif text-2xl tracking-[0.2em] text-white uppercase font-bold">
            THE COLACO HUT
          </h2>
          <p className="font-sans text-[10px] tracking-[0.3em] text-gold uppercase mt-1 font-semibold">
            Vagator Beach Road, Goa
          </p>
          <p className="font-sans text-[11px] text-white/60 leading-relaxed font-light max-w-xs">
            An award-winning sanctuary of Goan coastal history, Portuguese lineage, and five-star culinary artistry.
          </p>
        </div>

        {/* Center: Quick navigation links */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8 text-left">
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold">The House</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick('home', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  The Experience
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleLinkClick('about', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Heritage Chronicle
                </a>
              </li>
              <li>
                <a 
                  href="#menu" 
                  onClick={(e) => handleLinkClick('menu', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Gourmet Menu
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleLinkClick('gallery', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Media Gallery
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold">Inquiries</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#private-dining" 
                  onClick={(e) => handleLinkClick('private-dining', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Private Suite
                </a>
              </li>
              <li>
                <a 
                  href="#reservation" 
                  onClick={(e) => handleLinkClick('reservation', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Secure Seating
                </a>
              </li>
              <li>
                <a 
                  href="#careers" 
                  onClick={(e) => handleLinkClick('careers', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Join Culinary Team
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={(e) => handleLinkClick('contact', e)} 
                  className="hover:text-gold transition-colors font-sans text-[11px] font-medium"
                >
                  Hours &amp; FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: Editorial Newsletter Subscription */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h4 className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold">The Cas Cas Gazette</h4>
          <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
            Subscribe to receive exclusive invitations to Chef’s Port dinners, recipe booklets, and new wine landing alerts.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="flex border-b border-gold/30 pb-1 items-center">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                className="w-full bg-transparent text-xs py-1.5 font-sans uppercase tracking-widest text-white placeholder:text-white/25 focus:outline-none"
              />
              <button type="submit" className="p-1 hover:text-gold transition-colors" aria-label="Subscribe">
                <Send className="w-3.5 h-3.5 text-gold" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-gold text-xs font-sans tracking-wider uppercase font-semibold animate-fade-in-up">
              <Check className="w-4 h-4" /> Subscribed successfully
            </div>
          )}
        </div>
      </div>

      {/* Bottom Fine Print bar */}
      <div className="max-w-7xl mx-auto border-t border-gold/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-sans text-[10px] tracking-widest uppercase text-white/40">
          © 2026 THE COLACO HUT. ALL RIGHTS RESERVED. CRAFTED WITH UNCOMPROMISING LUXURY IN GOA, INDIA.
        </p>

        <button 
          onClick={handleScrollTop}
          className="flex items-center gap-2 border border-gold/15 px-3 py-1.5 hover:border-gold text-gold hover:text-white transition-all text-[10px] uppercase font-sans tracking-widest"
          aria-label="Back to top"
        >
          Top <ArrowUp className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
}
