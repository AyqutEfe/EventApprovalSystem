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
        <h1 className="text-2xl font-bold text-ink">Gelen Dilekçeler</h1>
        <p className="text-slate-600 mt-1">Kulübünüze ait dilekçeleri inceleyin ve onaylayın</p>
      </div>

      {petitions.length === 0 ? (
        <div className="paper-card border-slate-300 rounded-2xl p-12 text-center shadow-md">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-ink font-bold mb-1">Dilekçe bulunmuyor</h3>
          <p className="text-slate-600 text-sm">Kulübünüze ait bekleyen dilekçe yok.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingPetitions.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3">Onay Bekleyenler ({pendingPetitions.length})</h2>
              <div className="paper-card border-slate-300 rounded-2xl overflow-hidden shadow-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Tarih</th>
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Başkan</th>
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Durum</th>
                      <th className="text-right text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pendingPetitions.map((p) => (
                      <tr key={p.id} className="hover:bg-paper-input transition">
                        <td className="px-6 py-4 text-ink font-medium">{p.eventName}</td>
                        <td className="px-6 py-4 text-slate-700 text-sm">
                          {p.eventStartDate === p.eventEndDate
                            ? format(new Date(p.eventStartDate), 'dd.MM.yyyy')
                            : `${format(new Date(p.eventStartDate), 'dd.MM.yyyy')} - ${format(new Date(p.eventEndDate), 'dd.MM.yyyy')}`}
                        </td>
                        <td className="px-6 py-4 text-slate-700 text-sm">{p.createdByUsername}</td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/advisor/petitions/${p.id}`} className="text-ink hover:text-slate-600 underline text-sm font-bold transition">
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
              <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Diğer ({otherPetitions.length})</h2>
              <div className="paper-card border-slate-300 rounded-2xl overflow-hidden shadow-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Etkinlik</th>
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Tarih</th>
                      <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Durum</th>
                      <th className="text-right text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {otherPetitions.map((p) => (
                      <tr key={p.id} className="hover:bg-paper-input transition">
                        <td className="px-6 py-4 text-ink font-medium">{p.eventName}</td>
                        <td className="px-6 py-4 text-slate-700 text-sm">
                          {p.eventStartDate === p.eventEndDate
                            ? format(new Date(p.eventStartDate), 'dd.MM.yyyy')
                            : `${format(new Date(p.eventStartDate), 'dd.MM.yyyy')} - ${format(new Date(p.eventEndDate), 'dd.MM.yyyy')}`}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/advisor/petitions/${p.id}`} className="text-ink hover:text-slate-600 underline text-sm font-bold transition">
                            Detay →
                          </Link>
                        </td>
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
