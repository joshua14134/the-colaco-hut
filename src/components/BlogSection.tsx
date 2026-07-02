import React, { useState, useRef } from 'react';
import { Calendar, User, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { luxuryBlogPosts } from '../data/blog';
import { BlogPost } from '../types';

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Real scroll percent tracking inside the modal container
  const handleModalScroll = () => {
    if (modalContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalContainerRef.current;
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable > 0) {
        setScrollPercent((scrollTop / totalScrollable) * 100);
      } else {
        setScrollPercent(0);
      }
    }
  };

  return (
    <section className="bg-charcoal text-white py-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 border-b border-gold/10 pb-12">
        <div className="md:col-span-8">
          <span className="font-sans text-[10px] text-gold uppercase tracking-[0.3em] block mb-2 font-bold">
            The Culinary Chronicles
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase font-light leading-tight">
            Goan Recipes &amp; <br />
            <span className="italic text-gold font-normal">Chef Insights</span>
          </h2>
        </div>
        <div className="md:col-span-4 md:text-right">
          <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
            Step behind the red stone arches of our kitchen. Chef Marcus Colaco discusses fermentation, slow roasting, and coastal pairing.
          </p>
        </div>
      </div>

      {/* Blog Cards Grid with staggered entry and lift animation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {luxuryBlogPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, borderColor: 'rgba(200, 169, 106, 0.45)', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }}
            onClick={() => {
              setSelectedPost(post);
              setScrollPercent(0); // reset progress on mount
            }}
            className="bg-charcoal-light border border-gold/10 p-8 flex flex-col justify-between h-[360px] transition-all duration-300 cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-sans tracking-wider text-gold font-semibold uppercase">
                <span>{post.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gold" /> {post.readTime}</span>
              </div>

              <h3 className="font-serif text-xl uppercase tracking-wide text-white group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-snug">
                {post.title}
              </h3>

              <p className="font-sans text-xs text-white/60 leading-relaxed line-clamp-4 font-light">
                {post.excerpt}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[11px] font-sans text-white/50">
              <span className="flex items-center gap-1.5 uppercase font-semibold"><User className="w-3 h-3 text-gold" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Blog Reader Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-black/92 z-[100] backdrop-blur-md"
            />

            {/* Content box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 25, x: '-50%', yOffset: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.96, y: 25, x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] md:w-[700px] bg-charcoal-light border border-gold/30 z-[110] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[80vh]"
              onScroll={handleModalScroll}
              ref={modalContainerRef}
            >
              {/* Reading Progress Indicator Bar at top */}
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-white/10 z-[120]">
                <div 
                  className="h-full bg-gold transition-all duration-75" 
                  style={{ width: `${scrollPercent}%` }} 
                />
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-2 border border-gold/10 hover:border-gold/40 text-gold hover:text-white transition-colors cursor-pointer rounded-none"
                aria-label="Close article"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 pt-4">
                <div className="flex justify-between text-[10px] font-sans tracking-widest text-gold uppercase font-bold border-b border-gold/15 pb-2">
                  <span>{selectedPost.category} CHRONICLE</span>
                  <span>{selectedPost.readTime} READ</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wider font-light leading-tight">
                  {selectedPost.title}
                </h3>

                <div className="flex gap-4 text-xs font-sans text-white/50">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-gold" /> BY {selectedPost.author.toUpperCase()}</span>
                  <span>•</span>
                  <span>PUBLISHED ON {selectedPost.date.toUpperCase()}</span>
                </div>

                <div className="border-t border-white/5 pt-6 text-sm text-white/80 leading-relaxed font-sans font-light space-y-4">
                  <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-gold first-letter:mr-2.5 first-letter:float-left first-letter:font-normal first-letter:leading-none">
                    {selectedPost.content}
                  </p>
                  <p className="italic text-white/60 text-xs border-l border-gold pl-4 mt-6">
                    Disclaimer: This article belongs to the Goan-Portuguese archives of The Colaco Hut family estate. Traditional methods require slow-braising and authentic unrefined spices.
                  </p>
                </div>

                <div className="pt-8 border-t border-gold/10 flex justify-end">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-8 py-3 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all cursor-pointer rounded-none"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
