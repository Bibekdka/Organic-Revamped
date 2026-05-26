import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, ChevronRight, Star, ShoppingBag, Heart } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

const CATEGORIES = ["All", "Vegetables", "Fruits", "Organic Dairy", "Seeds", "Honey", "Herbs", "Seasonal Products"];

export default function Store() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const { addToCart } = useStore();

  useEffect(() => {
    /**
     * Fetches products based on the active category.
     * Implements structured error handling for Firestore calls.
     */
    const fetchProducts = async () => {
      setLoading(true);
      const collectionPath = 'products';
      try {
        const q = collection(db, collectionPath);
        let firestoreQuery;
        
        if (activeCategory !== 'All') {
          firestoreQuery = query(q, where('category', '==', activeCategory), orderBy('name'));
        } else {
          firestoreQuery = query(q, orderBy('name'));
        }

        const querySnapshot = await getDocs(firestoreQuery);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) }));
        setProducts(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="bg-primary-800 text-primary-950 min-h-screen pt-24 pb-20 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        {/* STORE HEADER: Introduction text and page title */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div>
            <span className="badge mb-4 inline-block">Direct from our soil</span>
            <h1 className="text-6xl md:text-8xl font-serif text-primary-950 mb-6 tracking-tight">The Store</h1>
            <p className="text-primary-950/60 max-w-md font-light text-lg">Everything we grow, curated for your conscious kitchen. Always organic, always fresh, always honest.</p>
          </div>
          {/* FILTER BUTTON: Controls sorting and filtering logic (to be expanded) */}
          <div className="flex gap-4">
             <div className="flex items-center gap-2 glass px-8 py-4 rounded-full cursor-pointer hover:bg-white/10 transition-all hover:scale-105 active:scale-95 duration-300">
                <Filter className="w-4 h-4 text-accent" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary-950/80">Sort & Filter</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* SIDEBAR NAVIGATION: Controls category switching */}
          <aside className="w-full lg:w-72 space-y-12">
            <div className="glass p-10 rounded-[48px] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               <h3 className="font-serif text-2xl mb-10 text-primary-950 border-b border-white/5 pb-4">Categories</h3>
               <div className="flex flex-wrap lg:flex-col gap-3">
                 {CATEGORIES.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setSearchParams({ category: cat })}
                     className={`text-left px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.04] active:scale-[0.96] ${
                       activeCategory === cat 
                         ? 'bg-accent text-primary-800 shadow-lg shadow-accent/20 font-extrabold' 
                         : 'text-primary-950/50 hover:bg-white/10 hover:text-primary-950'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="glass p-10 rounded-[48px] border border-accent/20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <h4 className="font-serif text-2xl mb-4 italic text-accent tracking-tight">Seasonal Picks</h4>
               <p className="text-primary-950/60 text-sm mb-8 font-light leading-relaxed">Our farmers have selected the absolute best of this month's harvest.</p>
               <button className="text-[10px] uppercase font-bold tracking-widest border-b border-accent/40 pb-2 text-accent hover:border-accent hover:text-white transition-all transform hover:scale-105 active:scale-95 duration-300">View Selection</button>
            </div>
          </aside>

          {/* PRODUCT GRID: Displays products fetched from the database */}
          <div className="flex-1">
            {loading ? (
              /* LOADING SKELETONS: Animated placeholders while data is being fetched */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-96 glass rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 glass rounded-[40px] border-dashed border-white/10">
                <p className="text-primary-950/40 font-serif text-2xl italic mb-4">No products found in this category.</p>
                <button onClick={() => setSearchParams({ category: 'All' })} className="text-accent text-sm font-bold uppercase tracking-widest border-b border-accent/30">View All Products</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {products.map((product, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group glass rounded-[40px] overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-950/20"
                    >
                      {/* PRODUCT CARD: Individual product view */}
                      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-white/5">
                        {/* PRODUCT IMAGE: This is controlled by the 'imageUrl' field in your Firestore 'products' collection */}
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 ease-out"
                        />
                        {/* SEASONAL TAG: Appears if 'seasonal: true' is set in the database */}
                        {product.seasonal && (
                          <div className="absolute top-4 left-4 z-10"><span className="badge bg-black/40 backdrop-blur-md border-white/10 px-3 py-1 text-[8px]">Seasonal</span></div>
                        )}
                        {/* ADD TO CART BUTTON: Overlays the image on hover */}
                        <button 
                          className="absolute bottom-4 right-4 w-10 h-10 bg-white text-primary-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                          onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <div className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:bg-white hover:text-red-500 transition-all">
                          <Heart className="w-3 h-3" />
                        </div>
                      </Link>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2 text-[9px] uppercase font-bold tracking-widest text-primary-950/40">
                           <span>{product.category}</span>
                           <div className="flex items-center gap-1 text-accent">
                              <Star className="w-2.5 h-2.5 fill-accent" />
                              <span>{product.rating?.toFixed(1) || '4.8'}</span>
                           </div>
                        </div>
                        <Link to={`/product/${product.id}`} className="block text-xl font-serif text-primary-950 mb-3 hover:text-accent transition-colors tracking-tight leading-tight">{product.name}</Link>
                        <div className="flex justify-between items-center">
                           <span className="text-lg font-bold text-accent">${product.price.toFixed(2)}</span>
                           <div className="text-[9px] uppercase font-bold tracking-widest text-primary-950/30 underline decoration-accent/30 cursor-pointer hover:text-accent transition-colors">Quick View</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
