import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { advisorService } from '../../services/advisorService';
import StatusBadge from '../../components/StatusBadge';
import SortableHeader from '../../components/SortableHeader';
import useSortableTable from '../../hooks/useSortableTable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdvisorPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedClub, setSelectedClub] = useState('');

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

  // Benzersiz kulüp isimlerini çıkar
  const clubNames = useMemo(() => {
    const names = [...new Set(petitions.map((p) => p.clubName).filter(Boolean))];
    return names.sort((a, b) => a.localeCompare(b, 'tr'));
  }, [petitions]);

  // Durum + kulüp filtresini uygula
  const filteredData = useMemo(() => {
    let result = petitions;
    if (filter !== "ALL") result = result.filter((p) => p.status === filter);
    if (selectedClub) result = result.filter((p) => p.clubName === selectedClub);
    return result;
  }, [petitions, filter, selectedClub]);

  // Sıralama
  const { sorted: filtered, sortKey, sortDir, handleSort } = useSortableTable(filteredData, 'createdAt', 'desc');

  const filters = [
      { key: "ALL", label: "Tümü" },
      { key: "PENDING_ADVISOR", label: "Onay Bekleyenler" },
      { key: "PENDING_ADMIN", label: "Müdür Onayı Bekleyenler" },
      { key: "APPROVED", label: "Onaylı" },
      { key: "REJECTED", label: "Reddedilmiş" },
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gelen Dilekçeler</h1>
          <p className="text-slate-600 mt-1 mb-4">Kulübünüze ait dilekçeleri inceleyin ve onaylayın</p>
        </div>
      </div>

      {/* Filtre Sekmeleri + Kulüp Filtresi aynı satırda */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
          {filters.map((f) => (
              <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 text-sm font-bold rounded-xl border transition whitespace-nowrap cursor-pointer ${
                      filter === f.key
                          ? "bg-ink text-white border-ink shadow-md"
                          : "bg-paper-input border-slate-300 text-slate-600 hover:text-ink hover:bg-paper-bg"
                  }`}
              >
                  {f.label}
                  {f.key === "ALL" && ` (${petitions.length})`}
                  {f.key !== "ALL" &&
                      ` (${petitions.filter((p) => p.status === f.key).length})`}
              </button>
          ))}

          {clubNames.length > 1 && (
              <select
                  id="club-filter"
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
          )}
      </div>

      {filtered.length === 0 ? (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-ink font-bold mb-1">Dilekçe bulunmuyor</h3>
          <p className="text-slate-600 text-sm">
            Bu filtreyle eşleşen dilekçe yok.
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
              {filtered.map((p) => (
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
                    <Link to={`/advisor/petitions/${p.id}`} className="text-ink hover:text-slate-600 underline text-sm font-bold transition">
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
