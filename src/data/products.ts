export interface Product {
  id: string;
  name: string;
  price: number;
  isCallForPrice?: boolean;
  category: string;
  image: string;
  description: string;
}

export const CATEGORIES = [
  "WordPress Themes",
  "WordPress Plugins",
  "Graphic Tools",
  "AI & Subscriptions",
  "Software & Apps",
  "Tutorials",
  "Digital Services",
  "eBooks & Entertainment"
];

export const INITIAL_PRODUCTS: Product[] = [
  // WordPress Themes
  { id: "wp-theme-1", name: "Digital Product Selling Website Template", price: 0, category: "WordPress Themes", image: "/images/wp-theme-1.jpg", description: "Start your digital marketplace today." },
  { id: "wp-theme-2", name: "KitNinja – Ultimate Ecommerce Template", price: 0, isCallForPrice: true, category: "WordPress Themes", image: "/images/wp-theme-2.jpg", description: "Premium ecommerce template for pros." },
  { id: "wp-theme-3", name: "100+ Bangla Landing Page Templates", price: 100, category: "WordPress Themes", image: "/images/wp-theme-3.jpg", description: "Conversion focused Bangla landing pages." },
  { id: "wp-theme-4", name: "1000+ Elementor Landing Page Templates", price: 150, category: "WordPress Themes", image: "/images/wp-theme-4.jpg", description: "Massive collection of Elementor templates." },
  { id: "wp-theme-5", name: "Astra Pro WP Theme", price: 450, category: "WordPress Themes", image: "/images/wp-theme-5.jpg", description: "Fastest WordPress theme with Pro features." },
  { id: "wp-theme-6", name: "GeneratePress Premium", price: 450, category: "WordPress Themes", image: "/images/wp-theme-6.jpg", description: "Lightweight, powerful, and performance-driven." },

  // WordPress Plugins
  { id: "wp-plugin-1", name: "ACF Pro", price: 450, category: "WordPress Plugins", image: "/images/wp-plugin-1.jpg", description: "Advanced Custom Fields Pro for power users." },
  { id: "wp-plugin-2", name: "Elementor Pro", price: 450, category: "WordPress Plugins", image: "/images/wp-plugin-2.jpg", description: "World's leading website builder for WordPress." },
  { id: "wp-plugin-3", name: "Rank Math Pro", price: 650, category: "WordPress Plugins", image: "/images/wp-plugin-3.jpg", description: "Best SEO plugin for WordPress ranking." },

  // Graphic Tools
  { id: "graphic-1", name: "Canva Premium", price: 500, category: "Graphic Tools", image: "/images/graphic-1.jpg", description: "Empower your creative designs with Canva Pro." },
  { id: "graphic-2", name: "Adobe Creative Cloud", price: 0, isCallForPrice: true, category: "Graphic Tools", image: "/images/graphic-2.jpg", description: "Full suite of professional creative software." },
  { id: "graphic-3", name: "Midjourney AI", price: 0, isCallForPrice: true, category: "Graphic Tools", image: "/images/graphic-3.jpg", description: "Leading AI-powered art generation tool." },

  // AI & Subscriptions
  { id: "ai-1", name: "ChatGPT Plus", price: 350, category: "AI & Subscriptions", image: "/images/ai-1.jpg", description: "Subscribe to GPT-4 and advanced AI features." },
  { id: "ai-2", name: "Claude AI and API", price: 0, isCallForPrice: true, category: "AI & Subscriptions", image: "/images/ai-2.jpg", description: "High-intelligence AI models from Anthropic." },
  { id: "ai-3", name: "LinkedIn Premium", price: 0, isCallForPrice: true, category: "AI & Subscriptions", image: "/images/ai-3.jpg", description: "Advance your career with LinkedIn Premium." },

  // Software & Apps
  { id: "soft-1", name: "Windows 11 Retail Key", price: 550, category: "Software & Apps", image: "/images/soft-1.jpg", description: "Genuine retail activation for Windows 11." },
  { id: "soft-2", name: "Microsoft Office 365", price: 450, category: "Software & Apps", image: "/images/soft-2.jpg", description: "Full Office productivity suite access." },

  // Tutorials
  { id: "tut-1", name: "Advance SEO Course", price: 0, category: "Tutorials", image: "/images/tut-1.jpg", description: "Master SEO with our comprehensive video course." },

  // Services
  { id: "serv-1", name: "Professional Web Design", price: 15000, category: "Digital Services", image: "/images/serv-1.jpg", description: "Get a high-converting website built by experts." }
];
