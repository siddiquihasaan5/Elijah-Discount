import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Menu, X, Heart, User, ShieldCheck, 
  Truck, Clock, Star, ArrowRight, ChevronRight, Filter, 
  SlidersHorizontal, Check, Plus, Minus, Trash2, Tag, 
  MapPin, Phone, Mail, DollarSign, Package, CheckCircle2,
  AlertCircle, RefreshCw, Eye, ExternalLink, ChevronDown, Award
} from 'lucide-react';

// --- TYPES ---
export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Kids' | 'Shoes' | 'Accessories';
  subcategory: string;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNewArrival?: boolean;
  isWeeklyDeal?: boolean;
  isClearance?: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber?: string;
  carrier?: string;
}

// --- INITIAL MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Rugged Vintage Slim Straight Denim Jeans',
    category: 'Men',
    subcategory: 'Jeans',
    price: 34.99,
    compareAtPrice: 79.99,
    rating: 4.8,
    reviewsCount: 124,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c96355d53?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Crafted from premium heavy-weight cotton denim with hand-distressed detailing, these slim straight jeans offer timeless style with modern comfort.',
    details: ['100% Cotton 13.5oz denim', 'Classic 5-pocket styling', 'Brass hardware & zip fly', 'Machine wash cold'],
    sizes: ['30x32', '32x32', '34x32', '36x32', '38x32'],
    colors: [{ name: 'Washed Indigo', hex: '#2b3a4a' }, { name: 'Vintage Black', hex: '#1c1c1c' }],
    isNewArrival: true,
    isWeeklyDeal: true,
    stock: 28
  },
  {
    id: 'prod-2',
    name: 'Merino Wool Ribbed Crewneck Sweater',
    category: 'Men',
    subcategory: 'Sweaters',
    price: 29.99,
    compareAtPrice: 65.00,
    rating: 4.9,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Luxuriously soft merino wool blend sweater featuring classic ribbed texture, designed to keep you warm and impeccably styled during chilly evenings.',
    details: ['55% Merino Wool, 45% Organic Cotton', 'Ribbed collar, cuffs, and hem', 'Breathable thermal regulation'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Oatmeal Heather', hex: '#d4c5b9' }, { name: 'Charcoal', hex: '#363839' }, { name: 'Forest Green', hex: '#2c3e35' }],
    isNewArrival: true,
    stock: 42
  },
  {
    id: 'prod-3',
    name: 'Water-Resistant Lightweight Bomber Jacket',
    category: 'Men',
    subcategory: 'Jackets',
    price: 49.99,
    compareAtPrice: 110.00,
    rating: 4.7,
    reviewsCount: 156,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Your ideal transitional outerwear piece. Sleek silhouette with windproof shell, secure zipped utility pockets, and ribbed collar.',
    details: ['100% Recycled Nylon shell', 'DWR water-repellent finish', 'Smooth satin lining', 'Secure interior chest pocket'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Olive Drab', hex: '#4b5320' }, { name: 'Matte Black', hex: '#111111' }, { name: 'Navy', hex: '#1b2a4a' }],
    isWeeklyDeal: true,
    stock: 19
  },
  {
    id: 'prod-4',
    name: 'Classic Cable-Knit Turtleneck Sweater',
    category: 'Women',
    subcategory: 'Sweaters',
    price: 36.99,
    compareAtPrice: 75.00,
    rating: 4.9,
    reviewsCount: 94,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An iconic cold-weather essential featuring intricate cable-knit patterns and a cozy turtleneck that provides effortless elegance.',
    details: ['Soft acrylic-wool blend', 'Relaxed slouchy fit', 'Ribbed fold-over neck'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Cream', hex: '#fdfbf7' }, { name: 'Camel', hex: '#c19a6b' }, { name: 'Burgundy', hex: '#6b2d3c' }],
    isNewArrival: true,
    stock: 31
  },
  {
    id: 'prod-5',
    name: 'Urban Casual Lightweight Windbreaker',
    category: 'Women',
    subcategory: 'Jackets',
    price: 42.99,
    compareAtPrice: 90.00,
    rating: 4.6,
    reviewsCount: 67,
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Featherlight protection against unpredictable weather. Packs down into its own pocket for ultimate travel convenience.',
    details: ['Ultralight ripstop nylon', 'Adjustable bungee hood', 'Elasticated cuffs'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Dusty Rose', hex: '#dcae96' }, { name: 'Sage Green', hex: '#9ea99b' }, { name: 'Black', hex: '#121212' }],
    isClearance: true,
    stock: 15
  },
  {
    id: 'prod-6',
    name: 'Handcrafted Leather Chelsea Boots',
    category: 'Shoes',
    subcategory: 'Boots',
    price: 64.99,
    compareAtPrice: 140.00,
    rating: 4.9,
    reviewsCount: 210,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Genuine full-grain leather boots with stretchy elastic side goring and durable rubber lug outsoles for all-day cushioning.',
    details: ['100% Full-grain leather upper', 'Cushioned leather insoles', '1-inch stacked heel', 'Pull-on heel tab'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: [{ name: 'Cognac Brown', hex: '#9a5324' }, { name: 'Espresso', hex: '#3b2219' }],
    isWeeklyDeal: true,
    isNewArrival: true,
    stock: 22
  },
  {
    id: 'prod-7',
    name: 'Minimalist Canvas & Leather Backpack',
    category: 'Accessories',
    subcategory: 'Bags',
    price: 39.99,
    compareAtPrice: 85.00,
    rating: 4.8,
    reviewsCount: 118,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Rugged 16oz waxed canvas paired with bridle leather straps. Padded interior sleeve fits up to 15-inch laptops.',
    details: ['Water-resistant waxed canvas', 'Solid brass magnetic closures', 'Padded ergonomic shoulder straps'],
    sizes: ['One Size'],
    colors: [{ name: 'Field Tan', hex: '#b58b53' }, { name: 'Slate Grey', hex: '#708090' }],
    stock: 35
  },
  {
    id: 'prod-8',
    name: 'Kids Cozy Fleece Zip Hoodie & Joggers Set',
    category: 'Kids',
    subcategory: 'Sets',
    price: 24.99,
    compareAtPrice: 55.00,
    rating: 4.9,
    reviewsCount: 73,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503944583220-74d8964d552a?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Super-soft brushed fleece matching set designed for maximum playtime comfort and durability.',
    details: ['Cotton-poly fleece blend', 'Easy-pull elastic waistbands', 'Kangaroo front pocket'],
    sizes: ['4T', '5T', '6 Years', '7 Years', '8 Years'],
    colors: [{ name: 'Heather Grey', hex: '#b2b2b2' }, { name: 'Navy Blue', hex: '#1c2833' }],
    isClearance: true,
    stock: 25
  }
];

// --- CONTEXT ---
interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-9842',
      date: '2026-10-15',
      items: [{ product: INITIAL_PRODUCTS[0], selectedSize: '32x32', selectedColor: 'Washed Indigo', quantity: 1 }],
      subtotal: 34.99,
      discount: 0,
      tax: 2.89,
      shipping: 0,
      total: 37.88,
      status: 'Delivered',
      shippingAddress: { fullName: 'Jane Doe', street: '123 Main St', city: 'Fort Worth', state: 'TX', zip: '76112' },
      trackingNumber: 'UPS-9837492810',
      carrier: 'UPS Ground'
    }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const addToCart = (product: Product, size: string, color: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)));
  };

  const updateQuantity = (productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.selectedSize === size && item.selectedColor === color 
        ? { ...item, quantity: qty } 
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discountPercent: 10 });
      return true;
    } else if (upper === 'CLEARANCE20') {
      setAppliedCoupon({ code: 'CLEARANCE20', discountPercent: 20 });
      return true;
    } else if (upper === 'TEXAS15') {
      setAppliedCoupon({ code: 'TEXAS15', discountPercent: 15 });
      return true;
    }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(item => item.id !== id));

  return (
    <StoreContext.Provider value={{
      products, cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, wishlist, toggleWishlist, activeTab, setActiveTab,
      selectedProduct, setSelectedProduct, searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory, orders, addOrder,
      appliedCoupon, applyCoupon, removeCoupon, isAdminMode, setIsAdminMode,
      addProduct, updateProduct, deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

// --- COMPONENTS ---

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0E0E0E] text-[#FAF7F2] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-4 tracking-wide">
      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#E4411F]" /> Fort Worth Showroom: 2609 Castaneda Cir</span>
      <span className="hidden md:inline">•</span>
      <span className="hidden md:flex items-center gap-1.5"><Truck size={13} className="text-[#E4411F]" /> Free Shipping on Orders Over $75</span>
      <span className="hidden md:inline">•</span>
      <span className="hidden md:flex items-center gap-1.5"><Phone size={13} className="text-[#E4411F]" /> (619) 807-4468</span>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { cart, wishlist, setActiveTab, activeTab, searchQuery, setSearchQuery, setIsCartOpen, isAdminMode, setIsAdminMode } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E6E0D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button className="md:hidden p-2 text-[#0E0E0E]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <div className="cursor-pointer flex flex-col items-start" onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="font-serif text-2xl sm:text-3xl tracking-tight font-bold text-[#0E0E0E]">ELIJAH DISCOUNT</span>
          <span className="text-[10px] tracking-widest text-[#E4411F] uppercase font-mono font-semibold -mt-1">Style for Less. Always.</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`transition-colors hover:text-[#E4411F] ${activeTab === 'home' ? 'text-[#E4411F] font-semibold underline underline-offset-4' : 'text-[#0E0E0E]'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('shop')} 
            className={`transition-colors hover:text-[#E4411F] ${activeTab === 'shop' ? 'text-[#E4411F] font-semibold underline underline-offset-4' : 'text-[#0E0E0E]'}`}
          >
            All Apparel & Gear
          </button>
          <button 
            onClick={() => setActiveTab('deals')} 
            className={`transition-colors hover:text-[#E4411F] flex items-center gap-1 ${activeTab === 'deals' ? 'text-[#E4411F] font-semibold underline underline-offset-4' : 'text-[#0E0E0E]'}`}
          >
            <Tag size={14} className="text-[#E4411F]" /> Weekly Deals
          </button>
          <button 
            onClick={() => setActiveTab('about')} 
            className={`transition-colors hover:text-[#E4411F] ${activeTab === 'about' ? 'text-[#E4411F] font-semibold underline underline-offset-4' : 'text-[#0E0E0E]'}`}
          >
            Showroom & Contact
          </button>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative hidden lg:block w-48 xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text"
              placeholder="Search jeans, sweaters..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (activeTab !== 'shop') setActiveTab('shop'); }}
              className="w-full bg-white border border-[#E6E0D5] rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#E4411F]"
            />
          </div>

          <button 
            onClick={() => setActiveTab('account')}
            className="p-2 rounded-full hover:bg-neutral-200/50 text-[#0E0E0E] relative transition-colors"
            title="Customer Account & Orders"
          >
            <User size={20} />
          </button>

          <button 
            onClick={() => setActiveTab('wishlist')}
            className="p-2 rounded-full hover:bg-neutral-200/50 text-[#0E0E0E] relative transition-colors hidden sm:block"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#E4411F] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-[#0E0E0E] text-[#FAF7F2] hover:bg-[#E4411F] px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium transition-colors"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-[#E4411F] group-hover:bg-[#0E0E0E] text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                {totalCartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => { setIsAdminMode(!isAdminMode); setActiveTab(isAdminMode ? 'home' : 'admin'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isAdminMode ? 'bg-[#E4411F] text-white border-[#E4411F]' : 'border-[#0E0E0E] text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white'}`}
          >
            {isAdminMode ? 'Exit Admin' : 'Admin Portal'}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E6E0D5] px-6 py-4 flex flex-col gap-3 font-medium text-sm">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text"
              placeholder="Search apparel..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (activeTab !== 'shop') setActiveTab('shop'); }}
              className="w-full bg-white border border-[#E6E0D5] rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#E4411F]"
            />
          </div>
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-neutral-200">Home</button>
          <button onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-neutral-200">All Apparel & Gear</button>
          <button onClick={() => { setActiveTab('deals'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-neutral-200 flex items-center justify-between">
            Weekly Deals <Tag size={14} className="text-[#E4411F]" />
          </button>
          <button onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-neutral-200">Showroom & Contact</button>
          <button onClick={() => { setActiveTab('wishlist'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-neutral-200 flex items-center justify-between">
            Wishlist <Heart size={16} className="text-[#E4411F]" />
          </button>
          <button onClick={() => { setActiveTab('account'); setMobileMenuOpen(false); }} className="text-left py-2">Customer Account & Orders</button>
        </div>
      )}
    </header>
  );
};

export const HeroSection: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="relative bg-[#0E0E0E] text-[#FAF7F2] overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col items-start justify-center max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-[#E4411F] text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-6">
          <Award size={14} /> Fort Worth, Texas Premier Outlet
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6">
          Style for Less. <br />
          <span className="text-[#E4411F] italic font-serif">Always.</span>
        </h1>
        <p className="text-neutral-300 text-base sm:text-lg mb-8 leading-relaxed font-light">
          Discover hand-curated men's designer jeans, premium merino wool sweaters, and weather-resistant lightweight jackets at unbeatable outlet prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('shop')}
            className="bg-[#E4411F] hover:bg-[#c93617] text-white px-8 py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
          >
            Shop New Arrivals <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => setActiveTab('deals')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            Explore Weekly Deals <Tag size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export const TrustBadges: React.FC = () => {
  const pillars = [
    { icon: Truck, title: 'Free Shipping', desc: 'On all domestic orders over $75' },
    { icon: MapPin, title: 'Fort Worth Pickup', desc: 'Free same-day local showroom pickup' },
    { icon: ShieldCheck, title: 'Authenticity Guaranteed', desc: 'Direct sourcing & premium textiles' },
    { icon: RefreshCw, title: '30-Day Hassle-Free', desc: 'Easy returns and exchanges' }
  ];

  return (
    <section className="border-y border-[#E6E0D5] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF7F2]/60 border border-[#E6E0D5]/50">
                <div className="p-3 bg-[#E4411F]/10 text-[#E4411F] rounded-lg">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#0E0E0E] mb-1">{p.title}</h3>
                  <p className="text-xs text-neutral-600">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { setSelectedProduct, wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E6E0D5] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="bg-[#E4411F] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Save {discountPercent}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#0E0E0E] text-[#FAF7F2] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${isWishlisted ? 'bg-[#E4411F] text-white' : 'bg-white/80 text-[#0E0E0E] hover:bg-white'}`}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image Container */}
      <div 
        className="relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={product.name} 
            className="absolute inset-0 object-cover w-full h-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>{product.category} • {product.subcategory}</span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star size={12} fill="currentColor" />
              <span>{product.rating}</span>
            </div>
          </div>
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-semibold text-sm sm:text-base text-[#0E0E0E] line-clamp-1 hover:text-[#E4411F] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E6E0D5]/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg text-[#0E0E0E]">${product.price.toFixed(2)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
            className="bg-[#0E0E0E] hover:bg-[#E4411F] text-white p-2.5 rounded-full transition-colors"
            title="Quick Add"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, wishlist, toggleWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0] || '');
      setSelectedColor(selectedProduct.colors[0]?.name || '');
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col lg:flex-row">
        {/* Close Button */}
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-neutral-100 p-2.5 rounded-full text-[#0E0E0E] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Gallery */}
        <div className="lg:w-1/2 p-6 bg-neutral-50 flex flex-col gap-4">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-inner">
            <img src={selectedProduct.images[activeImageIndex]} alt={selectedProduct.name} className="w-full h-full object-cover" />
          </div>
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-3">
              {selectedProduct.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#E4411F]' : 'border-transparent opacity-70'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Options */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-medium uppercase tracking-wider text-[#E4411F]">{selectedProduct.category} / {selectedProduct.subcategory}</span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star size={14} fill="currentColor" />
                <span>{selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E0E0E] mb-3">{selectedProduct.name}</h2>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-[#0E0E0E]">${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.compareAtPrice > selectedProduct.price && (
                <span className="text-base text-neutral-400 line-through">${selectedProduct.compareAtPrice.toFixed(2)}</span>
              )}
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">In Stock ({selectedProduct.stock} available)</span>
            </div>

            <p className="text-neutral-600 text-sm mb-6 leading-relaxed">{selectedProduct.description}</p>

            {/* Sizes */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0E0E] mb-2">Select Size: {selectedSize}</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${selectedSize === size ? 'bg-[#0E0E0E] text-white border-[#0E0E0E]' : 'border-neutral-300 hover:border-[#0E0E0E]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0E0E] mb-2">Select Color: {selectedColor}</label>
              <div className="flex items-center gap-3">
                {selectedProduct.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${selectedColor === col.name ? 'border-[#E4411F] bg-[#E4411F]/5 font-semibold' : 'border-neutral-300'}`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-neutral-400" style={{ backgroundColor: col.hex }}></span>
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0E0E] mb-2">Quantity</label>
              <div className="flex items-center border border-neutral-300 rounded-xl w-32 overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-neutral-100 text-neutral-600"><Minus size={14} /></button>
                <span className="flex-1 text-center font-semibold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-neutral-100 text-neutral-600"><Plus size={14} /></button>
              </div>
            </div>
          </div>

          {/* Add to Bag & Wishlist */}
          <div className="flex gap-4 pt-4 border-t border-[#E6E0D5]">
            <button
              onClick={() => {
                addToCart(selectedProduct, selectedSize, selectedColor, quantity);
                setSelectedProduct(null);
              }}
              className="flex-1 bg-[#0E0E0E] hover:bg-[#E4411F] text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <ShoppingBag size={18} /> Add to Cart — ${(selectedProduct.price * quantity).toFixed(2)}
            </button>
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`p-4 rounded-full border transition-colors ${isWishlisted ? 'border-[#E4411F] bg-[#E4411F]/10 text-[#E4411F]' : 'border-neutral-300 hover:border-[#0E0E0E]'}`}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, appliedCoupon, applyCoupon, removeCoupon, setActiveTab } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const taxable = subtotal - discountAmount;
  const tax = taxable * 0.0825; // Texas 8.25%
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 5.99;
  const total = taxable + tax + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(couponInput);
    if (!success) {
      setCouponError(true);
    } else {
      setCouponError(false);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#E6E0D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#E4411F]" />
            <h2 className="font-serif text-xl font-bold text-[#0E0E0E]">Your Shopping Cart</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-neutral-100 text-[#0E0E0E]">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#FAF7F2] p-4 border-b border-[#E6E0D5]">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span>{subtotal >= 75 ? '🎉 You qualify for Free Shipping!' : `Add $${(75 - subtotal).toFixed(2)} more for Free Shipping`}</span>
            <span>{Math.min(100, Math.round((subtotal / 75) * 100))}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#E4411F] h-full transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / 75) * 100)}%` }}></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <ShoppingBag size={48} className="text-neutral-300 mb-4" />
              <p className="font-serif text-lg font-semibold text-[#0E0E0E] mb-1">Your cart is empty</p>
              <p className="text-xs text-neutral-500 mb-6">Explore our curated outlet deals and add your favorite apparel.</p>
              <button 
                onClick={() => { setIsCartOpen(false); setActiveTab('shop'); }}
                className="bg-[#0E0E0E] text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-[#E4411F] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-neutral-200">
                <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-24 object-cover rounded-xl bg-neutral-100" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-[#0E0E0E] line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm text-[#0E0E0E]">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-1.5 hover:bg-neutral-100 text-neutral-600"><Minus size={12} /></button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-1.5 hover:bg-neutral-100 text-neutral-600"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#E6E0D5] bg-[#FAF7F2]">
            {/* Coupon Code Input */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl mb-4 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <Tag size={14} /> Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% off)
                </div>
                <button onClick={removeCoupon} className="text-red-500 font-semibold hover:underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                <input 
                  type="text"
                  placeholder="Promo code (e.g. WELCOME10)"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                  className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#E4411F]"
                />
                <button type="submit" className="bg-[#0E0E0E] text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#E4411F] transition-colors">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-red-500 text-[11px] mb-3 -mt-2">Invalid coupon code. Try WELCOME10 or CLEARANCE20</p>}

            <div className="space-y-1.5 text-xs text-neutral-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Texas Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (Fort Worth / Standard)</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#0E0E0E] pt-2 border-t border-neutral-300">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveTab('checkout');
              }}
              className="w-full bg-[#E4411F] hover:bg-[#c93617] text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              Proceed to Secure Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CheckoutView: React.FC = () => {
  const { cart, appliedCoupon, clearCart, setActiveTab, addOrder } = useStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [formData, setFormData] = useState({
    fullName: 'Muhammad Senior',
    email: 'mrmuhammadseniors@yahoo.com',
    phone: '619-807-4468',
    street: '2609 Castaneda Cir',
    city: 'Fort Worth',
    state: 'TX',
    zip: '76112',
    shippingMethod: 'standard',
    paymentMethod: 'stripe',
    cardNumber: '4242 4242 4242 4242',
    cardExp: '12/28',
    cardCvc: '921'
  });
  const [createdOrderId, setCreatedOrderId] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const taxable = subtotal - discountAmount;
  const tax = taxable * 0.0825;
  const shippingCost = formData.shippingMethod === 'pickup' ? 0 : (subtotal >= 75 ? 0 : 5.99);
  const total = taxable + tax + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedOrderId(orderId);

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax,
      shipping: shippingCost,
      total,
      status: 'Paid',
      shippingAddress: {
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      },
      trackingNumber: `UPS-${Math.floor(100000000 + Math.random() * 900000000)}`,
      carrier: 'UPS Ground'
    };

    addOrder(newOrder);
    clearCart();
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0E0E] mb-2">Order Confirmed Successfully!</h1>
        <p className="text-neutral-600 text-sm mb-6">Thank you for shopping with Elijah Discount House. We have sent your receipt and tracking details to <strong className="text-[#0E0E0E]">{formData.email}</strong>.</p>
        
        <div className="bg-white rounded-2xl border border-[#E6E0D5] p-6 text-left max-w-xl mx-auto mb-8 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-[#E6E0D5] mb-4">
            <div>
              <span className="text-xs text-neutral-500 uppercase">Order Reference</span>
              <p className="font-mono font-bold text-base text-[#0E0E0E]">{createdOrderId}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">Paid & Processing</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-600">
            <p><strong>Shipping Address:</strong> {formData.fullName}, {formData.street}, {formData.city}, {formData.state} {formData.zip}</p>
            <p><strong>Showroom Contact:</strong> (619) 807-4468 | mrmuhammadseniors@yahoo.com</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setActiveTab('account')}
            className="bg-[#0E0E0E] text-white px-8 py-3.5 rounded-full text-xs font-medium hover:bg-[#E4411F] transition-colors"
          >
            View My Orders
          </button>
          <button 
            onClick={() => setActiveTab('home')}
            className="bg-neutral-200 text-[#0E0E0E] px-8 py-3.5 rounded-full text-xs font-medium hover:bg-neutral-300 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-[#0E0E0E] mb-8">Secure Outlet Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E0D5] shadow-sm">
          <form onSubmit={handleSubmitOrder}>
            {/* Contact & Shipping Details */}
            <h3 className="font-semibold text-base text-[#0E0E0E] mb-4 flex items-center gap-2">
              <User size={18} className="text-[#E4411F]" /> 1. Customer & Shipping Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={formData.street} 
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
                <input 
                  type="text" 
                  required
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">State</label>
                  <input 
                    type="text" 
                    required
                    value={formData.state} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Zip Code</label>
                  <input 
                    type="text" 
                    required
                    value={formData.zip} 
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E4411F]" 
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <h3 className="font-semibold text-base text-[#0E0E0E] mb-4 flex items-center gap-2">
              <Truck size={18} className="text-[#E4411F]" /> 2. Delivery Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${formData.shippingMethod === 'standard' ? 'border-[#E4411F] bg-[#E4411F]/5' : 'border-neutral-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#0E0E0E]">Standard UPS / USPS</span>
                  <input type="radio" name="shippingMethod" checked={formData.shippingMethod === 'standard'} onChange={() => setFormData({...formData, shippingMethod: 'standard'})} />
                </div>
                <span className="text-[11px] text-neutral-500">2-4 business days ({subtotal >= 75 ? 'FREE' : '$5.99'})</span>
              </label>

              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${formData.shippingMethod === 'pickup' ? 'border-[#E4411F] bg-[#E4411F]/5' : 'border-neutral-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#0E0E0E]">Fort Worth Showroom Pickup</span>
                  <input type="radio" name="shippingMethod" checked={formData.shippingMethod === 'pickup'} onChange={() => setFormData({...formData, shippingMethod: 'pickup'})} />
                </div>
                <span className="text-[11px] text-neutral-500">Ready in 2 hours — FREE (2609 Castaneda Cir)</span>
              </label>
            </div>

            {/* Payment */}
            <h3 className="font-semibold text-base text-[#0E0E0E] mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-[#E4411F]" /> 3. Payment Method (Test Mode Simulation)
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-2xl border-2 border-[#E4411F] bg-[#E4411F]/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-xs text-[#0E0E0E]">Stripe Secure Card Payment</span>
                  <span className="text-[10px] bg-[#E4411F] text-white px-2 py-0.5 rounded font-bold">TEST MODE</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">Card Number (Use 4242... for test)</label>
                    <input 
                      type="text" 
                      value={formData.cardNumber} 
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2 text-xs font-mono" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-1">Expiration</label>
                      <input 
                        type="text" 
                        value={formData.cardExp} 
                        onChange={(e) => setFormData({...formData, cardExp: e.target.value})}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2 text-xs font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-1">CVC</label>
                      <input 
                        type="text" 
                        value={formData.cardCvc} 
                        onChange={(e) => setFormData({...formData, cardCvc: e.target.value})}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2 text-xs font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#E4411F] hover:bg-[#c93617] text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              Complete Order — ${total.toFixed(2)} <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E0D5] shadow-sm sticky top-28">
            <h3 className="font-serif text-xl font-bold text-[#0E0E0E] mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <img src={item.product.images[0]} alt="" className="w-14 h-16 object-cover rounded-lg bg-neutral-100" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-xs text-[#0E0E0E] line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity} | {item.selectedSize}</p>
                  </div>
                  <span className="font-bold text-xs text-[#0E0E0E]">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-neutral-600 pt-4 border-t border-[#E6E0D5]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Texas Sales Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0E0E0E] pt-3 border-t border-neutral-300">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShopView: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const [priceRange, setPriceRange] = useState(150);
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Men', 'Women', 'Shoes', 'Accessories', 'Kids'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()) || p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price <= priceRange;
      return matchesCat && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - b.price ? b.price - a.price : 0;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0E0E] mb-2">Apparel & Outlet Catalog</h1>
        <p className="text-neutral-600 text-sm">Curated collection of men's jeans, sweaters, and lightweight jackets at unmatched prices.</p>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[#E6E0D5] pb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat ? 'bg-[#0E0E0E] text-white shadow-md' : 'bg-white border border-[#E6E0D5] text-[#0E0E0E] hover:border-[#0E0E0E]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#E6E0D5]">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
            <SlidersHorizontal size={16} /> Max Price: <strong className="text-[#0E0E0E]">${priceRange}</strong>
          </div>
          <input 
            type="range" 
            min="20" 
            max="150" 
            step="10"
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))} 
            className="w-32 sm:w-48 accent-[#E4411F]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-neutral-500">{filteredProducts.length} items found</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FAF7F2] border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#E4411F]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E6E0D5]">
          <Search size={48} className="text-neutral-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#0E0E0E] mb-1">No apparel matches your criteria</h3>
          <p className="text-xs text-neutral-500 mb-6">Try broadening your search or adjusting your price filters.</p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange(150); }}
            className="bg-[#0E0E0E] text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-[#E4411F]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export const DealsView: React.FC = () => {
  const { products } = useStore();
  const deals = products.filter(p => p.isWeeklyDeal || p.isClearance || p.compareAtPrice > p.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#0E0E0E] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200')` }}></div>
        <div className="relative z-10 max-w-xl">
          <span className="bg-[#E4411F] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Flash Deals</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">Weekly Outlet Clearance</h1>
          <p className="text-neutral-300 text-sm mb-6">Save up to 60% off original MSRP on high-demand men's jeans, merino sweaters, and outerwear.</p>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-fit">
            <Tag size={20} className="text-[#E4411F]" />
            <span className="text-xs">Use promo code <strong className="text-white font-mono bg-[#E4411F] px-2 py-0.5 rounded">CLEARANCE20</strong> at checkout for an extra 20% off!</span>
          </div>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-bold text-[#0E0E0E] mb-6">Active Discounted Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {deals.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-[#E6E0D5] p-8 sm:p-12 mb-12 shadow-sm">
        <span className="text-xs font-bold text-[#E4411F] uppercase tracking-wider mb-2 block">Fort Worth Showroom & Headquarters</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0E0E0E] mb-6">Elijah Discount House</h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
          Founded on the principle that premium designer fashion and dependable everyday wear should be accessible to everyone. We specialize in top-tier men's denim jeans, cozy merino wool sweaters, and weather-resistant lightweight jackets sourced directly and passed down with unmatched savings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#E6E0D5]">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#E4411F]/10 text-[#E4411F] rounded-2xl">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0E0E0E] mb-1">Showroom Address</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">2609 Castaneda Cir<br />Fort Worth, TX 76112, USA</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#E4411F]/10 text-[#E4411F] rounded-2xl">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0E0E0E] mb-1">Direct Phone Support</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">(619) 807-4468<br />Mon-Sat: 9am - 7pm CST</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#E4411F]/10 text-[#E4411F] rounded-2xl">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#0E0E0E] mb-1">Official Inquiries</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">mrmuhammadseniors@yahoo.com<br />24/7 Customer Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountView: React.FC = () => {
  const { orders } = useStore();
  const [activeTabSub, setActiveTabSub] = useState<'orders' | 'profile'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0E0E0E] mb-1">Customer Portal</h1>
          <p className="text-neutral-600 text-xs">Manage your orders, tracking, and profile information for Muhammad Senior.</p>
        </div>
        <div className="flex gap-2 bg-white border border-[#E6E0D5] p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTabSub('orders')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTabSub === 'orders' ? 'bg-[#0E0E0E] text-white' : 'text-neutral-600 hover:text-[#0E0E0E]'}`}
          >
            My Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTabSub('profile')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTabSub === 'profile' ? 'bg-[#0E0E0E] text-white' : 'text-neutral-600 hover:text-[#0E0E0E]'}`}
          >
            Profile & Address
          </button>
        </div>
      </div>

      {activeTabSub === 'orders' ? (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E0D5]">
              <Package size={48} className="text-neutral-300 mx-auto mb-4" />
              <p className="font-serif text-lg font-semibold text-[#0E0E0E] mb-1">No orders placed yet</p>
              <p className="text-xs text-neutral-500">Your order history and UPS tracking links will appear here.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E6E0D5] gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-base text-[#0E0E0E]">{order.id}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{order.status}</span>
                    </div>
                    <span className="text-xs text-neutral-500">Placed on {order.date} • {order.items.length} item(s)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">Total Amount</span>
                    <span className="font-bold text-lg text-[#0E0E0E]">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img src={item.product.images[0]} alt="" className="w-16 h-20 object-cover rounded-xl bg-neutral-100" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-[#0E0E0E]">{item.product.name}</h4>
                        <p className="text-xs text-neutral-500">Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm text-[#0E0E0E]">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.trackingNumber && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E0D5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 block mb-0.5">Carrier Tracking Number ({order.carrier})</span>
                      <span className="font-mono font-bold text-[#0E0E0E]">{order.trackingNumber}</span>
                    </div>
                    <button className="bg-[#0E0E0E] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#E4411F] transition-colors flex items-center gap-1.5">
                      Track Shipment <ExternalLink size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E6E0D5] p-8 max-w-2xl shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0E0E0E] mb-6">Account Details</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-500 mb-1">Full Name</label>
              <input type="text" readOnly value="Muhammad Senior" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 font-medium text-[#0E0E0E]" />
            </div>
            <div>
              <label className="block text-neutral-500 mb-1">Email Address</label>
              <input type="text" readOnly value="mrmuhammadseniors@yahoo.com" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 font-medium text-[#0E0E0E]" />
            </div>
            <div>
              <label className="block text-neutral-500 mb-1">Phone Number</label>
              <input type="text" readOnly value="(619) 807-4468" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 font-medium text-[#0E0E0E]" />
            </div>
            <div>
              <label className="block text-neutral-500 mb-1">Showroom / Shipping Address</label>
              <input type="text" readOnly value="2609 Castaneda Cir, Fort Worth, TX 76112" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5 font-medium text-[#0E0E0E]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const WishlistView: React.FC = () => {
  const { wishlist, products, setActiveTab } = useStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-[#0E0E0E] mb-2">My Wishlist</h1>
      <p className="text-neutral-600 text-xs mb-8">Saved apparel and outlet items you love.</p>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E6E0D5]">
          <Heart size={48} className="text-neutral-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#0E0E0E] mb-1">Your wishlist is currently empty</h3>
          <p className="text-xs text-neutral-500 mb-6">Click the heart icon on any product to save it here.</p>
          <button 
            onClick={() => setActiveTab('shop')}
            className="bg-[#0E0E0E] text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-[#E4411F]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { products, orders, addProduct, deleteProduct } = useStore();
  const [activeSection, setActiveSection] = useState<'products' | 'orders' | 'settings'>('products');
  const [newProd, setNewProd] = useState({
    name: 'New Designer Wool Jacket',
    category: 'Men' as const,
    subcategory: 'Jackets',
    price: 49.99,
    compareAtPrice: 120.00,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      subcategory: newProd.subcategory,
      price: Number(newProd.price),
      compareAtPrice: Number(newProd.compareAtPrice),
      rating: 5.0,
      reviewsCount: 1,
      images: [newProd.image],
      description: 'Newly added artisan item to Elijah Discount House catalog.',
      details: ['Premium quality material', 'Verified authenticity'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Default', hex: '#111111' }],
      stock: Number(newProd.stock),
      isNewArrival: true
    };
    addProduct(p);
    alert('Product successfully added to catalog!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="bg-[#E4411F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Admin Portal</span>
          <h1 className="font-serif text-3xl font-bold text-[#0E0E0E] mt-2">Store Management Dashboard</h1>
        </div>
        <div className="flex gap-2 bg-white border border-[#E6E0D5] p-1.5 rounded-2xl">
          <button onClick={() => setActiveSection('products')} className={`px-5 py-2 rounded-xl text-xs font-semibold ${activeSection === 'products' ? 'bg-[#0E0E0E] text-white' : 'text-neutral-600'}`}>Products ({products.length})</button>
          <button onClick={() => setActiveSection('orders')} className={`px-5 py-2 rounded-xl text-xs font-semibold ${activeSection === 'orders' ? 'bg-[#0E0E0E] text-white' : 'text-neutral-600'}`}>Orders ({orders.length})</button>
          <button onClick={() => setActiveSection('settings')} className={`px-5 py-2 rounded-xl text-xs font-semibold ${activeSection === 'settings' ? 'bg-[#0E0E0E] text-white' : 'text-neutral-600'}`}>Store Settings</button>
        </div>
      </div>

      {activeSection === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E6E0D5] shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#0E0E0E] mb-4">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1">Product Name</label>
                <input type="text" required value={newProd.name} onChange={(e) => setNewProd({...newProd, name: e.target.value})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-600 mb-1">Category</label>
                  <select value={newProd.category} onChange={(e) => setNewProd({...newProd, category: e.target.value as any})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-3 py-2.5">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Subcategory</label>
                  <input type="text" required value={newProd.subcategory} onChange={(e) => setNewProd({...newProd, subcategory: e.target.value})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-600 mb-1">Price ($)</label>
                  <input type="number" step="0.01" required value={newProd.price} onChange={(e) => setNewProd({...newProd, price: Number(e.target.value)})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Compare ($)</label>
                  <input type="number" step="0.01" required value={newProd.compareAtPrice} onChange={(e) => setNewProd({...newProd, compareAtPrice: Number(e.target.value)})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-3 py-2.5" />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Stock</label>
                  <input type="number" required value={newProd.stock} onChange={(e) => setNewProd({...newProd, stock: Number(e.target.value)})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-3 py-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">Image URL</label>
                <input type="text" required value={newProd.image} onChange={(e) => setNewProd({...newProd, image: e.target.value})} className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5" />
              </div>
              <button type="submit" className="w-full bg-[#E4411F] text-white py-3 rounded-xl font-medium hover:bg-[#c93617]">Add Product</button>
            </form>
          </div>

          {/* Product List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E6E0D5] shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#0E0E0E] mb-4">Existing Catalog Products</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl" />
                    <div>
                      <h4 className="font-semibold text-xs text-[#0E0E0E]">{p.name}</h4>
                      <p className="text-[11px] text-neutral-500">{p.category} • ${p.price} | Stock: {p.stock}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-[#0E0E0E] mb-4">All Customer Orders</h3>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#0E0E0E]">{o.id}</span>
                  <p className="text-neutral-500 mt-0.5">{o.shippingAddress.fullName} • {o.items.length} items • ${o.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase text-[10px]">{o.status}</span>
                  <span className="font-mono text-neutral-600">{o.trackingNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div className="bg-white rounded-3xl border border-[#E6E0D5] p-8 max-w-2xl shadow-sm text-xs space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#0E0E0E] mb-4">Store Configuration</h3>
          <div>
            <label className="block text-neutral-600 mb-1">Showroom Address</label>
            <input type="text" readOnly value="2609 Castaneda Cir, Fort Worth, TX 76112" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-neutral-600 mb-1">Support Phone & Email</label>
            <input type="text" readOnly value="(619) 807-4468 | mrmuhammadseniors@yahoo.com" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-neutral-600 mb-1">Texas Sales Tax Rate</label>
            <input type="text" readOnly value="8.25%" className="w-full bg-[#FAF7F2] border border-neutral-300 rounded-xl px-4 py-2.5" />
          </div>
        </div>
      )}
    </div>
  );
};

export const Footer: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <footer className="bg-[#0E0E0E] text-[#FAF7F2] border-t border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white block mb-2">ELIJAH DISCOUNT</span>
            <span className="text-[10px] tracking-widest text-[#E4411F] uppercase font-mono font-semibold block mb-4">Style for Less. Always.</span>
            <p className="text-neutral-400 text-xs leading-relaxed mb-4">
              Fort Worth's trusted outlet for quality men's denim jeans, cozy sweaters, and weather-resistant lightweight jackets.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E4411F] transition-colors">All Apparel</button></li>
              <li><button onClick={() => { setActiveTab('deals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E4411F] transition-colors">Weekly Deals</button></li>
              <li><button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E4411F] transition-colors">Showroom & Contact</button></li>
              <li><button onClick={() => { setActiveTab('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E4411F] transition-colors">Customer Orders</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-4">Showroom Location</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              2609 Castaneda Cir<br />Fort Worth, TX 76112, USA
            </p>
            <p className="text-xs text-neutral-400">Phone: (619) 807-4468</p>
            <p className="text-xs text-neutral-400">Email: mrmuhammadseniors@yahoo.com</p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-4">Newsletter Reward</h4>
            <p className="text-xs text-neutral-400 mb-4">Subscribe to receive instant access to weekly clearance alerts and <strong className="text-white">WELCOME10</strong> promo code.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email address" className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E4411F] flex-1" />
              <button onClick={() => alert('Subscribed successfully! Use promo code WELCOME10 for 10% off.')} className="bg-[#E4411F] hover:bg-[#c93617] text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors">Join</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500">
          <p>© 2026 Elijah Discount House. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Style for Less. Always.</p>
        </div>
      </div>
    </footer>
  );
};

export function MainContent() {
  const { activeTab } = useStore();

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {activeTab === 'home' && (
        <>
          <HeroSection />
          <TrustBadges />
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold text-[#E4411F] uppercase tracking-wider mb-1 block">Curated Selection</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0E0E]">Featured New Arrivals</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {INITIAL_PRODUCTS.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === 'shop' && <ShopView />}
      {activeTab === 'deals' && <DealsView />}
      {activeTab === 'about' && <AboutView />}
      {activeTab === 'account' && <AccountView />}
      {activeTab === 'wishlist' && <WishlistView />}
      {activeTab === 'checkout' && <CheckoutView />}
      {activeTab === 'admin' && <AdminDashboard />}

      <ProductModal />
      <CartDrawer />
    </main>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans text-[#0E0E0E]">
        <AnnouncementBar />
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </StoreProvider>
  );
}
