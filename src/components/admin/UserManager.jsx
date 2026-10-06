import { useEffect, useMemo, useState } from "react";
import {
  LoaderCircle,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";

import {
  deleteUser,
  getUsers,
} from "../../data/firestore";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Gagal memuat users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) return users;

    return users.filter(
      (user) =>
        String(user.email || "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.displayName || "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.uid || "")
          .toLowerCase()
          .includes(keyword)
    );
  }, [users, search]);

  const handleDelete = async (uid) => {
    if (
      !window.confirm(
        "Hapus data profil user dari Firestore? Akun Google mereka tidak ikut terhapus."
      )
    ) {
      return;
    }

    try {
      await deleteUser(uid);

      setUsers((current) =>
        current.filter(
          (user) => user.id !== uid
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Gagal menghapus profil."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black">
          Users
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Data profil akun yang tersimpan di Firestore.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari nama, email, UID..."
            className="w-full rounded-xl border border-white/10 bg-[#15151c] py-3 pl-10 pr-4 text-sm outline-none focus:border-red-500/50"
          />
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/5"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15151c]">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <LoaderCircle
              size={28}
              className="animate-spin text-red-500"
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-600">
            Tidak ada user.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-5 py-4 text-xs text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-xs text-gray-500">
                    UID
                  </th>

                  <th className="px-5 py-4 text-right text-xs text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt=""
                            className="h-9 w-9 rounded-full"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                            <User size={16} />
                          </div>
                        )}

                        <span className="font-semibold">
                          {user.displayName ||
                            "Tanpa nama"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {user.email || "-"}
                    </td>

                    <td className="max-w-[220px] truncate px-5 py-4 text-xs text-gray-600">
                      {user.uid ||
                        user.id}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              user.id
                            )
                          }
                          className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                          title="Hapus profil"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManager;