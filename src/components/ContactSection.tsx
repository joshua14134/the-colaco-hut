import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Compass, ChevronDown, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [msgSent, setMsgSent] = useState(false);
  const [msgData, setMsgData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Floating label focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const faqs = [
    {
      q: 'Do you accommodate vegetarian or gluten-free diets?',
      a: 'Absolutely. Our chefs have curated a range of high-fidelity vegetarian entrees, vegetable foogaths, and specific gluten-free thalis. Please specify your requirements when booking so that our kitchen can prepare in advance.'
    },
    {
      q: 'Is there a strict dress code at the restaurant?',
      a: 'We request a Smart Casual dress code in our dining areas. To maintain our editorial coastal ambiance, we kindly request that gentlemen wear long trousers and collared shirts. Athletic wear, beach sandals, and swimwear are strictly prohibited in the evening.'
    },
    {
      q: 'Can I book the entire beachfront patio for events?',
      a: 'Yes, our beach deck and The Velvet Room can be exclusively chartered for private events, corporate banquets, and bespoke weddings. Please submit an enquiry via our Private Dining tab or contact our Event Coordinator directly.'
    },
    {
      q: 'Is parking available on site?',
      a: 'We provide complimentary premium valet parking services for all of our guests directly at the entrance gate of the Vagator Beach Road property.'
    }
  ];

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgData.name || !msgData.email || !msgData.message) {
      setErrorMessage('Please fill out all fields to submit your message.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(msgData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMsgSent(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Error submitting contact message:', err);
      setErrorMessage('Network error. Failed to reach guest relations.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Editorial layout block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
        {/* Left Column: Opening details and Coordinates */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="font-sans text-xs text-gold uppercase tracking-[0.3em] font-bold block">
              Direct Contact
            </span>
            <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wider font-light">
              Location &amp; <span className="italic text-gold font-normal">Contact</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gold mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-sm uppercase text-white tracking-wider font-semibold">Address</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Vagator Beach Road, Red Cliff Estuary, North Goa 403509, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-gold mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-sm uppercase text-white tracking-wider font-semibold">Business Hours</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Lunch Seating: 12:00 PM — 15:30 PM<br />
                  Dinner Seating: 18:30 PM — 23:30 PM<br />
                  Cellar Port Lounge: Open until 1:00 AM (Daily)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-gold mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-sm uppercase text-white tracking-wider font-semibold">Telephone Desk</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Direct Line: +91 832 999 8888<br />
                  VIP Concierge desk: +91 832 999 8812
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Compass className="w-5 h-5 text-gold mt-1 shrink-0" />
              <div>
                <h4 className="font-serif text-sm uppercase text-white tracking-wider font-semibold">Guest Parking</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Complimentary secured valet service is active at our entrance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic message form */}
        <div className="lg:col-span-7 bg-charcoal-light border border-gold/15 p-8 md:p-12 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {!msgSent ? (
              <motion.div
                key="msg-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-2xl uppercase tracking-wider">Send A Direct Message</h3>
                <form onSubmit={handleMessageSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                    {/* Floating Label Input - Name */}
                    <div className="relative border-b border-white/20 focus-within:border-gold py-1.5 transition-all duration-300">
                      <label className={`absolute left-0 transition-all duration-300 font-sans tracking-widest pointer-events-none ${
                        isNameFocused || msgData.name 
                          ? '-top-3.5 text-[8px] text-gold font-bold' 
                          : 'top-2 text-xs text-white/55'
                      }`}>
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        value={msgData.name}
                        onFocus={() => setIsNameFocused(true)}
                        onBlur={() => setIsNameFocused(false)}
                        onChange={(e) => setMsgData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-transparent w-full py-1.5 pt-4 text-xs text-white focus:outline-none font-sans"
                        required
                      />
                    </div>

                    {/* Floating Label Input - Email */}
                    <div className="relative border-b border-white/20 focus-within:border-gold py-1.5 transition-all duration-300">
                      <label className={`absolute left-0 transition-all duration-300 font-sans tracking-widest pointer-events-none ${
                        isEmailFocused || msgData.email 
                          ? '-top-3.5 text-[8px] text-gold font-bold' 
                          : 'top-2 text-xs text-white/55'
                      }`}>
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={msgData.email}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        onChange={(e) => setMsgData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-transparent w-full py-1.5 pt-4 text-xs text-white focus:outline-none font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold">MESSAGE</label>
                    <textarea
                      value={msgData.message}
                      onChange={(e) => setMsgData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Write your suggestions, complaints, or inquiries..."
                      rows={4}
                      className="bg-transparent border border-white/10 p-4 text-xs focus:outline-none focus:border-gold transition-all font-sans placeholder:text-white/20 rounded-none resize-none focus:ring-1 focus:ring-gold/25"
                      required
                    />
                  </div>

                  {errorMessage && (
                    <p id="contact-error" className="text-red-400 text-xs text-center font-sans">{errorMessage}</p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4.5 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-charcoal" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <span>Submit Message</span>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="msg-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                {/* Sprung Success checkmark */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center text-gold border border-gold"
                  >
                    <Check className="w-8 h-8" />
                  </motion.div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl uppercase tracking-wider text-white">Message Logged</h4>
                  <p className="font-sans text-xs text-gold uppercase tracking-widest">Our Hospitality Director will respond shortly</p>
                </div>
                
                <p className="font-sans text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                  Thank you, {msgData.name}. We have received your feedback and dispatched an acknowledgment copy to {msgData.email}.
                </p>
                
                <button
                  onClick={() => {
                    setMsgSent(false);
                    setMsgData({ name: '', email: '', message: '' });
                  }}
                  className="px-8 py-3 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all cursor-pointer rounded-none"
                >
                  Write Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Frequently Asked Questions FAQ Accordion */}
      <div className="border-t border-gold/10 pt-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="font-serif text-2xl md:text-3xl tracking-wide uppercase">Frequently Asked Questions</h3>
          <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-1">Vagator fine-dining guidelines</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="border border-gold/10 bg-charcoal-light">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="font-serif text-sm md:text-base text-white uppercase tracking-wide">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="p-6 pt-0 border-t border-white/5 font-sans text-xs md:text-sm text-white/70 leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
