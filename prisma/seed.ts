import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const gourmetMenu = [
  // STARTERS
  {
    id: 'starter-1',
    name: 'Crispy Fried Calamari',
    category: 'starters',
    price: 950,
    description: 'Tender ocean squid rings, semolina crusted, flash-fried and served with a spiced peri-peri aioli and charred Lisbon lemon.',
    recommended: true,
    bestSeller: false,
    seasonal: false,
    spicyLevel: 1
  },
  {
    id: 'starter-2',
    name: 'Fofos de Peixe',
    category: 'starters',
    price: 850,
    description: 'Traditional Portuguese-style fish croquettes, minced local kingfish, fresh ginger, cracked pepper, and aromatic coriander.',
    recommended: false,
    bestSeller: true,
    seasonal: false,
    spicyLevel: 1
  },
  {
    id: 'starter-3',
    name: 'Prawn Rissois',
    category: 'starters',
    price: 1100,
    description: 'Creamy local prawn-filled golden empanadas, hand-folded, crumbed, and deep-fried to absolute buttery perfection.',
    recommended: true,
    bestSeller: false,
    seasonal: false,
    spicyLevel: 0
  },
  {
    id: 'starter-4',
    name: 'Melted Goat Cheese Tartlet',
    category: 'starters',
    price: 890,
    description: 'Flaky pastry filled with caramelized red onions, roasted walnuts, artisanal Goan goat cheese, and a drizzle of local wild honey.',
    recommended: false,
    bestSeller: false,
    seasonal: true,
    spicyLevel: 0
  },

  // SEAFOOD SIGNATURES
  {
    id: 'seafood-1',
    name: 'Stuffed Mud Crabs',
    category: 'seafood',
    price: 2400,
    description: 'Succulent fresh backwater mud crabs, slow-cooked in a complex traditional Recheado red masala, finished with organic coconut milk.',
    recommended: true,
    bestSeller: false,
    seasonal: false,
    spicyLevel: 2
  },
  {
    id: 'seafood-2',
    name: 'Giant Tiger Prawns',
    category: 'seafood',
    price: 3200,
    description: 'Plump butter-flashed giant prawns, tossed with roasted garlic, local Kokum extract, and finished with house-made bird’s eye chili oil.',
    recommended: false,
    bestSeller: true,
    seasonal: false,
    spicyLevel: 2
  },
  {
    id: 'seafood-3',
    name: 'Saffron Butter-Poached Lobster',
    category: 'seafood',
    price: 4500,
    description: 'Premium whole Goan lobster slowly poached in rich clarified butter infused with Kashmiri saffron, presented with a sea-salt froth.',
    recommended: false,
    bestSeller: false,
    seasonal: true,
    spicyLevel: 0
  },
  {
    id: 'seafood-4',
    name: 'Vagator Sea Scallops',
    category: 'seafood',
    price: 2100,
    description: 'Pan-seared Atlantic scallops rested on a velvet smooth green pea and mint purée, topped with dehydrated blood orange zest.',
    recommended: true,
    bestSeller: false,
    seasonal: false,
    spicyLevel: 0
  },

  // GOAN SPECIALTIES
  {
    id: 'goan-1',
    name: 'Exquisite Seafood Thali',
    category: 'goan',
    price: 1450,
    description: 'A grand coastal banquet: Semolina kingfish fry, signature spiced prawn curry, tisreo (clams) sukkiem, local vegetable foogath, pickles, and red unpolished parboiled rice.',
    recommended: false,
    bestSeller: true,
    seasonal: false,
    spicyLevel: 2
  },
  {
    id: 'goan-2',
    name: 'Pork Belly Vindaloo',
    category: 'goan',
    price: 1250,
    description: 'Double-cooked pork belly marinated for 48 hours in local coconut feni-distilled toddy vinegar, garlic, ginger, and fierce fiery Goan red chilies.',
    recommended: true,
    bestSeller: false,
    seasonal: false,
    spicyLevel: 3
  }
];

const galleryItems = [
  {
    id: 'gallery-1',
    title: 'The Golden Hour Lounge',
    category: 'atmosphere',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFaw4QpsSBEohvAPjTuLq60QOYvBerUxqdKXM66iZmQ2aDFZjwW6clqz6GjuCo9o4BkuzuEuYNuOAGTzlsy6Eca7y2ThIJoT22RChnxJPVXaeKzx4lCGhkCdNqezO1n_JpnTKr9-QHL3OkmG3UvwKqL0GXSAhNr7w7tqUXMnmZkCTDZPFC6vcLk1aST1awhvHlvBRgWyIfyRwMY9asSnStDcuIvFPxu3kqLqfPBn3-rrnPtjyb0oyShw',
    description: 'A wide-angle interior shot of our luxury beachfront lounge at dusk. Warm amber light casts long shadows on polished dark teak floors, opening out to the infinite Arabian sea.'
  },
  {
    id: 'gallery-2',
    title: 'Ancient Echoes (Goan Heritage)',
    category: 'heritage',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtMQksKQMxwE7uy4xqEpIwLz49wkSqUvjZYARNLcNQoBZhEQ3xeA99b18wL3XjxA_4wgFETX4WUBacz4Y3tKTMj8TlxE7wgAKpQRKTzARrA6zoCOVuHUzxE6jMoLq7DEZ1Lh8LndhjlNDKPkQ2EiRCwdWt7SFvRUynrc6_wjDydqRfTjFnCe3G5ouxw8eqGQUWWD1qRpCyau55th1Wh7Bz2F0q6I9ATYnQcyzTkJt5r1J2FXGOTylxg',
    description: 'A detailed architectural shot where a clean textured wall meets a dark timber ceiling, with fine gold accents illuminated by a minimalist brass sconce.'
  },
  {
    id: 'gallery-3',
    title: 'The Art of Seafood Plating',
    category: 'cuisine',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3MOnjzUN1acSPBjZWofMDJLBMAZ_OSWEbAcYCCavPcIvYopjOidaXFpSHgElMcGPl86vxgkIuRRKdFhrDFAzTLcr5sj49fAvX4LZtVrwQi8fZoKsm7Xy0R671jmgekoyy3jqEjGJrXo0CAaRnvn9GRgyJ2SDUxkMoVkhM5Skg_eihyi-qZK12SN5-hk7JUM3CxaDpLrQguxAIytwSzBqx0EGpPoMv7QYwAHNJ8bsvI5bY03M0HGIo1g',
    description: 'Fresh local catches curated with precision, displaying vibrant colors against matte black custom stoneware under warm spotlighting.'
  },
  {
    id: 'gallery-4',
    title: 'Chef’s Signature Table',
    category: 'cuisine',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCd1EwZBjwrpUfLPZYs_Zs5tT0zmAm--QblwgOuLF254JFQ9pt8pEQOPg79cepgjfzj9zm5f7GqZwFAkrCJqnrUHlOywwhe60yKMR5Hl4loTv9k15EER7cvnCAJxI9fEnjMDnQZiDxD1bKEo_rK-73g5EK_-7k4mx0GB8Y_1FIntZoIRIlsyoe9lrsVK4Ac1k9OZ2mz5CgGzF9JV2O2Z83LLDm5gTnXBhq7RWawzw9jpHGXPKZ5_Or0Q',
    description: 'An editorial tabletop showing off a premium spread of coastal delicacies and fine crystal stemware, framed with natural stone highlights.'
  },
  {
    id: 'gallery-5',
    title: 'Path to Serenity',
    category: 'atmosphere',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQXrCJLbFn1tVzxcTCdUS8OaW79FzjDrWSHMC82dXnerF4_rN9PPRORsjd8kF3cpfwA2qc-G0M80gRD4Rw8CF60hBU60kqCN7u13g5a5wp0bIJN31Khe8KkUjFZzapMXV-0NDzjRl62iO3StpdvBBLXD5bNhn706Gl7ks7TsBIb479jz1LBsU8lrEgCGu1OqcgBvZzbX5Nvh4F4eL73xbqu48z3FQbZruwHI7qU0sGc0ItNSY-CosSvQ',
    description: 'A secluded wooden walkway illuminated by low-profile amber lanterns that leads through whispering palms directly to the tides of Vagator.'
  },
  {
    id: 'gallery-6',
    title: 'Noir Soirée Celebrations',
    category: 'celebrations',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2bSwzx8koyGxje8-xZrF1ljhcFVUBwUnxV4nPlcgbNJLhkSmZFpYNJeWzgxpJKzIUi9z2vm84-zIn1jv7KR0gIGeyOr0vshzaADzZu7CLqeRP16W1LYjAsC6ZzG9Xe4bu6KY3HbtEC3ZIBR2TWkCBfb7ilBivVWf4RTkODhEF2c78KVyXWW3X9eo1bGWJKKMUZPHOxjwAaLYtiiU5KAjZkwm0qSxMuvthDxINbM-5Xq10k-Yi1tTkcg',
    description: 'A premium outdoor cocktail gala by the ocean shore, featuring an elegant sparkling champagne tower reflecting strings of starlight.'
  }
];

const luxuryBlogPosts = [
  {
    id: 'blog-1',
    title: 'The Art of Toddy Vinegar: Goan Fermentation Traditions',
    excerpt: 'How coconut sap harvested from the treetops of Vagator transforms our signature Pork Belly Vindaloo into an unmatched heritage masterpiece.',
    content: 'For centuries, Goan cuisine has been shaped by the rhythmic cycle of the coconut palms. Unlike typical synthetic acids, our kitchen strictly relies on authentic toddy vinegar. Fresh sur (coconut sap) is carefully tapped at dawn, then fermented in traditional clay pots for several months. This slow process develops an incredibly deep, complex acidity with subtle woody undertones. When infused with the dry red Kashmiri chilies for 48 hours, it tenderizes the organic pork belly to create a velvety, sharp, yet harmoniously spiced vindaloo that honors Goan-Portuguese lineage.',
    author: 'Chef Marcus Colaco',
    date: 'June 12, 2026',
    readTime: '6 min read',
    category: 'Heritage'
  },
  {
    id: 'blog-2',
    title: 'Curating the Cellar: Pairing Old World Portuguese Reds with Fresh Bay Seafood',
    excerpt: 'An exclusive guide by our Head Sommelier on bridging Alentejo vineyards with the rich, fiery masalas of the Konkan coast.',
    content: 'Pairing wines with the bold spice profile of authentic Goan food is one of our greatest creative challenges. Traditional rules often break down in the face of fiery Recheados and complex Xacutis. In this editorial, we explore how full-bodied yet refined Portuguese reds—particularly those containing Syrah and Touriga Nacional grapes from the Alentejo region—provide a structured tannins skeleton that complements rich seafood like our Stuffed Mud Crabs. We also highlight why a crisp Marlborough Sauvignon Blanc cuts through the butter-poached saffron lobster to keep your palate beautifully refreshed.',
    author: 'Clara Mendes',
    date: 'May 28, 2026',
    readTime: '8 min read',
    category: 'Wine Pairings'
  },
  {
    id: 'blog-3',
    title: 'The Secret 21-Spice Blend of Chicken Xacuti',
    excerpt: 'We unlock the secret vault of the Colaco family recipes, detailing the slow-roasting of individual spices to achieve absolute depth.',
    content: 'A true Goan Xacuti is not simply a curry; it is an orchestrational symphony of roasted spices. Our culinary team painstakingly measures 21 individual ingredients, from star anise, nutmeg, and black cardamom, to poppy seeds and white sesame. Each spice is dry-roasted individually over moderate flame to release its specific essential oils without scorching. This roasted blend is then ground together with fresh grated coconut to create a thick, dark, luxurious gravy. In this guide, we walk you through the precise temperature control required to duplicate this complex Konkan masterpiece in your own kitchen.',
    author: 'Chef Marcus Colaco',
    date: 'April 15, 2026',
    readTime: '10 min read',
    category: 'Chef Recipes'
  }
];

const defaultJobs = [
  {
    id: 'job-1',
    title: 'Sous Chef (Goan Cuisine Specialist)',
    department: 'Culinary',
    type: 'Full-Time',
    experienceRequired: '5+ Years in Fine Dining',
    description: 'We are seeking a master of traditional Goan-Portuguese spices and slow clay-pot cooking to direct our Vagator shoreline culinary prep teams.',
    requirements: ['Deep expertise in authentic spice-roasting and seafood fermentation.', 'Experience managing a high-volume Michelin-calibre line.', 'Knowledge of food safety and inventory systems.'],
    salaryRange: '₹80,000 - ₹1,20,000 / Month',
    active: true
  },
  {
    id: 'job-2',
    title: 'Head Sommelier / Cellar Director',
    department: 'Beverage',
    type: 'Full-Time',
    experienceRequired: '3+ Years with Wine Certifications',
    description: 'Direct the curation of North Goa’s most exclusive Old World wine cellar, hosting premium wine-pairing events and directing service pairings.',
    requirements: ['WSET Level 3 or CMS Sommelier Certification.', 'Expertise in Portuguese, Spanish, and French vintages.', 'Exceptional hosting and communication skills.'],
    salaryRange: '₹75,000 - ₹1,00,000 / Month',
    active: true
  },
  {
    id: 'job-3',
    title: 'Lead Guest Relations Host',
    department: 'Service',
    type: 'Full-Time',
    experienceRequired: '2+ Years in Luxury Hospitality',
    description: 'Provide white-glove, multi-lingual reception service, coordinating seaside VIP reservations, table allocations, and personalized celebrations.',
    requirements: ['Background in 5-star resort or premium boutique dining guest operations.', 'Fluency in English (Portuguese or Hindi is a strong advantage).', 'Experience with OpenTable, Resy, or similar systems.'],
    salaryRange: '₹45,000 - ₹60,000 / Month',
    active: true
  }
];

const defaultEvents = [
  {
    id: 'event-1',
    title: 'Jazz & Shellfish Soirée',
    date: 'Every Thursday Evening',
    time: '19:30 onwards',
    pricePerPerson: 3500,
    description: 'Savor an evening of coastal cool on our starlit teak deck. Features live smooth jazz saxophone, grilled giant prawns, fresh oysters, and complimentary premium Portuguese ports.'
  },
  {
    id: 'event-2',
    title: 'Chef’s Table Masterclass',
    date: 'Bi-Monthly Saturday',
    time: '12:00 - 15:30',
    pricePerPerson: 5500,
    description: 'An intimate culinary masterclass limited to exactly 6 guests. Join Chef Marcus Colaco as he demonstrates ancient Konkan stone-grinding, slow-braising of pork belly, and multi-layer Bebinca plating.'
  },
  {
    id: 'event-3',
    title: 'Alentejo Wine Chronicles',
    date: 'First Monday of July',
    time: '20:00 - 23:00',
    pricePerPerson: 8500,
    description: 'An exclusive 7-course seafood banquet curated alongside Clara Mendes. Each course is paired with rare white and red vintages sourced from the Herdade do Esporão estate in Alentejo.'
  }
];

const defaultTestimonials = [
  {
    id: 'rev-1',
    name: 'Clara Mendes',
    role: 'Michelin Food Critic',
    text: '“A breathtaking tribute to Indo-Portuguese lineage. Chef Marcus’s Pork Belly Vindaloo has an extraordinary, wood-distilled toddy vinegar depth that is simply unmatched on the subcontinent.”',
    rating: 5,
    source: 'Michelin Guide'
  },
  {
    id: 'rev-2',
    name: 'Arthur Sinclair',
    role: 'Editorial Director',
    text: '“The floor-to-ceiling glass layout and beachfront placement evokes Aman resorts at their finest. Flawless white-glove service, exquisite ocean scallops, and an extraordinary cashew feni portfolio.”',
    rating: 5,
    source: 'Luxe Digest'
  },
  {
    id: 'rev-3',
    name: 'Joshua D’Silva',
    role: 'Senior Food Columnist',
    text: '“Grandfather Casimiro’s beach legacy has been handled with flawless modern craft. Marcus has elevated simple seaside cooking into highly disciplined, elegant fine art.”',
    rating: 5,
    source: 'Goa Chronicle'
  }
];

async function main() {
  console.log('Starting seed...');

  // 1. Seed Admins
  console.log('Seeding Admins...');
  const adminPasswordHash = await bcrypt.hash('ColacoHutAdmin2026!', 10);
  const managerPasswordHash = await bcrypt.hash('ClaraManager2026!', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@colacohut.com' },
    update: {},
    create: {
      id: 'admin-1',
      email: 'admin@colacohut.com',
      passwordHash: adminPasswordHash,
      name: 'Marcus Colaco',
      role: 'Admin'
    }
  });

  await prisma.admin.upsert({
    where: { email: 'clara@colacohut.com' },
    update: {},
    create: {
      id: 'manager-1',
      email: 'clara@colacohut.com',
      passwordHash: managerPasswordHash,
      name: 'Clara Mendes',
      role: 'Manager'
    }
  });

  // 2. Seed Reservations
  console.log('Seeding Reservations...');
  const existingRes = await prisma.reservation.findUnique({ where: { id: 'CH-REV-101' } });
  if (!existingRes) {
    await prisma.reservation.create({
      data: {
        id: 'CH-REV-101',
        guests: '4 Guests',
        date: '2026-07-02',
        time: '20:30',
        occasion: 'Anniversary',
        seating: 'outdoor',
        name: 'Vikram & Sofia Malhotra',
        phone: '+91 9811122233',
        email: 'vikram@malhotraluxe.com',
        specialRequests: 'Celebrating our 10th anniversary. Best view of the sunset, and a bottle of Herdade do Esporão Reserva ready.',
        status: 'Confirmed'
      }
    });
  }

  // 3. Seed Menu
  console.log('Seeding Menu items...');
  for (const item of gourmetMenu) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  // 4. Seed Gallery
  console.log('Seeding Gallery items...');
  for (const item of galleryItems) {
    await prisma.galleryItem.upsert({
      where: { id: item.id },
      update: {},
      create: item
    });
  }

  // 5. Seed Blogs
  console.log('Seeding Blog posts...');
  for (const post of luxuryBlogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {},
      create: post
    });
  }

  // 6. Seed Subscribers
  console.log('Seeding Subscribers...');
  await prisma.subscriber.upsert({
    where: { email: 'connoisseur@luxe.com' },
    update: {},
    create: {
      id: 'sub-1',
      email: 'connoisseur@luxe.com'
    }
  });

  // 7. Seed Messages
  console.log('Seeding Contact messages...');
  const existingMsg = await prisma.contactMessage.findUnique({ where: { id: 'msg-1' } });
  if (!existingMsg) {
    await prisma.contactMessage.create({
      data: {
        id: 'msg-1',
        name: 'Armando Silva',
        email: 'armando@lisbonpress.pt',
        phone: '+351 912345678',
        subject: 'Feature Interview Request - Lisbon Culinary Review',
        message: 'Greetings Chef Colaco, We are preparing an autumn feature on the influence of Portuguese cooking methods in modern Goan beach resorts. We would love to book a 30-minute photo and interview session with you next week.',
        status: 'Unread'
      }
    });
  }

  // 8. Seed Job Positions
  console.log('Seeding Job Positions...');
  for (const job of defaultJobs) {
    await prisma.jobPosition.upsert({
      where: { id: job.id },
      update: {},
      create: {
        id: job.id,
        title: job.title,
        department: job.department,
        type: job.type,
        experienceRequired: job.experienceRequired,
        description: job.description,
        requirements: job.requirements,
        salaryRange: job.salaryRange,
        active: job.active
      }
    });
  }

  // 9. Seed Events
  console.log('Seeding Events...');
  for (const event of defaultEvents) {
    await prisma.eventItem.upsert({
      where: { id: event.id },
      update: {},
      create: event
    });
  }

  // 10. Seed Testimonials
  console.log('Seeding Testimonials...');
  for (const review of defaultTestimonials) {
    await prisma.testimonial.upsert({
      where: { id: review.id },
      update: {},
      create: review
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
