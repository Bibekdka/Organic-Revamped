import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useStore } from './store/useStore';
import { ShoppingCart, User, Leaf, Menu, X, Instagram, Facebook, Twitter, Search, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Visit from './pages/Visit';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

/**
 * Navbar Component - Handles navigation and authentication state
 * Using a "glassmorphism" design effect for a premium feel
 */
function Navbar() {
  const { user, cart, setUser } = useStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  /**
   * Triggers Google Auth provider flow.
   * On success, syncs user data with Firestore to maintain roles and profiles.
   */
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we always trigger a fresh login selection
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Sync with Firestore
      const userPath = `users/${user.uid}`;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            displayName: user.displayName || 'Anonymous Farmer',
            email: user.email,
            role: 'customer',
            createdAt: new Date().toISOString()
          });
        }
      } catch (fsError) {
        // Log Firestore sync errors specifically
        handleFirestoreError(fsError, OperationType.WRITE, userPath);
      }
      
      setUser(user);
    } catch (error: any) {
      // Specialized handling for common Auth UI errors
      if (error.code === 'auth/user-cancelled') {
        console.warn('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Please enable popups for this site to sign in.');
      } else {
        console.error('Firebase Auth Error:', error.code, error.message);
        if (error.message.includes('IdP denied access')) {
          alert('Sign-in denied. Please ensure you granted all necessary permissions or try again.');
        }
      }
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-24 px-6 md:px-12 flex items-center justify-between transition-all duration-500">
      <Link to="/" className="flex items-center gap-4 group">
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:bg-accent group-hover:border-accent">
          <Leaf className="text-accent group-hover:text-primary-800 w-6 h-6 transition-colors duration-500" />
        </div>
        <span className="text-2xl font-serif font-bold tracking-tight text-primary-950">Organic-O-Eats</span>
      </Link>

      <div className="hidden md:flex items-center gap-10 text-[10px] uppercase font-bold tracking-[0.2em] text-primary-950/60">
        <Link to="/store" className="hover:text-accent transition-colors">Shop</Link>
        <Link to="/about" className="hover:text-accent transition-colors">The Farm</Link>
        <Link to="/visit" className="hover:text-accent transition-colors">Visits</Link>
        <Link to="/about" className="hover:text-accent transition-colors">Sustainability</Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center bg-white/5 rounded-full px-5 py-2.5 border border-white/10 focus-within:border-accent/40 transition-all">
            <Search className="w-4 h-4 text-primary-950/30 mr-3" />
            <input type="text" placeholder="Search harvest..." className="bg-transparent border-none outline-none text-[10px] uppercase font-bold tracking-widest w-24 focus:w-40 transition-all text-primary-950" />
        </div>

        <Link to="/wishlist" className="p-2 hover:bg-white/5 rounded-full transition-colors relative group">
          <Heart className="w-5 h-5 text-primary-950 group-hover:text-accent transition-colors" />
        </Link>

        <Link to="/cart" className="relative h-10 flex items-center gap-3 px-5 rounded-full glass border-white/10 hover:border-accent/30 transition-all group">
          <ShoppingBag className="w-4 h-4 text-accent transition-transform group-hover:scale-110" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary-950/80">Cart ({cartCount})</span>
        </Link>

        {user ? (
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <User className="w-5 h-5 text-primary-950 group-hover:text-accent transition-colors" />
          </Link>
        ) : (
          <button 
            onClick={handleLogin}
            className="hidden sm:block bg-[#F5F2ED] text-[#0D1A13] px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all active:scale-95"
          >
            Visit Us
          </button>
        )}

        <button className="md:hidden p-2 text-primary-950" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-24 left-6 right-6 glass rounded-[40px] p-10 flex flex-col gap-8 md:hidden shadow-2xl z-50 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Link to="/store" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-primary-950">Shop Categories</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-primary-950">Our Mission</Link>
            <Link to="/visit" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-primary-950">Book a Visit</Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-primary-950">Your Account</Link>
            <button 
                onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                className="bg-accent text-primary-800 w-full py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest mt-4"
            >
                Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0D1A13] text-[#F5F2ED] pt-32 pb-12 px-6 md:px-24 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[50vh] h-[50vh] bg-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-24 relative z-10">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-4 mb-10 group">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
               <Leaf className="text-accent w-5 h-5" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">Organic-O-Eats</span>
          </Link>
          <p className="text-primary-950/40 text-sm leading-relaxed mb-8 font-light max-w-xs">
            Connecting you with Mother Nature's finest harvests. Sustainable, ethical, and purely organic food delivered straight from our soil.
          </p>
          <div className="flex gap-6">
             {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-accent hover:border-accent group cursor-pointer transition-all">
                  <Icon className="w-4 h-4 text-primary-950 group-hover:text-primary-800 transition-colors" />
                </div>
             ))}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-10 text-primary-950 underline decoration-accent/30 underline-offset-8">The Market</h4>
          <ul className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-950/40">
            <li className="hover:text-accent cursor-pointer transition-colors">Vegetables</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Summer Fruits</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Artisan Dairy</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Heritage Seeds</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-10 text-primary-950 underline decoration-accent/30 underline-offset-8">Community</h4>
          <ul className="flex flex-col gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-950/40">
            <li className="hover:text-accent cursor-pointer transition-colors">Our Roots</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Regenerative Farming</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Visit the Soil</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Partner With Us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-10 text-primary-950 underline decoration-accent/30 underline-offset-8">Newsroom</h4>
          <p className="text-primary-950/40 text-sm mb-8 font-light">Join 12,000+ neighbors for seasonal roadmap & farm stories.</p>
          <div className="flex flex-col gap-4">
             <div className="flex glass rounded-full p-1.5 border-white/5 focus-within:border-accent/30 transition-all">
                <input type="email" placeholder="Your email address" className="bg-transparent px-6 py-3 outline-none flex-1 text-xs text-primary-950 placeholder:text-primary-950/20" />
                <button className="bg-accent text-primary-800 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">Sign Up</button>
             </div>
             <p className="px-6 text-[8px] uppercase tracking-widest text-primary-950/20">Respecting your privacy always.</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-950/20">&copy; 2026 Organic-O-Eats &bull; Artisanally Grown</p>
        <div className="flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold text-primary-950/30">
           <span className="hover:text-accent cursor-pointer transition-colors">Policy</span>
           <span className="hover:text-accent cursor-pointer transition-colors">Terms</span>
           <span className="hover:text-accent cursor-pointer transition-colors">Shipping</span>
           <span className="hover:text-accent cursor-pointer transition-colors">Accessibility</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
