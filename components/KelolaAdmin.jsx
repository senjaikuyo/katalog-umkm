"use client";

import { useActionState, useTransition } from "react";
import { tambahAdminAction, hapusAdminAction } from "@/app/admin/pengguna/actions";

export default function KelolaAdmin({ currentUserId, adminList = [] }) {
  const [state, formAction, isPending] = useActionState(tambahAdminAction, null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleHapus = (targetId, targetEmail) => {
    if (!confirm(`Hapus admin "${targetEmail}"? Akun ini tidak akan bisa login lagi.`)) {
      return;
    }
    startDeleteTransition(async () => {
      const res = await hapusAdminAction(targetId, targetEmail);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form Tambah Admin */}
      <div className="rounded-xl border border-garis bg-permukaan p-5">
        <h2 className="text-base font-bold text-teks">Tambah Admin Baru</h2>
        <p className="mt-0.5 text-xs text-teks-lembut">
          Buat akun admin tambahan untuk mengelola katalog toko. Password minimal 8 karakter.
        </p>

        <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-1 min-w-[220px] flex-col gap-1 text-xs font-semibold text-teks">
            Email Admin
            <input
              type="email"
              name="email"
              placeholder="admin2@contoh.com"
              required
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
          </label>

          <label className="flex flex-1 min-w-[200px] flex-col gap-1 text-xs font-semibold text-teks">
            Password (min. 8 karakter)
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              minLength={8}
              required
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "+ Tambah Admin"}
          </button>
        </form>

        {state?.error && (
          <p className="mt-2 text-xs font-semibold text-bahaya">{state.error}</p>
        )}
        {state?.sukses && (
          <p className="mt-2 text-xs font-semibold text-green-600">{state.sukses}</p>
        )}
      </div>

      {/* Tabel Daftar Admin */}
      <div className="overflow-hidden rounded-xl border border-garis bg-permukaan">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-garis bg-latar text-xs uppercase text-teks-lembut">
            <tr>
              <th className="px-4 py-3">Email Admin</th>
              <th className="px-4 py-3">Tanggal Dibuat</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {adminList.map((adm) => {
              const isCurrent = adm.id === currentUserId;
              const tgl = adm.created_at
                ? new Date(adm.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-";

              return (
                <tr key={adm.id} className="hover:bg-latar/50">
                  <td className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{adm.email}</span>
                      {isCurrent && (
                        <span className="rounded-full bg-utama/10 px-2 py-0.5 text-[10px] font-bold text-utama">
                          Akun Anda
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-teks-lembut">{tgl}</td>
                  <td className="px-4 py-3 text-right">
                    {isCurrent ? (
                      <span className="text-xs font-semibold text-teks-lembut italic">
                        Tidak dapat dihapus
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleHapus(adm.id, adm.email)}
                        disabled={isDeleting}
                        className="rounded border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-bahaya hover:bg-red-50 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
