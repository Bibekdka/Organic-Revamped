import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, Sprout, Wind, Calendar, Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    /* MAIN HERO SECTION: Controls the top introduction of the home page */
    <div className="relative h-[95vh] flex items-center overflow-hidden hero-gradient">
      <div className="absolute inset-0 z-0">
        {/* HERO BACKGROUND IMAGE: Replace the src URL below with your main farm or brand image */}
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2000" 
          alt="Lush green farm" 
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        {/* OVERLAY: Adjust opacity or colors to make text more readable over the background image */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 md:px-24 max-w-6xl">
        {/* BADGE: Small text label above the main heading */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="badge mb-8"
        >
          Fresh from the Soil
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-8xl lg:text-9xl text-primary-950 font-serif mb-8 leading-[0.9] tracking-tight"
        >
          Nature&rsquo;s Finest, <br />
          <span className="italic font-light text-accent">Artisanally</span> Grown.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-primary-950/70 text-xl max-w-md mb-12 font-light leading-relaxed"
        >
          Discover seasonal organic harvests delivered straight from our certified regenerative farm to your kitchen doorstep.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link to="/store" className="bg-accent text-primary-800 px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 group transition-all shadow-2xl shadow-accent/20">
            Shop Today&rsquo;s Harvest
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/about" className="bg-transparent border border-white/20 hover:border-white text-primary-950 px-10 py-5 rounded-full text-sm font-light tracking-widest flex items-center justify-center gap-2 transition-all backdrop-blur-sm">
            Explore Our Story
          </Link>
        </motion.div>

        <div className="mt-20 flex gap-16 border-t border-white/10 pt-12">
          <div>
            <p className="font-serif text-3xl text-primary-950">100%</p>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Certified Organic</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-primary-950">0.4mi</p>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Avg. Food Miles</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-primary-950">24h</p>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Harvest to Table</p>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 p-12 hidden lg:block">
         <div className="flex flex-col items-center gap-8">
            <div className="writing-vertical-rl text-primary-400 text-[10px] uppercase font-bold tracking-[0.3em]">Scroll Down</div>
            <div className="w-[1px] h-24 bg-primary-800 relative overflow-hidden">
               <motion.div 
                animate={{ y: [0, 96] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-8 bg-primary-400 absolute top-0" 
               />
            </div>
         </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-10 glass rounded-[40px] group hover:-translate-y-2 transition-all duration-500">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-colors duration-500">
      <Icon className="w-8 h-8 text-accent group-hover:text-primary-800 transition-colors duration-500" />
    </div>
    <h3 className="text-2xl font-serif mb-4 text-primary-950 tracking-tight">{title}</h3>
    <p className="text-primary-950/60 text-sm font-light leading-relaxed">{desc}</p>
  </div>
);

const SectionHeading = ({ sub, title, desc, centered = false }: any) => (
  <div className={`mb-16 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}>
    <span className="badge mb-4 inline-block">{sub}</span>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary-950 mb-6 leading-tight">{title}</h2>
    {desc && <p className="text-primary-950/60 text-lg font-light leading-relaxed">{desc}</p>}
  </div>
);

export default function Home() {
  return (
    <div className="bg-primary-800 text-primary-950">
      <Hero />

      {/* SUSTAINABLE FEATURES SECTION: Highlights 3 core values (Organic, Sustainability, Local) */}
      <section className="py-32 px-6 md:px-24">
        <SectionHeading 
          sub="Our Mission"
          title="Rooted in nature, grown with purpose."
          desc="We believe in the harmony of farming. Our methods respect the soil, the season, and the soul."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Each FeatureCard corresponds to one of the 3 columns here */}
          <FeatureCard 
            icon={Leaf}
            title="100% Organic"
            desc="No synthetic pesticides or fertilizers. Only pure, nutrient-rich soil products for your wellbeing."
          />
          <FeatureCard 
            icon={Sprout}
            title="Sustainability"
            desc="Regenerative farming practices that give back to the earth more than they take."
          />
          <FeatureCard 
            icon={Wind}
            title="Local & Fresh"
            desc="Harvested at dawn, delivered to your door by dusk. The shortest path from farm to kitchen."
          />
        </div>
      </section>

      {/* SEASONAL PROMO SECTION: Large image + text block for special offers */}
      <section className="py-24 px-6 md:px-24 bg-primary-700/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-square rounded-[60px] overflow-hidden border border-white/10 cinematic-shadow">
               {/* PROMO IMAGE: Replace this URL with an image of your seasonal special (e.g., berries, honey) */}
               <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2000" alt="Fresh berries" className="w-full h-full object-cover" />
            </div>
            {/* FLOATING DISCOUNT BADGE: Controls the rotating "30% off" circle */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent rounded-full flex items-center justify-center p-6 text-center transform rotate-12 shadow-2xl text-primary-800">
               <span className="font-serif text-2xl leading-none">Seasonal Special <br /><b className="text-3xl">30% Off</b></span>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <span className="badge mb-4 inline-block">Limited Time Offer</span>
            <h2 className="text-5xl font-serif mb-8 italic text-primary-950">The Summer Berry Harvest is here.</h2>
            <p className="text-primary-950/60 mb-12 text-lg font-light leading-relaxed">
              Experience the explosion of natural sweetness. Hand-picked at the peak of ripeness, our summer berries are packed with antioxidants and vibrant flavor.
            </p>
            <Link to="/store?category=Fruits" className="inline-block bg-primary-950 text-primary-800 px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white transition-all">
              Explore Fruits
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 md:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-6xl font-serif text-accent mb-2">500+</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Products</div>
            </div>
            <div>
              <div className="text-6xl font-serif text-accent mb-2">12k</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Happy Customers</div>
            </div>
            <div>
              <div className="text-6xl font-serif text-accent mb-2">15</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Farm Partners</div>
            </div>
            <div>
              <div className="text-6xl font-serif text-accent mb-2">100%</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Eco-Friendly</div>
            </div>
        </div>
      </section>

      {/* Why Organic Section */}
      <section className="py-32 px-6 md:px-24 bg-primary-900/50">
          <SectionHeading 
            centered
            sub="Why Organic Matters"
            title="Better for you, better for the planet."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
             <div className="flex gap-6 items-start">
                <div className="glass p-4 rounded-2xl"><TrendingUp className="text-accent" /></div>
                <div>
                   <h4 className="text-xl font-serif mb-3 text-primary-950">Superior Nutrition</h4>
                   <p className="text-sm text-primary-950/60 font-light leading-relaxed">Organic crops contain significantly higher concentrations of antioxidants and vitamins compared to conventional ones.</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="glass p-4 rounded-2xl"><Calendar className="text-accent" /></div>
                <div>
                   <h4 className="text-xl font-serif mb-3 text-primary-950">Seasonal Rhythm</h4>
                   <p className="text-sm text-primary-950/60 font-light leading-relaxed">Eating with the seasons aligns your body with nature's cycle, providing the specific nutrients you need year-round.</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="glass p-4 rounded-2xl"><Star className="text-accent" /></div>
                <div>
                   <h4 className="text-xl font-serif mb-3 text-primary-950">Pure Integrity</h4>
                   <p className="text-sm text-primary-950/60 font-light leading-relaxed">Absolute transparency in our supply chain. You know exactly who grows your food and how it was nurtured.</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="glass p-4 rounded-2xl"><Users className="text-accent" /></div>
                <div>
                   <h4 className="text-xl font-serif mb-3 text-primary-950">Fair Partnerships</h4>
                   <p className="text-sm text-primary-950/60 font-light leading-relaxed">We support local farmers with fair wages and stable contracts, ensuring the future of sustainable agriculture.</p>
                </div>
             </div>
          </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 px-6 md:px-24 text-center">
         <div className="max-w-4xl mx-auto glass p-16 md:p-24 rounded-[60px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <SectionHeading 
              centered
              sub="Join the Movement"
              title="Get Fresh Updates"
            />
            <p className="mb-10 text-primary-950/60 font-light max-w-lg mx-auto">Subscribe for our harvest roadmap, exclusive recipes, and early access to seasonal drops.</p>
            <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-2 rounded-full border border-white/10 max-w-lg mx-auto backdrop-blur-md">
                <input type="email" placeholder="Enter your email" className="bg-transparent flex-1 px-6 outline-none text-sm text-primary-950 placeholder:text-primary-950/30" />
                <button className="bg-accent text-primary-800 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all whitespace-nowrap">Subscribe</button>
            </div>
         </div>
      </section>
    </div>
  );
}
