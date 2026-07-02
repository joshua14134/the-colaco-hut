import React, { useState } from 'react';
import { Calendar, Users, Clock, Compass, HelpCircle, Check, Mail, Phone, User, Award, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReservationData } from '../types';

export default function ReservationSection() {
  const [formData, setFormData] = useState<ReservationData>({
    guests: '2 Guests',
    date: '2026-06-30',
    time: '19:00',
    occasion: 'Casual',
    seating: 'indoor',
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const timeOptions = ['12:30', '14:00', '19:00', '20:30', '22:00'];
  const guestOptions = ['2 Guests', '4 Guests', '6 Guests', 'Private Event (8-12)', 'Grand Feast (12+)'];
  const occasionOptions = ['Casual', 'Anniversary', 'Birthday Celebration', 'Business Meeting', 'Romantic Proposal'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeatingSelect = (preference: 'indoor' | 'outdoor') => {
    setFormData(prev => ({
      ...prev,
      seating: preference
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage('Please fill in your name, email, and phone number to secure your table.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingCode(data.bookingCode);
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to record reservation. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting reservation:', err);
      setErrorMessage('Network error. Our reservation systems are currently under maintenance, please call us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Absolute background graphic elements */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwtUFKXnoxqIABbJmXgpxc_b6DG3rLXGRYYGt2pndlDTat6tpeByGoDaThTITQSVrXBVAB6sBf3PSCDY6JMn2MtTdmHcNzIEqvHiYj-XhIJuROr5bcv-F4aqnr3HM8jUe83lcK3VLe0D71bS8_7PdShJj2ngEI0k0S0CvMMXIRFyBk0fSTR7Da9C_klFH5CcS-UvpWIhDQt9mlW5YeBTV-s0Im8LlwP5JPGqFNr5SEyjip1PFElYvBNQ')`
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Left Column: Form elements */}
              <div className="lg:col-span-7 bg-charcoal-light border border-gold/15 p-8 md:p-12 shadow-2xl relative">
                {/* Gold subtle border-accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold" />

                <div className="mb-12">
                  <h2 className="font-serif text-3xl md:text-4xl text-white uppercase tracking-wider font-light">
                    Secure Your Table
                  </h2>
                  <p className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] mt-2 font-semibold">
                    Coastal Noir Gastronomy Experience
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Row 1: Guests & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> GUESTS
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors font-sans text-white/95"
                      >
                        {guestOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-charcoal text-white">{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> DATE
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors font-sans text-white [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Time & Occasion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> TIME
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors font-sans text-white/95"
                      >
                        {timeOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-charcoal text-white">{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-2">
                        <Award className="w-3.5 h-3.5" /> OCCASION
                      </label>
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors font-sans text-white/95"
                      >
                        {occasionOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-charcoal text-white">{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Seating Preferences */}
                  <div className="space-y-3">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5" /> SEATING PREFERENCE
                    </label>
                    <div className="flex gap-6">
                      <button
                        type="button"
                        onClick={() => handleSeatingSelect('indoor')}
                        className={`flex-1 py-3 px-4 border text-center font-sans text-xs uppercase tracking-widest transition-all duration-300 rounded-none ${
                          formData.seating === 'indoor'
                            ? 'bg-gold/10 border-gold text-gold font-semibold'
                            : 'bg-transparent border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        The Velvet Room (Indoor)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSeatingSelect('outdoor')}
                        className={`flex-1 py-3 px-4 border text-center font-sans text-xs uppercase tracking-widest transition-all duration-300 rounded-none ${
                          formData.seating === 'outdoor'
                            ? 'bg-gold/10 border-gold text-gold font-semibold'
                            : 'bg-transparent border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        The Ocean Breeze (Outdoor Deck)
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gold/10 pt-8" />

                  {/* Row 4: Guest Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1">
                        <User className="w-3 h-3" /> FULL NAME
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Eg: Clara Mendes"
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> CONTACT PHONE
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Eg: +91 98221..."
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1">
                        <Mail className="w-3 h-3" /> EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Eg: guest@luxury.com"
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-xs focus:outline-none focus:border-gold transition-colors font-sans placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5" /> SPECIAL REQUESTS / DIETARY RESTRICTIONS
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Please let us know if you have specific dietary restrictions, allergies, or table requests..."
                      rows={3}
                      className="w-full bg-transparent border border-white/10 p-3 text-xs focus:outline-none focus:border-gold transition-all font-sans placeholder:text-white/20 rounded-none resize-none"
                    />
                  </div>

                  {/* Submission Action */}
                  {errorMessage && (
                    <p id="reservation-error" className="text-red-400 text-xs text-center font-sans mb-4">{errorMessage}</p>
                  )}
                  <div className="pt-4 flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4.5 bg-gold text-charcoal font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-white transition-all duration-500 cursor-pointer rounded-none disabled:opacity-50"
                    >
                      {isLoading ? 'Securing Seat...' : 'Confirm Reservation'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Booking Summary */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                <div className="bg-charcoal border border-gold/20 p-8 flex flex-col justify-between h-full space-y-8 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 rounded-full blur-2xl" />

                  <div className="space-y-6">
                    <span className="font-sans text-[10px] text-gold uppercase tracking-widest block border-b border-gold/15 pb-2 font-bold">
                      Your Luxury Ticket
                    </span>

                    <h3 className="font-serif text-2xl uppercase tracking-wide">
                      Reservation Summary
                    </h3>

                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-sans">GUESTS</span>
                        <span className="font-serif text-white uppercase">{formData.guests}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-sans">DATE</span>
                        <span className="font-serif text-white">{formData.date}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-sans">TIME</span>
                        <span className="font-serif text-white">{formData.time} SECURED</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-sans">OCCASION</span>
                        <span className="font-serif text-gold uppercase">{formData.occasion}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-sans">PREFERENCE</span>
                        <span className="font-sans text-white uppercase text-[10px] bg-white/5 px-2 py-0.5 tracking-wider">
                          {formData.seating === 'indoor' ? 'Velvet Room' : 'Ocean Breeze Deck'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gold/20 pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5" />
                      <p className="text-[11px] font-sans text-white/60 leading-relaxed font-light">
                        Tables are held for exactly 15 minutes past the reservation time before being released to waitlists.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5" />
                      <p className="text-[11px] font-sans text-white/60 leading-relaxed font-light">
                        Smart Casual dress code requested. No beach sandals or sportswear in our main dining areas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-2xl mx-auto bg-charcoal-light border border-gold/30 p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
            >
              {/* Subtle light effects */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

              {/* Check Animated Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                  className="w-20 h-20 bg-gold/15 rounded-full border border-gold flex items-center justify-center text-gold"
                >
                  <Check className="w-10 h-10 animate-pulse" />
                </motion.div>
              </div>

              <div className="space-y-4 mb-8">
                <h2 className="font-serif text-3xl md:text-4xl text-white uppercase tracking-wider font-light">
                  Booking Confirmed
                </h2>
                <p className="font-sans text-xs text-gold uppercase tracking-[0.25em]">
                  Your Sanctuary at Vagator Awaits
                </p>
              </div>

              {/* ticket info card */}
              <div className="bg-charcoal p-6 border border-gold/15 space-y-4 max-w-md mx-auto mb-10 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="font-sans text-[10px] text-white/50 tracking-wider">BOOKING REFERENCE</span>
                  <div className="flex items-center gap-1.5 text-gold font-mono text-sm font-semibold">
                    <Ticket className="w-4 h-4" /> {bookingCode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-white/40 block mb-0.5">GUEST NAME</span>
                    <span className="font-serif text-white uppercase text-[13px]">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">PARTY SIZE</span>
                    <span className="font-serif text-white">{formData.guests}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">DATE &amp; TIME</span>
                    <span className="font-serif text-white">{formData.date} @ {formData.time}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block mb-0.5">TABLE SEATING</span>
                    <span className="font-serif text-gold uppercase text-[11px] tracking-wider">
                      {formData.seating === 'indoor' ? 'Velvet Suite' : 'Ocean Breeze'}
                    </span>
                  </div>
                </div>

                {formData.specialRequests && (
                  <div className="border-t border-white/5 pt-3">
                    <span className="text-white/40 block text-[10px] mb-1">SPECIAL INSTRUCTIONS</span>
                    <p className="text-[11px] font-sans text-white/70 italic leading-relaxed">
                      "{formData.specialRequests}"
                    </p>
                  </div>
                )}
              </div>

              <p className="font-sans text-xs text-white/60 max-w-sm mx-auto leading-relaxed mb-8 font-light">
                A formal digital confirmation card with route coordinates, parking details, and dress code specifics has been dispatched to <span className="text-gold font-medium">{formData.email}</span>.
              </p>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    guests: '2 Guests',
                    date: '2026-06-30',
                    time: '19:00',
                    occasion: 'Casual',
                    seating: 'indoor',
                    name: '',
                    phone: '',
                    email: '',
                    specialRequests: ''
                  });
                }}
                className="font-sans text-xs uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-white hover:border-white transition-colors cursor-pointer"
              >
                Secure Another Reservation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
