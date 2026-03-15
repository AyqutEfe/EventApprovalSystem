import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { petitionService } from '../../services/petitionService';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MyPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await petitionService.getMyPetitions();
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dilekçelerim</h1>
          <p className="text-slate-400 mt-1">Oluşturduğunuz tüm dilekçeler</p>
        </div>
        <Link
          to="/petitions/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-blue-600/30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Dilekçe
        </Link>
      </div>

      {petitions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-white font-medium mb-1">Henüz dilekçe yok</h3>
          <p className="text-slate-500 text-sm">İlk dilekçenizi oluşturmak için yukarıdaki butona tıklayın.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Tarih</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Lokasyon</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Durum</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {petitions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{p.eventName}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{format(new Date(p.eventDate), 'dd.MM.yyyy')}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{p.location}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/petitions/${p.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                    >
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
