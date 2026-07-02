import { MenuItem } from '../types';

export const gourmetMenu: MenuItem[] = [
  // STARTERS
  {
    id: 'starter-1',
    name: 'Crispy Fried Calamari',
    category: 'starters',
    price: 950,
    description: 'Tender ocean squid rings, semolina crusted, flash-fried and served with a spiced peri-peri aioli and charred Lisbon lemon.',
    recommended: true,
    spicyLevel: 1
  },
  {
    id: 'starter-2',
    name: 'Fofos de Peixe',
    category: 'starters',
    price: 850,
    description: 'Traditional Portuguese-style fish croquettes, minced local kingfish, fresh ginger, cracked pepper, and aromatic coriander.',
    bestSeller: true,
    spicyLevel: 1
  },
  {
    id: 'starter-3',
    name: 'Prawn Rissois',
    category: 'starters',
    price: 1100,
    description: 'Creamy local prawn-filled golden empanadas, hand-folded, crumbed, and deep-fried to absolute buttery perfection.',
    recommended: true,
    spicyLevel: 0
  },
  {
    id: 'starter-4',
    name: 'Melted Goat Cheese Tartlet',
    category: 'starters',
    price: 890,
    description: 'Flaky pastry filled with caramelized red onions, roasted walnuts, artisanal Goan goat cheese, and a drizzle of local wild honey.',
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
    spicyLevel: 2
  },
  {
    id: 'seafood-2',
    name: 'Giant Tiger Prawns',
    category: 'seafood',
    price: 3200,
    description: 'Plump butter-flashed giant prawns, tossed with roasted garlic, local Kokum extract, and finished with house-made bird’s eye chili oil.',
    bestSeller: true,
    spicyLevel: 2
  },
  {
    id: 'seafood-3',
    name: 'Saffron Butter-Poached Lobster',
    category: 'seafood',
    price: 4500,
    description: 'Premium whole Goan lobster slowly poached in rich clarified butter infused with Kashmiri saffron, presented with a sea-salt froth.',
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
    spicyLevel: 0
  },

  // GOAN SPECIALTIES
  {
    id: 'goan-1',
    name: 'Exquisite Seafood Thali',
    category: 'goan',
    price: 1450,
    description: 'A grand coastal banquet: Semolina kingfish fry, signature spiced prawn curry, tisreo (clams) sukkiem, local vegetable foogath, pickles, and red unpolished parboiled rice.',
    bestSeller: true,
    spicyLevel: 2
  },
  {
    id: 'goan-2',
    name: 'Pork Belly Vindaloo',
    category: 'goan',
    price: 1250,
    description: 'Double-cooked pork belly marinated for 48 hours in local coconut feni-distilled toddy vinegar, garlic, ginger, and fierce fiery Goan red chilies.',
    recommended: true,
    spicyLevel: 3
  },
  {
    id: 'goan-3',
    name: 'Chicken Xacuti',
    category: 'goan',
    price: 1150,
    description: 'Heritage Goan recipe comprising tender country chicken simmered in a dense curry of 21 slow-roasted whole spices and freshly grated roasted coconut. Served with warm local Poi bread.',
    spicyLevel: 2
  },

  // PORTUGUESE CLASSICS
  {
    id: 'port-1',
    name: 'Bacalhau à Brás',
    category: 'portuguese',
    price: 2100,
    description: 'Traditional comforting Portuguese dish featuring salted cod, thinly shredded hand-cut potatoes, sweet onions, bound together with organic eggs and topped with black olives.',
    recommended: true,
    spicyLevel: 0
  },
  {
    id: 'port-2',
    name: 'Arroz de Marisco',
    category: 'portuguese',
    price: 2850,
    description: 'A rich, wet, soupy Portuguese seafood rice generously loaded with pieces of lobster, clams, king prawns, black mussels, and fresh garden herbs.',
    bestSeller: true,
    spicyLevel: 1
  },

  // DESSERTS
  {
    id: 'dessert-1',
    name: 'The Colaco Bebinca',
    category: 'desserts',
    price: 650,
    description: 'Seven layers of warm, rich, traditional Goan coconut-egg custard pudding, served with a scoop of home-churned vanilla bean ice cream.',
    bestSeller: true,
    spicyLevel: 0
  },
  {
    id: 'dessert-2',
    name: 'Serra Dura (Sawdust Pudding)',
    category: 'desserts',
    price: 550,
    description: 'Velvety whipped cream layered with powdered sweet biscuits and a subtle kiss of orange blossom liqueur.',
    recommended: true,
    spicyLevel: 0
  },

  // CELLAR & SPIRITS
  {
    id: 'wine-1',
    name: 'Herdade do Esporão Reserva',
    category: 'cellar',
    price: 7500,
    description: 'Exclusive white wine from Alentejo, Portugal. Boasts robust peach and oak notes, with a velvety mineral finish perfect for seafood.',
    recommended: true,
    spicyLevel: 0
  },
  {
    id: 'wine-2',
    name: 'Cloudy Bay Sauvignon Blanc',
    category: 'cellar',
    price: 9200,
    description: 'Premium Marlborough, NZ vintage. Crisp notes of fresh lime, passionfruit, and a balanced high acidity that cuts through rich buttery dishes.',
    spicyLevel: 0
  },
  {
    id: 'wine-3',
    name: 'Signature Barrel-Aged Feni',
    category: 'cellar',
    price: 450,
    description: 'The Colaco Hut custom artisanal triple-distilled cashew feni, aged in dark oak casks for a smoky, smooth, and uniquely Goan heritage finish.',
    bestSeller: true,
    spicyLevel: 0
  }
];
