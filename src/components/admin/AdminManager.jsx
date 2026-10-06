import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminManager({ isMainAdmin }) {
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isMainAdmin) return;

    const unsub = onSnapshot(collection(db, 'admins'), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        email: doc.id,
        ...doc.data(),
      }));
      setAdmins(list);
    });

    return () => unsub();
  }, [isMainAdmin]);

  if (!isMainAdmin) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm">
        Akses Terbatas: Pengelolaan Additional Admin hanya dapat dilakukan oleh Main Admin.
      </div>
    );
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const cleanEmail = newEmail.toLowerCase().trim();
    if (!cleanEmail) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'admins', cleanEmail), {
        enabled: true,
        createdAt: new Date(),
      });
      setNewEmail('');
    } catch (err) {
      console.error('Gagal menambah admin:', err);
      alert('Gagal menambahkan admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (email, currentStatus) => {
    try {
      await setDoc(doc(db, 'admins', email), { enabled: !currentStatus }, { merge: true });
    } catch (err) {
      alert('Gagal mengupdate status admin: ' + err.message);
    }
  };

  const handleDeleteAdmin = async (email) => {
    if (!confirm(`Hapus ${email} dari daftar admin?`)) return;
    try {
      await deleteDoc(doc(db, 'admins', email));
    } catch (err) {
      alert('Gagal menghapus admin: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-babyblue p-6">
        <h3 className="text-lg font-bold text-sky-900 mb-4">Tambah Additional Admin</h3>
        <form onSubmit={handleAddAdmin} className="flex gap-3 max-w-md">
          <input
            type="email"
            required
            placeholder="emailadmin@gmail.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="input-babyblue flex-1 text-sm"
          />
          <button type="submit" disabled={loading} className="btn-babyblue text-sm whitespace-nowrap">
            {loading ? 'Menambahkan...' : 'Tambah Admin'}
          </button>
        </form>
      </div>

      <div className="card-babyblue p-6">
        <h3 className="text-lg font-bold text-sky-900 mb-4">Daftar Additional Admin</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-slate-500 font-medium">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-slate-400">
                    Belum ada Additional Admin.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm.email} className="hover:bg-sky-50/50 transition">
                    <td className="py-3 px-4 font-medium text-slate-700">{adm.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        adm.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {adm.enabled ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(adm.email, adm.enabled)}
                        className="text-xs px-3 py-1 rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-100 transition"
                      >
                        {adm.enabled ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(adm.email)}
                        className="text-xs px-3 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
