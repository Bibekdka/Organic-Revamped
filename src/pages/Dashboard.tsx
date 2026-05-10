import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Package, User as UserIcon, MapPin, Bell, ChevronRight, LogOut, Calendar } from 'lucide-react';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const { user, setUser } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const orderSnap = await getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')));
        setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const visitSnap = await getDocs(query(collection(db, 'visits'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')));
        setVisits(visitSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-cream min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-8">
           <div className="text-center p-10 bg-white rounded-[40px] cinematic-shadow border border-primary-100">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden border-4 border-white shadow-xl">
                 {user.photoURL ? <img src={user.photoURL} alt={user.displayName} /> : <UserIcon className="w-12 h-12 text-primary-300" />}
              </div>
              <h2 className="text-2xl font-serif text-primary-900 mb-1">{user.displayName || 'Harvest Member'}</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary-400 mb-6">{user.email}</p>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors mx-auto text-xs font-bold uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
           </div>

           <div className="space-y-2">
              {[
                { label: 'Order History', icon: Package, active: true },
                { label: 'Saved Addresses', icon: MapPin },
                { label: 'Farm Bookings', icon: Calendar },
                { label: 'Notification Prefs', icon: Bell },
              ].map(item => (
                <div key={item.label} className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-primary-900 text-cream' : 'hover:bg-primary-100 text-primary-700'}`}>
                   <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                   </div>
                   <ChevronRight className={`w-4 h-4 ${item.active ? 'text-primary-600' : 'text-primary-300'}`} />
                </div>
              ))}
              {user.email === 'stersblog@gmail.com' && (
                <button onClick={() => navigate('/admin')} className="w-full text-left p-5 rounded-2xl hover:bg-accent hover:text-cream transition-all flex items-center gap-4 text-accent font-bold mt-8 border border-dashed border-accent">
                   <Package className="w-5 h-5" />
                   <span className="text-sm">Admin Dashboard</span>
                </button>
              )}
           </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-12">
            <section>
              <h3 className="text-3xl font-serif mb-8 text-primary-900 italic">Recent Harvests</h3>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => <div key={i} className="h-32 bg-primary-100 rounded-3xl" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 bg-white rounded-[40px] border border-dashed border-primary-300 text-center">
                  <p className="text-primary-400 font-serif text-xl italic mb-6">No orders yet.</p>
                  <button onClick={() => navigate('/store')} className="bg-primary-900 text-cream px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Shop Now</button>
                </div>
              ) : (
                <div className="space-y-6">
                   {orders.map(order => (
                     <div key={order.id} className="bg-white p-8 rounded-[40px] cinematic-shadow border border-primary-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-6 items-center">
                           <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center"><Package className="text-primary-600" /></div>
                           <div>
                              <div className="text-[10px] uppercase font-bold text-primary-400 mb-1">Order #{order.id.slice(0, 8)}</div>
                              <div className="text-lg font-serif">Harvest Hub Delivery</div>
                           </div>
                        </div>
                        <div className="text-center md:text-right">
                           <div className="text-2xl font-bold text-primary-900">${order.total?.toFixed(2)}</div>
                           <div className={`text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-full inline-block mt-2 ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                              {order.status}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-3xl font-serif mb-8 text-primary-900 italic">Farm Visits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {visits.map(visit => (
                   <div key={visit.id} className="bg-primary-950 p-10 rounded-[50px] text-cream">
                      <Calendar className="text-accent mb-6 w-8 h-8" />
                      <div className="text-2xl font-serif mb-2 italic">Guided Farm Tour</div>
                      <div className="text-sm text-primary-400 mb-8">{visit.date} • {visit.timeSlot}</div>
                      <div className="flex justify-between items-center bg-primary-900 p-4 rounded-2xl">
                         <span className="text-xs uppercase font-bold tracking-widest">{visit.visitors} Visitors</span>
                         <span className="text-[10px] uppercase font-bold py-1 px-3 bg-accent text-cream rounded-full">{visit.status}</span>
                      </div>
                   </div>
                 ))}
                 {visits.length === 0 && !loading && (
                   <div className="col-span-1 md:col-span-2 py-12 bg-primary-100 rounded-[50px] text-center">
                      <p className="text-primary-500 font-serif italic mb-6">No farm visits scheduled.</p>
                      <button onClick={() => navigate('/visit')} className="text-primary-800 underline uppercase tracking-widest font-bold text-[10px]">Book a Visit</button>
                   </div>
                 )}
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}
