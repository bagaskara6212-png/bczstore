import {
  CheckCircle2,
  Crown,
  Percent,
  ShieldCheck,
} from "lucide-react";

function VipStatus({ isVip }) {
  if (!isVip) {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/5 p-2 text-gray-500">
            <Crown size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Belum menjadi VIP
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Bergabung untuk mendapatkan benefit khusus
              member VIP.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-yellow-500/10 p-2 text-yellow-400">
          <Crown size={20} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-yellow-400">
              BCZ VIP Aktif
            </p>

            <CheckCircle2
              size={16}
              className="text-green-400"
            />
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2">
              <Percent
                size={15}
                className="text-yellow-400"
              />

              <span className="text-xs text-gray-300">
                Harga VIP
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2">
              <ShieldCheck
                size={15}
                className="text-yellow-400"
              />

              <span className="text-xs text-gray-300">
                Member terverifikasi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VipStatus;