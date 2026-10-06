import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase'; // ✅ Import DB sudah ada

import AdminManager from './AdminManager';
import AccountStockManager from './AccountStockManager';
import ProductManager from './ProductManager';
import GameManager from './GameManager';
import CategoryManager from './CategoryManager';
import OrderManager from './OrderManager';
import PaymentManager from './PaymentManager';
import VipManager from './VipManager';
import VipPaymentManager from './VipPaymentManager'; // ✅ Dipisah biar ga bug
import SettingsManager from './SettingsManager';
import SocialContactsManager from './SocialContactsManager';

export default function AdminPanel({ isMainAdmin, user }) {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // Fetch Ringkasan Statistik Real-time dari Firestore
  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      let pending = 0;
      let completed = 0;
      let revenue = 0;

      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') pending++;
        if (data.status === 'completed') {
          completed++;
          revenue += Number(data.price || 0);
        }
      });

      setStats((prev) => ({
        ...prev,
        totalOrders: snap.size,
        pendingOrders: pending,
        completedOrders: completed,
        totalRevenue: revenue,
      }));
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setStats((prev) => ({ ...prev, totalProducts: snap.size }));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStats((prev) => ({ ...prev, totalUsers: snap.size }));
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubUsers();
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Produk' },
    { id: 'games', label: 'Game' },
    { id: 'categories', label: 'Kategori' },
    { id: 'orders', label: 'Pesanan' },
    { id: 'payments', label: 'Pembayaran' },
    { id: 'vipMembers', label: 'VIP Members' },
    { id: 'vipPayments', label: 'VIP Pembayaran' },
    { id: 'accountStock', label: 'Stok Akun' },
    { id: 'socials', label: 'Sosmed & WA Admin' },
    { id: 'settings', label: 'Pengaturan' },
  ];

  if (isMainAdmin) {
    menuItems.push({ id: 'additionalAdmins', label: 'Additional Admins', highlight: true });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header Admin Dashboard */}
      <div className="card-babyblue p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-sky-900 dark:text-sky-100 tracking-tight">Admin Panel V4.5.5</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang, <span className="font-semibold text-sky-600 dark:text-sky-400">{user?.email}</span> 
            {isMainAdmin && <span className="ml-2 px-2.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full font-bold border border-amber-200 dark:border-amber-800">Main Admin</span>}
          </p>
        </div>
      </div>

      {/* Sub-Tab Navigation Scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {menuItems.map((item) => {
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                item.highlight
                  ? isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800'
                  : isActive
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-200 dark:shadow-none'
                  : 'card-babyblue text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Area Konten Komponen */}
      <div>
        {activeSubTab === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card-babyblue p-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Pendapatan</span>
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">Rp {stats.totalRevenue.toLocaleString('id-ID')}</span>
            </div>
            <div className="card-babyblue p-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Pesanan</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.totalOrders}</span>
            </div>
            <div className="card-babyblue p-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pesanan Pending</span>
              <span className="text-2xl font-black text-amber-500">{stats.pendingOrders}</span>
            </div>
            <div className="card-babyblue p-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pesanan Selesai</span>
              <span className="text-2xl font-black text-emerald-500">{stats.completedOrders}</span>
            </div>
            <div className="card-babyblue p-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Produk</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.totalProducts}</span>
            </div>
            <div className="card-babyblue p-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Pengguna</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.totalUsers}</span>
            </div>
          </div>
        )}

        {activeSubTab === 'products' && <ProductManager />}
        {activeSubTab === 'games' && <GameManager />}
        {activeSubTab === 'categories' && <CategoryManager />}
        {activeSubTab === 'orders' && <OrderManager />}
        {activeSubTab === 'payments' && <PaymentManager />}
        {activeSubTab === 'vipMembers' && <VipManager />}
        {/* FIX BENTROK TAB: Panggil VipPaymentManager yang terpisah */}
        {activeSubTab === 'vipPayments' && <VipPaymentManager />}
        {activeSubTab === 'accountStock' && <AccountStockManager />}
        {activeSubTab === 'socials' && <SocialContactsManager />}
        {activeSubTab === 'settings' && <SettingsManager />}
        {activeSubTab === 'additionalAdmins' && <AdminManager isMainAdmin={isMainAdmin} />}
      </div>
    </div>
  );
}
