import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AllPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await adminService.getAllPetitions();
      setPetitions(response.data);
    } catch (error) {
      toast.error('Dilekçeler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL' ? petitions : petitions.filter(p => p.status === filter);

  const filters = [
    { key: 'ALL', label: 'Tümü' },
    { key: 'PENDING_ADVISOR', label: 'Danışman Bekliyor' },
    { key: 'PENDING_ADMIN', label: 'Admin Bekliyor' },
    { key: 'APPROVED', label: 'Onaylı' },
    { key: 'REJECTED', label: 'Reddedilmiş' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tüm Dilekçeler</h1>
        <p className="text-slate-400 mt-1">Sistemdeki tüm dilekçelerin arşivi</p>
      </div>

      {/* Filtre Sekmeleri */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition whitespace-nowrap cursor-pointer ${
              filter === f.key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {f.label}
            {f.key === 'ALL' && ` (${petitions.length})`}
            {f.key !== 'ALL' && ` (${petitions.filter(p => p.status === f.key).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <h3 className="text-white font-medium mb-1">Sonuç bulunamadı</h3>
          <p className="text-slate-500 text-sm">Bu filtreyle eşleşen dilekçe yok.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Tarih</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Kulüp</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Başkan</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Durum</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{p.eventName}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{format(new Date(p.eventDate), 'dd.MM.yyyy')}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{p.clubName}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{p.createdByUsername}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/petitions/${p.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                      Detay →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
