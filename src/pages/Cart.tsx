import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, ChevronLeft, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="bg-cream min-h-[70vh] py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-8">
           <ShoppingBag className="w-10 h-10 text-primary-300" />
        </div>
        <h1 className="text-4xl font-serif mb-4">Your basket is empty.</h1>
        <p className="text-primary-600 mb-12 max-w-sm">Looks like you haven't added any fresh harvest to your basket yet.</p>
        <button onClick={() => navigate('/store')} className="bg-primary-800 text-cream px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-700 hover:scale-105 active:scale-95 duration-300 transition-all">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-500 hover:text-primary-800 transition-colors mb-12 text-sm uppercase tracking-widest font-bold">
           <ChevronLeft className="w-4 h-4" />
           Keep Shopping
        </button>

        <h1 className="text-5xl font-serif mb-16">Your Harvest Basket</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
             {cart.map((item) => (
               <motion.div 
                layout
                key={item.id} 
                className="flex items-center gap-6 p-6 bg-white rounded-[32px] border border-primary-100 cinematic-shadow"
               >
                 <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary-50 flex-shrink-0 group cursor-pointer">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out" />
                 </div>
                 <div className="flex-grow">
                    <h3 className="text-xl font-serif text-primary-900">{item.name}</h3>
                    <p className="text-primary-500 font-bold">${item.price.toFixed(2)}</p>
                 </div>
                 <div className="flex items-center gap-4 bg-primary-50 px-4 py-2 rounded-full border border-primary-100">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-primary-800 hover:text-accent font-bold">-</button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-primary-800 hover:text-accent font-bold">+</button>
                 </div>
                 <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                    <Trash2 className="w-5 h-5" />
                 </button>
               </motion.div>
             ))}
             <button onClick={clearCart} className="text-xs uppercase tracking-widest text-primary-400 hover:text-red-500 transition-colors font-bold px-4">Clear Basket</button>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-primary-950 p-10 rounded-[48px] text-cream cinematic-shadow sticky top-32">
                <h3 className="font-serif text-2xl mb-8 italic">Order Summary</h3>
                <div className="space-y-4 mb-8 text-sm">
                   <div className="flex justify-between text-primary-400">
                      <span>Subtotal</span>
                      <span className="text-cream">${subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-primary-400">
                      <span>Shipping</span>
                      <span className="text-cream">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                   </div>
                   {shipping > 0 && (
                     <p className="text-[10px] text-accent">Free shipping on orders over $100</p>
                   )}
                </div>
                <div className="border-t border-primary-800 pt-6 mb-10 flex justify-between items-center bg-primary-900/50 -mx-10 px-10">
                   <span className="font-serif text-xl">Total</span>
                   <span className="text-3xl font-bold">${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-accent text-cream py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#F5F2ED] hover:text-[#0D1A13] transition-all transform hover:scale-[1.03] active:scale-[0.97] duration-300 flex items-center justify-center gap-3">
                   Secure Checkout
                   <ArrowRight className="w-4 h-4" />
                </button>
                <div className="mt-8 flex justify-center gap-4 items-center opacity-40">
                    <div className="h-6 w-10 bg-cream/20 rounded" />
                    <div className="h-6 w-10 bg-cream/20 rounded" />
                    <div className="h-6 w-10 bg-cream/20 rounded" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
