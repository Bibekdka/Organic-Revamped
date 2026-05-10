import React from 'react';

export default function About() {
  return (
    <div className="bg-primary-800 text-primary-950 pt-48 pb-32 px-6 md:px-24">
      <div className="max-w-5xl mx-auto">
        <span className="badge mb-4 inline-block">Our Heritage</span>
        <h1 className="text-6xl md:text-8xl font-serif mb-16 tracking-tight">Driven by nature, <br /><span className="italic font-light text-accent">inspired</span> by generations.</h1>
        
        <div className="aspect-[21/9] rounded-[60px] overflow-hidden mb-20 cinematic-shadow border border-white/10">
           <img src="https://images.unsplash.com/photo-1595163456106-932d201be7a6?q=80&w=2000" alt="Farmer in field" className="w-full h-full object-cover opacity-80" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start mb-48">
          <div>
            <h2 className="text-4xl font-serif mb-8 text-white tracking-tight">The Seed of an Idea</h2>
            <p className="text-primary-950/60 leading-relaxed mb-8 font-light text-lg">Started in 1984 as a small family plot, Organic-O-Eats has grown into a beacon of sustainable agriculture. Our founder, Arthur Green, believed that technology and nature shouldn't be at odds.</p>
            <p className="text-primary-950/60 leading-relaxed font-light text-lg">Today, we combine centuries-old farming wisdom with cutting-edge environmental science to produce food that is not only delicious but restorative for the environment.</p>
          </div>
          <div className="space-y-12">
             <div className="glass p-10 rounded-[48px]">
                <h4 className="font-serif text-2xl mb-4 italic text-accent">Our Philosophy</h4>
                <p className="text-sm text-primary-950/70 font-light leading-relaxed">We don't just farm; we steward. Every decision is made with the next seven generations in mind, ensuring a legacy of fertile soil.</p>
             </div>
             <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-serif text-2xl mb-4 italic text-white">Sustainability First</h4>
                <p className="text-sm text-primary-950/50 font-light leading-relaxed">100% renewable energy usage, zero-waste packaging, and carbon-negative harvesting cycles are our standard.</p>
             </div>
          </div>
        </div>

        <div className="text-center py-32 border-y border-white/5">
           <h3 className="text-5xl font-serif mb-16 tracking-tight">Meet the Stewards</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
              {[
                { name: "Arthur Green", role: "Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
                { name: "Sarah Field", role: "Head of Agri-Science", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400" },
                { name: "Leo Root", role: "Sustainability Expert", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" }
              ].map(person => (
                <div key={person.name} className="group">
                  <div className="aspect-[3/4] rounded-[48px] overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/10 scale-95 group-hover:scale-100">
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-serif text-2xl text-white mb-2">{person.name}</h4>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{person.role}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
