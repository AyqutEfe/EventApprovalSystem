import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PendingPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await adminService.getPendingPetitions();
      setPetitions(response.data);
    } catch (error) {
      toast.error('Dilekçeler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-ink">Onay Bekleyenler</h1>
        <p className="text-slate-600 mt-1">Final onay için bekleyen dilekçeler</p>
      </div>

      {petitions.length === 0 ? (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-ink font-bold mb-1">Bekleyen dilekçe yok</h3>
          <p className="text-slate-600 text-sm">Onay bekleyen dilekçe bulunmuyor.</p>
        </div>
      ) : (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Tarih</th>
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Kulüp</th>
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Lokasyon</th>
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Durum</th>
                <th className="text-right text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {petitions.map((p) => (
                <tr key={p.id} className="hover:bg-paper-input transition">
                  <td className="px-6 py-4 text-ink font-medium">{p.eventName}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm">{format(new Date(p.eventDate), 'dd.MM.yyyy')}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm">{p.clubName}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm">{p.location}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/petitions/${p.id}`} className="text-ink hover:text-slate-600 underline font-bold text-sm transition">
                      İncele →
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
