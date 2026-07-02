import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, DollarSign, Calendar, Award, Mail, 
  Compass, PieChart, Heart, Sparkles, Activity, Clock, Shield, Star
} from 'lucide-react';

export default function GourmetAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ chart: string; x: number; y: number; val: string | number; label: string } | null>(null);

  // Simulated datasets for luxury fine-dining metrics
  const revenueData = {
    week: [
      { label: 'Mon', val: 120000 }, { label: 'Tue', val: 145000 }, { label: 'Wed', val: 180000 },
      { label: 'Thu', val: 210000 }, { label: 'Fri', val: 320000 }, { label: 'Sat', val: 450000 }, { label: 'Sun', val: 380000 }
    ],
    month: [
      { label: 'Wk 1', val: 980000 }, { label: 'Wk 2', val: 1240000 }, { label: 'Wk 3', val: 1450000 }, { label: 'Wk 4', val: 1820000 }
    ],
    year: [
      { label: 'Q1', val: 4200000 }, { label: 'Q2', val: 4800000 }, { label: 'Q3', val: 5600000 }, { label: 'Q4', val: 7800000 }
    ]
  };

  const reservationTrends = [
    { day: 'Mon', count: 18 }, { day: 'Tue', count: 24 }, { day: 'Wed', count: 32 },
    { day: 'Thu', count: 45 }, { day: 'Fri', count: 78 }, { day: 'Sat', count: 94 }, { day: 'Sun', count: 68 }
  ];

  const monthlyReservations = [
    { label: 'Jan', count: 320 }, { label: 'Feb', count: 380 }, { label: 'Mar', count: 420 },
    { label: 'Apr', count: 490 }, { label: 'May', count: 460 }, { label: 'Jun', count: 580 }
  ];

  const dailyVisitors = [
    { hr: '12:00', load: 40 }, { hr: '14:00', load: 60 }, { hr: '16:00', load: 25 },
    { hr: '18:00', load: 85 }, { hr: '20:00', load: 100 }, { hr: '22:00', load: 90 }, { hr: '00:00', load: 30 }
  ];

  const customerGrowth = [
    { step: 1, count: 1200, date: 'Jan' },
    { step: 2, count: 1450, date: 'Feb' },
    { step: 3, count: 1820, date: 'Mar' },
    { step: 4, count: 2310, date: 'Apr' },
    { step: 5, count: 2950, date: 'May' },
    { step: 6, count: 3780, date: 'Jun' }
  ];

  const newsletterSubscribers = [
    { m: 'Jan', val: 450 }, { m: 'Feb', val: 580 }, { m: 'Mar', val: 720 },
    { m: 'Apr', val: 890 }, { m: 'May', val: 1100 }, { m: 'Jun', val: 1420 }
  ];

  const eventAttendance = [
    { name: 'Soma Wine Night', pct: 95, color: 'from-gold to-gold-light' },
    { name: 'Sunset Jazz Gala', pct: 100, color: 'from-amber-500 to-yellow-400' },
    { name: 'Monsoon Truffle Debut', pct: 88, color: 'from-green-500 to-emerald-400' },
    { name: 'Chef’s Table Exclusive', pct: 100, color: 'from-red-500 to-rose-400' }
  ];

  const bookingStatus = [
    { label: 'Seated & Served', count: 482, pct: 72, color: 'bg-gold' },
    { label: 'Confirmed Booking', count: 154, pct: 23, color: 'bg-green-400' },
    { label: 'Pending Triage', count: 33, pct: 5, color: 'bg-blue-400' }
  ];

  const reservationSources = [
    { label: 'Official Website', pct: 64, color: 'bg-gold' },
    { label: 'VIP Telephone Line', pct: 18, color: 'bg-white/70' },
    { label: 'Luxury Concierge Network', pct: 12, color: 'bg-white/40' },
    { label: 'Walk-ins & Hotel Desks', pct: 6, color: 'bg-white/10' }
  ];

  const menuCategoryPopularity = [
    { label: 'Signature Seafood', pct: 42, count: '1,240 sold' },
    { label: 'Ancestral Goan Specials', pct: 28, count: '824 sold' },
    { label: 'Portuguese Heritage Plates', pct: 18, count: '530 sold' },
    { label: 'Cellar & Cashew Feni Reserve', pct: 12, count: '354 sold' }
  ];

  const customerSatisfaction = {
    score: 98.4,
    grade: 'Exceptional',
    ratings: [
      { category: 'Flavor Excellence', score: 4.9 },
      { category: 'White-glove Service', score: 4.9 },
      { category: 'Cliffside Ambience', score: 5.0 },
      { category: 'Cellar & Pairings', score: 4.8 }
    ]
  };

  const testimonialsOverview = [
    { label: 'Jan', rating: 4.80 }, { label: 'Feb', rating: 4.82 }, { label: 'Mar', rating: 4.88 },
    { label: 'Apr', rating: 4.92 }, { label: 'May', rating: 4.95 }, { label: 'Jun', rating: 4.98 }
  ];

  // Helper for generating SVG coordinates for spline charts
  const getSplinePath = (data: { val: number }[], width: number, height: number, max: number) => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.val / max) * height;
      return { x, y };
    });

    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Helper for rendering a dynamic statistic counter-up (micro animation)
  const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
    return (
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="font-serif font-light text-2xl tracking-wide text-white"
      >
        {prefix}{value.toLocaleString('en-IN')}{suffix}
      </motion.span>
    );
  };

  const currentRevData = revenueData[selectedPeriod];
  const maxRevenue = Math.max(...currentRevData.map(d => d.val)) * 1.15;
  const splinePath = getSplinePath(currentRevData, 300, 100, maxRevenue);
  const areaPath = splinePath ? `${splinePath} L 300 100 L 0 100 Z` : '';

  return (
    <div className="space-y-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="font-sans text-[9px] text-gold uppercase tracking-[0.3em] font-bold">
              THE RESERVE LEDGER
            </span>
          </div>
          <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
            Gourmet Analytics & Motion Graphs
          </h3>
          <p className="font-sans text-xs text-white/50 font-light">
            Live operations, guest sentiment charts, and financial analytics for The Colaco Hut.
          </p>
        </div>

        {/* Time period switcher */}
        <div className="flex bg-white/[0.03] border border-white/10 p-1 rounded-none font-sans text-[10px] uppercase tracking-widest">
          {(['week', 'month', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1.5 transition-all cursor-pointer ${
                selectedPeriod === p ? 'bg-gold text-charcoal font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bento Grid layout for 12 Premium Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* 1. REVENUE GRAPH (Curved Line Spline Chart with hover tooltips) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1 z-10">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">01 / GROSS REVENUE</span>
              <DollarSign className="w-4 h-4 text-gold" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-[10px] text-gold uppercase tracking-wider font-semibold">INR</span>
              <AnimatedCounter 
                value={selectedPeriod === 'week' ? 1975000 : selectedPeriod === 'month' ? 5490000 : 22400000} 
              />
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="relative h-28 my-4 flex items-end justify-center">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A96A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C8A96A" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Reference Grid lines */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />

              {/* Area under spline */}
              {areaPath && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  d={areaPath}
                  fill="url(#revGrad)"
                />
              )}

              {/* Spline stroke */}
              {splinePath && (
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  d={splinePath}
                  fill="none"
                  stroke="#C8A96A"
                  strokeWidth="2"
                />
              )}

              {/* Hotspots */}
              {currentRevData.map((d, i) => {
                const x = (i / (currentRevData.length - 1)) * 300;
                const y = 100 - (d.val / maxRevenue) * 100;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-charcoal stroke-gold cursor-pointer hover:r-6 hover:fill-gold transition-all"
                      onMouseEnter={(e) => {
                        setHoveredDataPoint({
                          chart: 'rev', x, y,
                          val: `₹${(d.val / 1000).toFixed(0)}k`,
                          label: d.label
                        });
                      }}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive Tooltip */}
            <AnimatePresence>
              {hoveredDataPoint?.chart === 'rev' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-gold text-charcoal font-bold font-sans text-[8px] px-2 py-1 rounded shadow-lg pointer-events-none z-30"
                  style={{ left: hoveredDataPoint.x, bottom: 100 - hoveredDataPoint.y + 12 }}
                >
                  {hoveredDataPoint.label}: {hoveredDataPoint.val}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Revenue trajectory by {selectedPeriod}
          </p>
        </motion.div>

        {/* 2. RESERVATION TRENDS (Spline count of weekly reservations) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">02 / RESERVATION TRENDS</span>
            <div className="flex justify-between items-baseline">
              <AnimatedCounter value={reservationTrends.reduce((acc, c) => acc + c.count, 0)} suffix=" Covers" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>

          <div className="h-28 my-4 flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              {/* Spline representation */}
              <path 
                d={getSplinePath(reservationTrends.map(d => ({ val: d.count })), 300, 100, 100)} 
                fill="none" 
                stroke="#C8A96A" 
                strokeWidth="1.5" 
                className="opacity-40" 
              />
              {/* Main responsive grid dots */}
              {reservationTrends.map((trend, i) => {
                const x = (i / (reservationTrends.length - 1)) * 300;
                const y = 100 - (trend.count / 100) * 100;
                return (
                  <g key={i}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      initial={{ r: 0 }}
                      animate={{ r: 3.5 }}
                      transition={{ delay: i * 0.1 }}
                      className="fill-gold stroke-charcoal stroke-1 hover:r-5 transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredDataPoint({
                        chart: 'trends', x, y, val: `${trend.count} Covers`, label: trend.day
                      })}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>
            <AnimatePresence>
              {hoveredDataPoint?.chart === 'trends' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-gold text-charcoal font-bold font-sans text-[8px] px-2 py-1 rounded shadow-lg pointer-events-none z-30"
                  style={{ left: hoveredDataPoint.x, bottom: 100 - hoveredDataPoint.y + 12 }}
                >
                  {hoveredDataPoint.label}: {hoveredDataPoint.val}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Covers reserved by day of week
          </p>
        </motion.div>

        {/* 3. MONTHLY RESERVATIONS (Animated columns) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">03 / MONTHLY RESERVATIONS</span>
            <div className="flex justify-between items-baseline">
              <AnimatedCounter value={2650} suffix=" Reservations" />
              <Calendar className="w-4 h-4 text-gold" />
            </div>
          </div>

          <div className="h-28 my-4 flex items-end justify-between px-2">
            {monthlyReservations.map((item, i) => {
              const pct = `${(item.count / 600) * 100}%`;
              return (
                <div key={i} className="flex flex-col items-center gap-2 group relative z-10 w-8">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-gold text-charcoal font-sans font-bold text-[8px] px-1.5 py-0.5 rounded shadow-lg transition-all duration-200 pointer-events-none whitespace-nowrap">
                    {item.count} Res
                  </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: pct }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-2 bg-gradient-to-t from-gold/30 to-gold rounded-none hover:bg-white transition-colors" 
                  />
                  <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest font-semibold mt-1">{item.label}</span>
                </div>
              );
            })}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Total active bookings half-yearly
          </p>
        </motion.div>

        {/* 4. DAILY VISITORS (Load curve wave by hour) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">04 / DAILY SEATING LOAD</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-white">Peak Load</span>
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
          </div>

          <div className="h-28 my-4 flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <path 
                d={getSplinePath(dailyVisitors.map(d => ({ val: d.load })), 300, 100, 100)} 
                fill="none" 
                stroke="#C8A96A" 
                strokeWidth="1.5" 
              />
              {dailyVisitors.map((v, i) => {
                const x = (i / (dailyVisitors.length - 1)) * 300;
                const y = 100 - (v.load / 100) * 100;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    className="fill-charcoal stroke-gold hover:fill-gold transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredDataPoint({
                      chart: 'load', x, y, val: `${v.load}% Seating`, label: v.hr
                    })}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  />
                );
              })}
            </svg>
            <AnimatePresence>
              {hoveredDataPoint?.chart === 'load' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-gold text-charcoal font-bold font-sans text-[8px] px-2 py-1 rounded shadow-lg pointer-events-none z-30"
                  style={{ left: hoveredDataPoint.x, bottom: 100 - hoveredDataPoint.y + 12 }}
                >
                  {hoveredDataPoint.label}: {hoveredDataPoint.val}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Seating peak capacity curve (daily)
          </p>
        </motion.div>

        {/* 5. CUSTOMER GROWTH (Cumulative Step Spline Chart) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">05 / ACCUMULATED GUEST REGISTRY</span>
            <div className="flex justify-between items-baseline">
              <AnimatedCounter value={3780} suffix=" Guests" />
              <Users className="w-4 h-4 text-gold" />
            </div>
          </div>

          <div className="h-28 my-4 flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <path 
                d={getSplinePath(customerGrowth.map(d => ({ val: d.count })), 300, 100, 4000)} 
                fill="none" 
                stroke="#C8A96A" 
                strokeWidth="2" 
                strokeDasharray="4 2"
              />
              {customerGrowth.map((cg, i) => {
                const x = (i / (customerGrowth.length - 1)) * 300;
                const y = 100 - (cg.count / 4000) * 100;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-gold stroke-charcoal cursor-pointer"
                    onMouseEnter={() => setHoveredDataPoint({
                      chart: 'growth', x, y, val: `${cg.count} Registered Profiles`, label: cg.date
                    })}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  />
                );
              })}
            </svg>
            <AnimatePresence>
              {hoveredDataPoint?.chart === 'growth' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-gold text-charcoal font-bold font-sans text-[8px] px-2 py-1 rounded shadow-lg pointer-events-none z-30"
                  style={{ left: hoveredDataPoint.x, bottom: 100 - hoveredDataPoint.y + 12 }}
                >
                  {hoveredDataPoint.label}: {hoveredDataPoint.val}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Cumulative luxury diner registry size
          </p>
        </motion.div>

        {/* 6. NEWSLETTER SUBSCRIBERS (Growth Column Bars) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">06 / BRIEFING SUBSCRIBERS</span>
            <div className="flex justify-between items-baseline">
              <AnimatedCounter value={1420} suffix=" Members" />
              <Mail className="w-4 h-4 text-purple-400" />
            </div>
          </div>

          <div className="h-28 my-4 flex items-end justify-between px-1">
            {newsletterSubscribers.map((item, i) => {
              const pct = `${(item.val / 1600) * 100}%`;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 w-8">
                  <motion.div 
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    originY={1}
                    style={{ height: pct }}
                    className="w-1.5 bg-gold" 
                  />
                  <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest font-semibold mt-1">{item.m}</span>
                </div>
              );
            })}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Shore Briefing list monthly growth
          </p>
        </motion.div>

        {/* 7. EVENT ATTENDANCE (Concentric animated radial tracks) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">07 / PRIVATE EVENT CAPACITY</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-white">VIP Suite Fill</span>
              <Compass className="w-4 h-4 text-gold animate-spin-slow" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2 z-10">
            {eventAttendance.map((evt, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-2 flex flex-col justify-between">
                <span className="font-sans text-[8px] text-white/50 truncate uppercase tracking-wider">{evt.name}</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="h-1 w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${evt.pct}%` }}
                      transition={{ duration: 1.2, delay: i * 0.1 }}
                      className="bg-gold h-full"
                    />
                  </div>
                  <span className="font-mono text-[9px] text-gold font-bold">{evt.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-1 leading-relaxed">
            Attendance capacity recorded for VIP gatherings
          </p>
        </motion.div>

        {/* 8. BOOKING STATUS (Arc Ring Breakdown) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">08 / BOOKING ALLOCATION STATUS</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-white">Daily Triage</span>
              <PieChart className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="space-y-2 my-2">
            {bookingStatus.map((status, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px] font-sans">
                  <span className="text-white/70 font-medium flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
                    {status.label}
                  </span>
                  <span className="text-white font-mono font-bold">{status.count} ({status.pct}%)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${status.pct}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${status.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-1 leading-relaxed">
            State distribution of active reservations
          </p>
        </motion.div>

        {/* 9. RESERVATION SOURCES (Custom Horizontal Progress bars) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">09 / RESERVATION CHANNELS</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-white">Source Influx</span>
              <Activity className="w-4 h-4 text-gold animate-pulse" />
            </div>
          </div>

          <div className="space-y-3.5 my-2">
            {reservationSources.map((src, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px] font-sans">
                  <span className="text-white/75 font-medium">{src.label}</span>
                  <span className="text-gold font-bold font-mono">{src.pct}%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${src.pct}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${src.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-1 leading-relaxed">
            Booking origination statistics
          </p>
        </motion.div>

        {/* 10. MENU CATEGORY POPULARITY (Staggered rows with percentage counts) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">10 / GASTRONOMY DEMAND</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-white">Popularity</span>
              <Award className="w-4 h-4 text-gold" />
            </div>
          </div>

          <div className="space-y-3 my-2">
            {menuCategoryPopularity.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[9px] font-sans">
                  <span className="text-white/75 font-medium truncate max-w-[160px]">{cat.label}</span>
                  <span className="text-gold/60 font-medium">{cat.count}</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 1.1, delay: i * 0.08 }}
                    className="bg-gold h-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-1 leading-relaxed">
            Category ordering volume indices
          </p>
        </motion.div>

        {/* 11. CUSTOMER SATISFACTION (CSAT & rating wheel) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">11 / GUEST SATISFACTION INDEX</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-green-400">{customerSatisfaction.score}%</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2 z-10">
            {customerSatisfaction.ratings.map((item, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-2 text-center flex flex-col justify-center">
                <span className="font-sans text-[8px] text-white/40 truncate uppercase tracking-wider">{item.category}</span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                  <span className="font-serif text-xs text-white font-bold">{item.score}</span>
                  <span className="font-sans text-[8px] text-white/30">/ 5</span>
                </div>
              </div>
            ))}
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-1 leading-relaxed">
            Aggregated post-meal guest rating survey (CSAT)
          </p>
        </motion.div>

        {/* 12. TESTIMONIALS OVERVIEW (Ratings timeline average index) */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-charcoal-light border border-white/10 p-6 flex flex-col justify-between h-[300px] relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
          <div className="space-y-1">
            <span className="text-[9px] text-white/50 tracking-widest font-sans uppercase font-bold">12 / MEDIA ACCOLADES TRAJECTORY</span>
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-light text-2xl tracking-wide text-white">4.92 / 5 Avg</span>
              <Award className="w-4 h-4 text-gold animate-pulse" />
            </div>
          </div>

          <div className="h-28 my-4 flex items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <path 
                d={getSplinePath(testimonialsOverview.map(d => ({ val: d.rating })), 300, 100, 5)} 
                fill="none" 
                stroke="#C8A96A" 
                strokeWidth="1.5" 
              />
              {testimonialsOverview.map((item, i) => {
                const x = (i / (testimonialsOverview.length - 1)) * 300;
                const y = 100 - (item.rating / 5) * 100;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    className="fill-charcoal stroke-gold hover:fill-gold transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredDataPoint({
                      chart: 'testimonials_agg', x, y, val: `${item.rating.toFixed(2)} Stars`, label: item.label
                    })}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  />
                );
              })}
            </svg>
            <AnimatePresence>
              {hoveredDataPoint?.chart === 'testimonials_agg' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-gold text-charcoal font-bold font-sans text-[8px] px-2 py-1 rounded shadow-lg pointer-events-none z-30"
                  style={{ left: hoveredDataPoint.x, bottom: 100 - hoveredDataPoint.y + 12 }}
                >
                  {hoveredDataPoint.label}: {hoveredDataPoint.val}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="font-sans text-[8px] text-white/40 uppercase tracking-widest text-center mt-2 leading-relaxed">
            Critical ratings aggregated indices monthly
          </p>
        </motion.div>

      </div>
    </div>
  );
}
