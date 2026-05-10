import React from 'react';
import { useStore } from '../store/useStore';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { user, addToCart } = useStore();
  const navigate = useNavigate();

  // Mocking wishlist since we haven't implemented Firestore persistence for it yet
  const [wishlist, setWishlist] = React.useState<any[]>([]);

  if (!user) {
    return (
      <div className="bg-cream min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <Heart className="w-20 h-20 text-red-200 mb-8" />
        <h1 className="text-4xl font-serif mb-4">Saved for later.</h1>
        <p className="text-primary-600 mb-12 max-w-sm">Login to save your favorite farm products and sync them across your devices.</p>
        <button className="bg-primary-900 text-cream px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest">Login</button>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-serif mb-16">Your Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[60px] border border-dashed border-primary-200">
             <p className="text-primary-400 font-serif text-3xl italic mb-8">Your favorite seeds haven't sprouted yet.</p>
             <button onClick={() => navigate('/store')} className="bg-primary-900 text-cream px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                Discover Harvest
                <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Iteratve over wishlist items here */}
          </div>
        )}
      </div>
    </div>
  );
}
