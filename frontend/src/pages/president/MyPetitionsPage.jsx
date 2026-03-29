import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { petitionService } from '../../services/petitionService';
import StatusBadge from '../../components/StatusBadge';
import SortableHeader from '../../components/SortableHeader';
import useSortableTable from '../../hooks/useSortableTable';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MyPetitionsPage() {
  const [petitions, setPetitions] = useState([]);
  const [filter, setFilter] = useState('ALL');
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

  const filteredData = useMemo(() => {
    let result = petitions;
    if (filter !== 'ALL') {
      result = result.filter(p => p.status === filter);
    }
    return result;
  }, [petitions, filter]);

  const { sorted: filtered, sortKey, sortDir, handleSort } = useSortableTable(filteredData, 'createdAt', 'desc');

  const filters = [
      { key: "ALL", label: "Tümü" },
      { key: "PENDING_ADVISOR", label: "Danışman Onayı B." },
      { key: "PENDING_ADMIN", label: "Müdür Onayı B." },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dilekçelerim</h1>
          <p className="text-slate-600 mt-1">Oluşturduğunuz tüm dilekçeler</p>
        </div>
        <Link
          to="/petitions/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition shadow-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Dilekçe
        </Link>
      </div>

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
      </div>

      {filtered.length === 0 ? (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-ink font-bold mb-1">Dilekçe bulunamadı</h3>
          <p className="text-slate-600 text-sm">Bu filtreyle eşleşen bir dilekçeniz yok.</p>
        </div>
      ) : (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <SortableHeader label="Etkinlik Adı" sortKey="eventName" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Belge Oluşturma Tarihi" sortKey="createdAt" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Etkinlik Tarihi" sortKey="eventStartDate" currentSortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
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
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/petitions/${p.id}`}
                      className="text-ink hover:text-slate-600 text-sm font-bold underline transition"
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
