import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import SortableHeader from '../../components/SortableHeader';
import useSortableTable from '../../hooks/useSortableTable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PendingPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState('');

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

  // Benzersiz kulüp isimlerini çıkar
  const clubNames = useMemo(() => {
    const names = [...new Set(petitions.map((p) => p.clubName).filter(Boolean))];
    return names.sort((a, b) => a.localeCompare(b, 'tr'));
  }, [petitions]);

  // Kulüp filtresini uygula
  const filteredData = useMemo(() => {
    if (!selectedClub) return petitions;
    return petitions.filter((p) => p.clubName === selectedClub);
  }, [petitions, selectedClub]);

  // Sıralama
  const { sorted, sortKey, sortDir, handleSort } = useSortableTable(filteredData, 'createdAt', 'desc');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Onay Bekleyenler</h1>
          <p className="text-slate-600 mt-1">Final onay için bekleyen dilekçeler</p>
        </div>

        {clubNames.length > 1 && (
          <div className="flex items-center gap-2">
            <select
              id="club-filter-pending"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-300
                         bg-paper-input text-slate-600 cursor-pointer
                         hover:text-ink hover:bg-paper-bg transition
                         focus:outline-none shadow-sm"
            >
              <option value="">🏷 Tüm Kulüpler</option>
              {clubNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-ink font-bold mb-1">Bekleyen dilekçe yok</h3>
          <p className="text-slate-600 text-sm">
            {selectedClub ? 'Seçilen kulübe ait bekleyen dilekçe bulunamadı.' : 'Onay bekleyen dilekçe bulunmuyor.'}
          </p>
        </div>
      ) : (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <SortableHeader label="Etkinlik Adı" sortKey="eventName" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Belge Oluşturma Tarihi" sortKey="createdAt" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Etkinlik Tarihi" sortKey="eventStartDate" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Kulüp" sortKey="clubName" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Durum" sortKey="status" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <th className="text-right text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sorted.map((p) => (
                <tr key={p.id} className="hover:bg-paper-input transition">
                  <td className="px-6 py-4 text-ink font-medium">{p.eventName}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm">
                      {format(new Date(p.createdAt), "dd.MM.yyyy")}
                  </td>
                  <td className="px-6 py-4 text-slate-700 text-sm">
                    {p.eventStartDate === p.eventEndDate
                      ? format(new Date(p.eventStartDate), 'dd.MM.yyyy')
                      : `${format(new Date(p.eventStartDate), 'dd.MM.yyyy')} - ${format(new Date(p.eventEndDate), 'dd.MM.yyyy')}`}
                  </td>
                  <td className="px-6 py-4 text-slate-700 text-sm">{p.clubName}</td>
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
