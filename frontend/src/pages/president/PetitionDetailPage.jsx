import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petitionService } from '../../services/petitionService';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PetitionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetition();
  }, [id]);

  const fetchPetition = async () => {
    try {
      const response = await petitionService.getById(id);
      setPetition(response.data);
    } catch (error) {
      toast.error('Dilekçe bulunamadı');
      navigate('/petitions/my');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await petitionService.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dilekce_${id}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Belge indiriliyor...');
    } catch (error) {
      toast.error('Belge indirme başarısız');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!petition) return null;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Geri
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{petition.eventName}</h1>
            <p className="text-slate-500 text-sm mt-1">Kulüp: {petition.clubName}</p>
          </div>
          <StatusBadge status={petition.status} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Etkinlik Tarihi</p>
            <p className="text-white font-medium">{format(new Date(petition.eventDate), 'dd.MM.yyyy')}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Lokasyon</p>
            <p className="text-white font-medium">{petition.location}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Oluşturan</p>
            <p className="text-white font-medium">{petition.createdByUsername}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Oluşturulma</p>
            <p className="text-white font-medium">{petition.createdAt ? format(new Date(petition.createdAt), 'dd.MM.yyyy HH:mm') : '—'}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Açıklama</p>
          <p className="text-slate-300 leading-relaxed">{petition.description}</p>
        </div>

        {petition.status === 'APPROVED' && petition.filePath && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Belgeyi İndir (.docx)
          </button>
        )}
      </div>
    </div>
  );
}
