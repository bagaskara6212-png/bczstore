import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Settings, Menu, X, ShieldCheck, CheckCircle2, LogOut, LogIn, Home, ShoppingBag, Award, HelpCircle, User, Shield, Wrench } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, isAdmin, isVip, onOpenAuth, onOpenSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ TAB ALL TOOLS DITAMBAHKAN DI SINI
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'produk', label: 'Produk', icon: ShoppingBag },
    { id: 'alltools', label: 'All Tools', icon: Wrench }, 
    { id: 'pesanan', label: 'Pesanan', icon: User },
    { id: 'vip', label: 'VIP', icon: Award },
    { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
  ];

  if (isAdmin) navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 animate-slide-down ${scrolled ? 'liquid-glass py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div onClick={() => setActiveTab('beranda')} className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-sky-500/30 group-active:scale-90 transition-transform">
            BCZ
          </div>
          <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white hidden sm:block">
            BCZ <span className="text-sky-500">Store</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 dark:border-slate-700/50 shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {item.label}
              </button>
            );
          })}
        </nav>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 relative z-50">
          <button onClick={onOpenSettings} className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700 transition-all shadow-xs border border-sky-100 dark:border-slate-700">
            <Settings className="w-4 h-4" />
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-sky-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                {user.displayName || user.email?.split('@')[0]}
                {isAdmin && <ShieldCheck className="w-4 h-4 text-amber-500 ml-1" />}
              </span>
              <button onClick={() => signOut(auth)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-babyblue text-xs px-4 py-2 flex items-center gap-1.5">
              <LogIn className="w-4 h-4" /> Masuk
            </button>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 text-slate-800 dark:text-white transition-all">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-4 liquid-glass rounded-3xl animate-slide-up flex flex-col gap-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full p-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 transition-all ${activeTab === item.id ? 'bg-sky-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
          {user && (
            <button onClick={() => { signOut(auth); setMobileMenuOpen(false); }} className="w-full p-3 rounded-2xl text-xs font-bold text-left flex items-center gap-3 text-rose-600 bg-rose-50/50 dark:bg-rose-950/40 mt-2 border border-rose-100 dark:border-rose-900/50">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          )}
        </div>
      )}
    </header>
  );
}
