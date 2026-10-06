import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck, Clock, Zap, Calculator } from 'lucide-react';

export default function HelpSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'Bagaimana cara membeli Robux 5 Hari (Gamepass)?',
      a: 'Pilih nominal Robux yang kamu inginkan, masukkan Username Roblox kamu, lalu atur harga Gamepass di akun Roblox kamu sesuai angka yang tertera di kalkulator pajak (tax 30%). Setelah itu, tempelkan link Gamepass kamu dan lanjutkan ke pembayaran.',
      icon: Clock,
    },
    {
      q: 'Apa bedanya Robux 5 Hari dan Robux Instan?',
      a: 'Robux 5 Hari dikirim via Gamepass dan memerlukan waktu pending 5 hari dari pihak Roblox sebelum masuk ke akunmu. Sedangkan Robux Instan dikirim via Login Akun dan langsung masuk ke akunmu secara cepat.',
      icon: Zap,
    },
    {
      q: 'Kenapa harga Gamepass di Roblox harus di-set lebih tinggi?',
      a: 'Roblox mengenakan potongan pajak (tax) sebesar 30% untuk setiap transaksi Gamepass. Sistem BCZ Store otomatis menghitung harga Gamepass agar Robux bersih yang kamu terima sesuai dengan pesananmu.',
      icon: Calculator,
    },
    {
      q: 'Apakah transaksi di BCZ Store aman?',
      a: 'Sangat aman 100%! Kami menggunakan enkripsi data dan seluruh proses pengisian dilakukan oleh admin profesional terpercaya tanpa risiko banned.',
      icon: ShieldCheck,
    },
    {
      q: 'Bagaimana jika pesanan saya mengalami kendala / pending lama?',
      a: 'Kamu bisa mengecek status pesanan menggunakan widget "Lacak Status Pesanan" di beranda pakai Order ID, atau langsung menghubungi CS Admin via WhatsApp dengan melampirkan Order ID kamu.',
      icon: HelpCircle,
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Bantuan */}
      <div className="card-babyblue p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 text-center space-y-2">
        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mx-auto border border-sky-200 dark:border-sky-800">
          <HelpCircle className="w-6 h-6 animate-bounce" />
        </div>
        <h2 className="text-xl font-black text-sky-950 dark:text-sky-100">Pusat Bantuan & FAQ</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Punya pertanyaan seputar cara order Robux, sistem tax, atau kendala transaksi? Temukan jawabannya di bawah!
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="card-babyblue bg-white dark:bg-slate-900 border dark:border-slate-800 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 rounded-xl shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-sky-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-sky-50 dark:border-slate-800/80 bg-sky-50/40 dark:bg-slate-800/40 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Box Hubungi CS Admin */}
      <div className="p-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-black">Masih butuh bantuan lain?</h3>
          <p className="text-xs text-sky-100">Tim Customer Service BCZ Store siap membantu kendala kamu 24/7!</p>
        </div>
        <a
          href="https://wa.me/6281234567890?text=Halo%20Admin%20BCZ%20Store,%20saya%20butuh%20bantuan"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 bg-white text-sky-700 hover:bg-sky-50 text-xs font-black rounded-2xl flex items-center gap-2 shadow-sm shrink-0 transition"
        >
          <MessageCircle className="w-4 h-4 text-emerald-500" /> Hubungi CS WhatsApp
        </a>
      </div>
    </div>
  );
}
