import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Visit() {
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: 'Morning (9 AM - 12 PM)',
    visitors: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'visits'), {
        ...bookingData,
        userId: user.uid,
        userName: user.displayName || user.email,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-cream min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-16 rounded-[60px] cinematic-shadow text-center max-w-xl"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif mb-4 italic text-primary-900">Booking Confirmed!</h1>
          <p className="text-primary-700 mb-12">We can't wait to welcome you to Organic-O-Eats. You'll receive a confirmation email shortly with directions.</p>
          <div className="bg-primary-50 p-6 rounded-3xl mb-12 text-left space-y-3">
             <div className="flex justify-between text-sm"><span className="text-primary-400">Date</span><span className="font-bold">{bookingData.date}</span></div>
             <div className="flex justify-between text-sm"><span className="text-primary-400">Time</span><span className="font-bold">{bookingData.timeSlot}</span></div>
             <div className="flex justify-between text-sm"><span className="text-primary-400">Visitors</span><span className="font-bold">{bookingData.visitors} Persons</span></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="bg-primary-900 text-cream px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest">Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-24 px-6 md:px-12 flex flex-col lg:flex-row gap-20 items-center justify-center">
      <div className="max-w-xl w-full">
        <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Farm Experience</span>
        <h1 className="text-6xl font-serif mb-8 italic">Step into <br /> the roots.</h1>
        <p className="text-primary-700 text-lg mb-12 leading-relaxed">
          Experience the life behind your food. Join us for a guided farm tour, pick your own seasonal produce, and enjoy a farm-fresh lunch under our heritage oaks.
        </p>
        <div className="space-y-6">
           <div className="flex gap-4 items-center text-primary-800">
              <div className="w-12 h-12 bg-white rounded-2xl cinematic-shadow flex items-center justify-center"><Calendar className="text-primary-500 w-5 h-5" /></div>
              <span>Available Tueday - Sunday</span>
           </div>
           <div className="flex gap-4 items-center text-primary-800">
              <div className="w-12 h-12 bg-white rounded-2xl cinematic-shadow flex items-center justify-center"><Clock className="text-primary-500 w-5 h-5" /></div>
              <span>Tour starts at 10 AM & 2 PM</span>
           </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white p-12 rounded-[50px] cinematic-shadow border border-primary-100">
           <div className="flex justify-between mb-12">
              {[1, 2].map(s => (
                <div key={s} className={`h-1 flex-1 mx-1 rounded-full ${step >= s ? 'bg-primary-600' : 'bg-primary-100'}`} />
              ))}
           </div>

           <AnimatePresence mode="wait">
             {step === 1 ? (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h3 className="text-2xl font-serif mb-8 text-primary-900">Choose your date</h3>
                 <div className="space-y-6 mb-12">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mb-2 block">Visit Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-primary-50 border border-primary-100 p-4 rounded-2xl outline-none focus:ring-2 ring-primary-500 transition-all"
                        value={bookingData.date}
                        onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mb-2 block">Time Slot</label>
                      <select 
                        className="w-full bg-primary-50 border border-primary-100 p-4 rounded-2xl outline-none"
                        value={bookingData.timeSlot}
                        onChange={e => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                      >
                        <option>Morning (9 AM - 12 PM)</option>
                        <option>Afternoon (1 PM - 4 PM)</option>
                      </select>
                    </div>
                 </div>
                 <button 
                  disabled={!bookingData.date}
                  onClick={() => setStep(2)} 
                  className="w-full bg-primary-900 text-cream py-5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-800 transition-all disabled:opacity-50"
                 >
                    Next Step <ArrowRight className="w-4 h-4" />
                 </button>
               </motion.div>
             ) : (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h3 className="text-2xl font-serif mb-8 text-primary-900">Visitor Details</h3>
                 <div className="space-y-6 mb-12">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mb-2 block">Number of Visitors</label>
                      <div className="flex items-center gap-6 justify-center bg-primary-50 p-6 rounded-3xl">
                         <button onClick={() => setBookingData({...bookingData, visitors: Math.max(1, bookingData.visitors - 1)})} className="text-4xl text-primary-400 hover:text-primary-800">-</button>
                         <span className="text-4xl font-serif w-12 text-center">{bookingData.visitors}</span>
                         <button onClick={() => setBookingData({...bookingData, visitors: bookingData.visitors + 1})} className="text-4xl text-primary-400 hover:text-primary-800">+</button>
                      </div>
                    </div>
                    {!user && (
                      <p className="text-xs text-red-500 font-bold text-center">Please login to confirm booking.</p>
                    )}
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => setStep(1)} className="w-1/3 border border-primary-200 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold">Back</button>
                   <button 
                    disabled={!user || isSubmitting}
                    onClick={handleSubmit}
                    className="w-2/3 bg-accent text-cream py-5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50"
                   >
                      {isSubmitting ? 'Booking...' : 'Confirm Visit'}
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
