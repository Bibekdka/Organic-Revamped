import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { Database, Plus, Trash2, Sprout, AlertCircle, ShoppingBag, Eye } from 'lucide-react';

const SEED_PRODUCTS = [
  { name: "Organic Heirloom Carrots", price: 4.50, category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800", stock: 100, organicStatus: true, seasonal: true },
  { name: "Wildflower Honey", price: 12.00, category: "Honey", imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800", stock: 50, organicStatus: true, seasonal: false },
  { name: "Fresh Sourdough Bread", price: 6.50, category: "Organic Dairy", imageUrl: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800", stock: 20, organicStatus: true, seasonal: false },
  { name: "Alpine Strawberries", price: 8.00, category: "Fruits", imageUrl: "https://images.unsplash.com/photo-1464960350423-95c674207728?q=80&w=800", stock: 30, organicStatus: true, seasonal: true },
  { name: "Fresh Rosemary", price: 3.50, category: "Herbs", imageUrl: "https://images.unsplash.com/photo-1594313054118-813d10006368?q=80&w=800", stock: 150, organicStatus: true, seasonal: false },
  { name: "Raw Goat Milk", price: 9.50, category: "Organic Dairy", imageUrl: "https://images.unsplash.com/photo-1517045759804-f2a000dbd9b8?q=80&w=800", stock: 15, organicStatus: true, seasonal: false },
  { name: "Sunflower Seeds", price: 5.00, category: "Seeds", imageUrl: "https://images.unsplash.com/photo-1596464528188-ec9dfbc991a0?q=80&w=800", stock: 200, organicStatus: true, seasonal: false },
  { name: "Heritage Kale", price: 4.00, category: "Vegetables", imageUrl: "https://images.unsplash.com/photo-1524179524541-1ac6604297af?q=80&w=800", stock: 80, organicStatus: true, seasonal: true },
];

export default function Admin() {
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ products: 0, orders: 0, visits: 0 });

  const seedData = async () => {
    setLoading(true);
    try {
      const productCol = collection(db, 'products');
      for (const product of SEED_PRODUCTS) {
        await addDoc(productCol, {
          ...product,
          rating: 4.5 + Math.random() * 0.5,
          createdAt: new Date().toISOString()
        });
      }
      alert("Database seeded successfully!");
      fetchStats();
    } catch (error) {
       console.error(error);
       alert("Error seeding data. Check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
     try {
        const prodSnap = await getDocs(collection(db, 'products'));
        const orderSnap = await getDocs(collection(db, 'orders'));
        const visitSnap = await getDocs(collection(db, 'visits'));
        setStats({
          products: prodSnap.size,
          orders: orderSnap.size,
          visits: visitSnap.size
        });
     } catch (e) {
       console.error(e);
     }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-cream min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
           <h1 className="text-5xl font-serif">Admin Dashboard</h1>
           <button 
            disabled={loading}
            onClick={seedData}
            className="bg-accent text-cream px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-opacity-90 cinematic-shadow"
           >
              <Database className="w-4 h-4" />
              {loading ? 'Seeding...' : 'Seed Sample Data'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           {[
             { label: "Products", value: stats.products, icon: Sprout, color: "text-primary-500" },
             { label: "Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-500" },
             { label: "Visits", value: stats.visits, icon: Eye, color: "text-accent" },
           ].map(stat => (
             <div key={stat.label} className="bg-white p-10 rounded-[40px] cinematic-shadow border border-primary-100">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-6`} />
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-400 mb-2">{stat.label}</div>
                <div className="text-5xl font-serif">{stat.value}</div>
             </div>
           ))}
        </div>

        <div className="bg-primary-950 p-12 rounded-[60px] text-cream">
           <div className="flex items-center gap-4 mb-8 text-accent">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-2xl font-serif italic">Operational Control</h3>
           </div>
           <p className="text-primary-300 max-w-2xl mb-12 leading-relaxed">
             This is a production-grade infrastructure shell. Use the seeding tool to populate your catalog with realistic farm data. Real-time inventory and order processing are connected to your Firestore instance.
           </p>
           <div className="flex flex-wrap gap-4">
              <button className="bg-primary-800 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-primary-500 border border-transparent transition-all">Add Product</button>
              <button className="bg-primary-800 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-primary-500 border border-transparent transition-all">Manage Orders</button>
              <button className="bg-primary-800 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-primary-500 border border-transparent transition-all">Visit Bookings</button>
           </div>
        </div>
      </div>
    </div>
  );
}
