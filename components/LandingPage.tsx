
import React from 'react';
import { View } from '../types';

interface LandingPageProps {
  onStartShopping: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartShopping }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/asubaa-hero/1920/1080?blur=2" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-8">
              KILA KITU <br />
              <span className="text-indigo-600">KIGANJANI.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium mb-12 leading-relaxed">
              ASUBAA STORE ni duka lako la mtandaoni linaloaminika kwa vinywaji bora, 
              huduma ya haraka, na bei nafuu nchini Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStartShopping}
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
              >
                Anza Kununua Sasa
              </button>
              <a 
                href="#services"
                className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest hover:border-indigo-600 transition-all active:scale-95 text-center"
              >
                Huduma Zetu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Huduma Zetu</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Kwanini Uchague ASUBAA?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">Huduma ya Haraka</h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                Tunahakikisha oda yako inafika kwa wakati bila kuchelewa. Muda wako ni thamani yetu.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">Bidhaa Bora</h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                Tunatoa vinywaji na bidhaa zenye ubora wa hali ya juu zilizothibitishwa.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-4">Bei Nafuu</h4>
              <p className="text-gray-500 leading-relaxed font-medium">
                Pata thamani halisi ya pesa yako kwa bei zetu shindani sokoni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/asubaa-about/800/1000" 
                  alt="About ASUBAA" 
                  className="rounded-[60px] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 bg-indigo-600 p-12 rounded-[40px] shadow-2xl hidden md:block">
                  <p className="text-5xl font-black text-white mb-2">100%</p>
                  <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs">Uaminifu</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Kuhusu Sisi</h2>
              <h3 className="text-5xl font-black text-gray-900 tracking-tight mb-8 leading-tight">
                Tunaamini katika <br />
                Huduma ya Kipekee.
              </h3>
              <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
                ASUBAA ONLINE STORE ni duka la mtandaoni linalotoa bidhaa bora kwa bei nafuu, 
                likiwa na huduma rahisi na ya haraka kwa wateja. Tunatoa bidhaa mbalimbali 
                zenye ubora wa kuaminika, malipo salama, na usafirishaji wa haraka hadi mlangoni kwako.
              </p>
              <div className="space-y-4 mb-12">
                {[
                  'Malipo Salama ya Mtandaoni',
                  'Usafirishaji wa Haraka',
                  'Msaada kwa Wateja 24/7',
                  'Bidhaa Halisi Pekee'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={onStartShopping}
                className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl"
              >
                Gundua Bidhaa Zetu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 rounded-[60px] mx-4 sm:mx-8 mb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Tayari Kuanza Safari <br />
            ya Ununuzi?
          </h2>
          <p className="text-indigo-100 text-xl font-medium mb-12 max-w-2xl mx-auto">
            Jiunge na maelfu ya wateja walioridhika na huduma zetu bora. 
            Oda yako ni kipaumbele chetu.
          </p>
          <button 
            onClick={onStartShopping}
            className="px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
          >
            Anza Sasa
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
