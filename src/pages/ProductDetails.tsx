import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, ChevronLeft, Star, Leaf, ShieldCheck, Truck, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Product Details Page
 * Displays focused product information along with AI-generated culinary insights.
 */
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const { addToCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Orchestrates product data fetching and auxiliary insights (AI & Related items).
     */
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      const productPath = `products/${id}`;
      
      try {
        // 1. Fetch main product document
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as any;
          setProduct(data);
          
          // 2. Fetch AI Insights lazily to not block UX
          import('../services/geminiService').then(({ getProductTips }) => {
            getProductTips(data.name).then(setAiInsight);
          }).catch(console.error);

          // 3. Fetch related products in the same category
          const collectionPath = 'products';
          try {
            const q = query(
              collection(db, collectionPath), 
              where('category', '==', data.category), 
              limit(4)
            );
            const relSnap = await getDocs(q);
            setRelated(relSnap.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(d => d.id !== id)
            );
          } catch (relError) {
            handleFirestoreError(relError, OperationType.LIST, collectionPath);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, productPath);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-primary-800 flex items-center justify-center font-serif text-3xl italic text-primary-950 animate-pulse">Growing details...</div>;
  if (!product) return <div className="min-h-screen bg-primary-800 flex flex-col items-center justify-center text-primary-950">
    <h1 className="text-4xl font-serif mb-8">Harvest Lost.</h1>
    <button onClick={() => navigate('/store')} className="bg-accent text-primary-800 px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold">Back to Store</button>
  </div>;

  return (
    <div className="bg-primary-800 text-primary-950 min-h-screen pt-48 pb-32 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-950/40 hover:text-accent transition-colors mb-12 text-[10px] uppercase tracking-widest font-bold">
           <ChevronLeft className="w-4 h-4" />
           Back to Harvest
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-48">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] rounded-[60px] overflow-hidden cinematic-shadow border border-white/10 relative"
          >
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-800/50 to-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="badge">{product.category}</span>
              {product.organicStatus && (
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
                  <Leaf className="w-3 h-3" />
                  Regenerative Organic
                </div>
              )}
            </div>

            <h1 className="text-6xl md:text-8xl font-serif text-primary-950 mb-8 italic tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-8 mb-12">
               <span className="text-5xl font-bold text-white">${product.price.toFixed(2)}</span>
               <div className="flex items-center gap-2 glass px-5 py-2.5 rounded-full text-accent font-bold text-[10px] uppercase tracking-widest">
                  <Star className="w-4 h-4 fill-accent" />
                  <span>4.9 (124 reviews)</span>
               </div>
            </div>

            <p className="text-primary-950/60 text-xl font-light leading-relaxed mb-16 max-w-xl">
               {product.description || "Our farm-fresh selection is nurtured with care, ensuring the highest nutritional value and the purest taste nature intended. Sustainable and ethical from seed to plate."}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-16">
               <div className="glass p-8 rounded-[40px] flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><Truck className="text-accent w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-primary-950/40 tracking-widest">Delivery</div>
                    <div className="text-sm font-bold text-primary-950">24-48 Hours</div>
                  </div>
               </div>
               <div className="glass p-8 rounded-[40px] flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><ShieldCheck className="text-accent w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-primary-950/40 tracking-widest">Quality</div>
                    <div className="text-sm font-bold text-primary-950">Farm Verified</div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-8 glass px-8 py-5 rounded-full self-start">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl text-primary-950/40 font-light hover:text-accent font-serif">-</button>
                   <span className="text-2xl font-serif w-12 text-center text-primary-950">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="text-2xl text-primary-950/40 font-light hover:text-accent font-serif">+</button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-grow bg-accent text-primary-800 py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-2xl shadow-accent/20 active:scale-95"
                >
                   <ShoppingBag className="w-4 h-4" />
                   Add to Basket
                </button>
            </div>

            {/* AI Insights */}
            <div className="glass p-10 rounded-[56px] border border-accent/20 relative overflow-hidden mt-16 group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Leaf className="w-32 h-32" />
               </div>
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  Farm Chef's Insight
               </h4>
               <div className="text-lg text-primary-950 leading-relaxed italic font-serif">
                  &ldquo;{aiInsight || "Consulting our farm experts for the best ways to enjoy this harvest..."}&rdquo;
               </div>
            </div>
          </motion.div>
        </div>

        {/* Nutritional Details */}
        <div className="mb-48">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-20 p-20 glass rounded-[80px]">
              <div>
                 <h3 className="text-4xl font-serif mb-10 italic text-white tracking-tight">Nutritional Value</h3>
                 <p className="text-primary-950/50 leading-relaxed mb-10 text-lg font-light">{product.nutritionalInfo || "Rich in vitamins, minerals, and enzymes. Our organic certification ensures no harmful chemicals, allowing the natural nutrient density to flourish as nature intended."}</p>
                 <div className="space-y-6">
                    {["Antioxidant Rich", "High Fiber", "Low Glycemic", "Mineral Dense"].map(tag => (
                      <div key={tag} className="flex gap-4 items-center text-[10px] font-bold tracking-[0.2em] text-primary-950/60 uppercase">
                         <div className="w-2 h-2 bg-accent rounded-full" />
                         {tag}
                      </div>
                    ))}
                 </div>
              </div>
              <div>
                 <h3 className="text-4xl font-serif mb-10 italic text-white tracking-tight">Farming Method</h3>
                 <p className="text-primary-950/50 leading-relaxed mb-10 text-lg font-light">{product.farmingMethod || "Cultivated using regenerative agricultural techniques. We utilize crop rotation, natural composting, and zero-till methods to preserve the microbial life in the soil."}</p>
                 <div className="aspect-video rounded-[48px] overflow-hidden border border-white/10 cinematic-shadow bg-black/20">
                    <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000" alt="Farmer soil" className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 transition-opacity" />
                 </div>
              </div>
           </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-16">
               <h3 className="text-5xl font-serif italic text-white">You might also harvest...</h3>
               <Link to="/store" className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-accent/30 pb-1">View Collection</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(item => (
                <Link to={`/product/${item.id}`} key={item.id} className="group glass rounded-[48px] p-8 transition-all hover:-translate-y-2">
                   <div className="aspect-square rounded-[32px] overflow-hidden mb-8 bg-white/5 border border-white/5">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                   </div>
                   <h4 className="text-2xl font-serif text-primary-950 text-center mb-2 tracking-tight">{item.name}</h4>
                   <p className="text-center text-accent font-bold text-sm tracking-widest uppercase">${item.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
