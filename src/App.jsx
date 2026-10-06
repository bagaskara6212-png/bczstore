import React, { useState, useEffect, Component } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import useTheme from './hooks/useTheme';
import SmoothView from './components/ui/SmoothView';
import AuroraBackground from './components/ui/AuroraBackground'; // 🎬 ABSOLUTE CINEMA
import MarqueeBanner from './components/ui/MarqueeBanner';     // 🎬 ABSOLUTE CINEMA

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BannerSlider from './components/BannerSlider';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import VipSection from './components/vip/VipSection';
import MyAccounts from './components/MyAccounts';
import HelpSection from './components/HelpSection';
import AdminPanel from './components/admin/AdminPanel';
import AllTools from './components/tools/AllTools'; 
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import LoadingScreen from './components/LoadingScreen';
import PromoModal from './components/PromoModal';
import RecentOrdersToast from './components/RecentOrdersToast';

const MAIN_ADMIN_EMAIL = "bagaskara6212@gmail.com";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Cinema Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 p-8 rounded-3xl text-center max-w-md w-full border border-rose-900 shadow-2xl">
            <h2 className="text-xl font-black text-rose-500">Cinema Crashed 🎬💥</h2>
            <p className="text-xs text-slate-400 mt-2">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="w-full btn-babyblue py-3 mt-4">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('beranda');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [darkMode, setDarkMode] = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const email = currentUser.email.toLowerCase().trim();
        const mainEmail = MAIN_ADMIN_EMAIL.toLowerCase().trim();
        const isMain = email === mainEmail;
        setIsMainAdmin(isMain);

        try {
          let hasAdminAccess = isMain;
          if (!hasAdminAccess) {
            const adminDoc = await getDoc(doc(db, 'additionalAdmins', email));
            if (adminDoc.exists()) hasAdminAccess = true;
          }
          setIsAdmin(hasAdminAccess);
        } catch (e) { setIsAdmin(isMain); }

        try {
          const vipSnap = await getDoc(doc(db, 'vipMembers', email));
          setIsVip(vipSnap.exists());
        } catch (e) { setIsVip(false); }
      } else {
        setIsAdmin(false); setIsMainAdmin(false); setIsVip(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) setShowAuthModal(true);
  }, [authLoading, user]);

  if (authLoading) return <LoadingScreen />;

  return (
    // Hapus background default karena sudah di-handle oleh AuroraBackground
    <div className="min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-500 relative overflow-x-hidden">
      
      {/* 🎬 LATAR BELAKANG ANIMASI AURORA (Absolute Cinema) */}
      <AuroraBackground />

      {/* NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isAdmin={isAdmin}
        isVip={isVip}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* 🎬 RUNNING TEXT MARQUEE */}
      <MarqueeBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10">
        <SmoothView key={activeTab}>
          {activeTab === 'beranda' && (
            <div className="space-y-8">
              <BannerSlider />
              <Hero onExplore={() => setActiveTab('produk')} />
              <ProductList limit={8} user={user} />
            </div>
          )}
          {activeTab === 'produk' && <ProductList user={user} />}
          {activeTab === 'alltools' && <AllTools />}
          {activeTab === 'pesanan' && <MyAccounts user={user} isAdmin={isAdmin} isMainAdmin={isMainAdmin} isVip={isVip} />}
          {activeTab === 'vip' && <VipSection user={user} />}
          {activeTab === 'bantuan' && <HelpSection />}
          {activeTab === 'admin' && isAdmin && <AdminPanel isMainAdmin={isMainAdmin} user={user} />}
        </SmoothView>
      </main>

      <Footer setActiveTab={setActiveTab} />

      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} darkMode={darkMode} setDarkMode={setDarkMode} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} forceWelcome={!user} />}
      
      <PromoModal />
      <RecentOrdersToast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
