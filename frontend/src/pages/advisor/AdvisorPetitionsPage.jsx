import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { advisorService } from '../../services/advisorService';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdvisorPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      const response = await advisorService.getPetitions();
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

  const pendingPetitions = petitions.filter(p => p.status === 'PENDING_ADVISOR');
  const otherPetitions = petitions.filter(p => p.status !== 'PENDING_ADVISOR');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Gelen Dilekçeler</h1>
        <p className="text-slate-400 mt-1">Kulübünüze ait dilekçeleri inceleyin ve onaylayın</p>
      </div>

      {petitions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-white font-medium mb-1">Dilekçe bulunmuyor</h3>
          <p className="text-slate-500 text-sm">Kulübünüze ait bekleyen dilekçe yok.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingPetitions.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-3">Onay Bekleyenler ({pendingPetitions.length})</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Tarih</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Başkan</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Durum</th>
                      <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pendingPetitions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 text-white font-medium">{p.eventName}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{format(new Date(p.eventDate), 'dd.MM.yyyy')}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{p.createdByUsername}</td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/advisor/petitions/${p.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                            İncele →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {otherPetitions.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Diğer ({otherPetitions.length})</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Tarih</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {otherPetitions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition">
                        <td className="px-6 py-4 text-white font-medium">{p.eventName}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{format(new Date(p.eventDate), 'dd.MM.yyyy')}</td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
