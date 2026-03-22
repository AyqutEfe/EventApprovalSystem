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
        className="inline-flex items-center gap-2 text-slate-600 hover:text-ink text-sm mb-6 transition cursor-pointer font-bold"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Geri
      </button>

      <div className="paper-card border-slate-300 rounded-2xl p-8 shadow-md">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink">{petition.eventName}</h1>
            <p className="text-slate-600 text-sm mt-1">Kulüp: {petition.clubName}</p>
          </div>
          <StatusBadge status={petition.status} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Etkinlik Tarihi</p>
            <p className="text-ink font-medium">{format(new Date(petition.eventDate), 'dd.MM.yyyy')}</p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Lokasyon</p>
            <p className="text-ink font-medium">{petition.location}</p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Oluşturan</p>
            <p className="text-ink font-medium">{petition.createdByUsername}</p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Oluşturulma</p>
            <p className="text-ink font-medium">{petition.createdAt ? format(new Date(petition.createdAt), 'dd.MM.yyyy HH:mm') : '—'}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Açıklama</p>
          <p className="text-ink leading-relaxed">{petition.description}</p>
        </div>

        {petition.status === 'REJECTED' && petition.rejectionReason && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-400 text-sm font-medium">Reddedilme Sebebi</p>
                <p className="text-red-300/80 text-sm mt-1">{petition.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {petition.status === 'APPROVED' && petition.filePath && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition shadow-md cursor-pointer mt-4"
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
