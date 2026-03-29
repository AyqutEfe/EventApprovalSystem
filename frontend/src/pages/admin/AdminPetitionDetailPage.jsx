import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petitionService } from '../../services/petitionService';
import { adminService } from '../../services/adminService';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminPetitionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, type: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPetition();
  }, [id]);

  const fetchPetition = async () => {
    try {
      const response = await petitionService.getById(id);
      setPetition(response.data);
    } catch (error) {
      toast.error('Dilekçe bulunamadı');
      navigate('/admin/petitions/pending');
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
      const safeEventName = petition.eventName.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, '_');
      const safeClubName = petition.clubName.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, '_');
      link.setAttribute('download', `${safeEventName} _ ${safeClubName}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Belge indiriliyor...');
    } catch (error) {
      toast.error('Belge indirme başarısız');
    }
  };

  const handleAction = async () => {
    setActionLoading(true);
    try {
      if (modal.type === 'approve') {
        await adminService.approve(id);
        toast.success('Dilekçe onaylandı!');
      } else {
        await adminService.reject(id, rejectReason);
        toast.success('Dilekçe reddedildi');
      }
      navigate('/admin/petitions/pending');
    } catch (error) {
      const message = error.response?.data?.message || 'İşlem başarısız';
      toast.error(message);
    } finally {
      setActionLoading(false);
      setModal({ open: false, type: null, customMessage: null });
      setRejectReason('');
    }
  };

  const handleApproveClick = async () => {
    setActionLoading(true);
    try {
      const { data: events } = await petitionService.checkDate(petition.eventStartDate, petition.eventEndDate);
      const otherEvents = events.filter(e => e.id !== petition.id);
      
      if (otherEvents.length > 0) {
        const eventNames = otherEvents.map(e => e.eventName).join(', ');
        setModal({ 
          open: true, 
          type: 'approve', 
          customMessage: `Bu tarihte ${eventNames} etkinliği var. Yine de onaylamak istiyor musunuz?` 
        });
      } else {
        setModal({ open: true, type: 'approve' });
      }
    } catch (error) {
       toast.error('Tarih kontrolü başarısız oldu');
    } finally {
       setActionLoading(false);
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
            <p className="text-slate-600 text-sm mt-1">Kulüp: {petition.clubName} • Başkan: {petition.createdByUsername}</p>
          </div>
          <StatusBadge status={petition.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Etkinlik Tarihi</p>
            <p className="text-ink font-medium">
              {petition.eventStartDate === petition.eventEndDate
                ? format(new Date(petition.eventStartDate), 'dd.MM.yyyy')
                : `${format(new Date(petition.eventStartDate), 'dd.MM.yyyy')} - ${format(new Date(petition.eventEndDate), 'dd.MM.yyyy')}`}
            </p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Etkinlik Saati</p>
            <p className="text-ink font-medium">
              {petition.eventStartTime === petition.eventEndTime
                ? petition.eventStartTime
                : `${petition.eventStartTime} - ${petition.eventEndTime}`}
            </p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Etkinlik Yeri</p>
            <p className="text-ink font-medium">{petition.location}</p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Oluşturan</p>
            <p className="text-ink font-medium">{petition.createdByUsername}</p>
          </div>
          <div className="bg-paper-input border border-slate-300 rounded-xl p-4 col-span-2">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Belge Oluşturma Tarihi</p>
            <p className="text-ink font-medium">{petition.createdAt ? format(new Date(petition.createdAt), 'dd.MM.yyyy HH:mm') : '—'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Etkinliğin İçeriği</p>
            <p className="text-ink leading-relaxed">{petition.eventContent || '—'}</p>
          </div>
          {petition.supportInfo && (
            <div>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Destek Veren Kurum ve Desteğin Niteliği</p>
              <p className="text-ink leading-relaxed">{petition.supportInfo}</p>
            </div>
          )}
          {petition.speakerInfo && (() => {
            let speakers = [];
            try { speakers = JSON.parse(petition.speakerInfo); } catch { speakers = []; }
            return speakers.length > 0 ? (
              <div>
                <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Konuşmacılar</p>
                <div className="space-y-2">
                  {speakers.map((s, i) => (
                    <div key={i} className="bg-paper-input border border-slate-300 rounded-lg px-3 py-2">
                      <p className="text-ink font-medium text-sm">{s.fullName}</p>
                      {(s.title || s.company) && (
                        <p className="text-slate-500 text-xs">
                          {s.company ? s.company + (s.title ? ', ' + s.title : '') : s.title}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
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

        {petition.status !== 'REJECTED' && petition.filePath && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition shadow-md cursor-pointer mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Belgeyi İndir (.docx)
          </button>
        )}

        {petition.status === 'PENDING_ADMIN' && (
          <div className="flex gap-3 pt-4 border-t border-slate-300">
            <button
              onClick={() => setModal({ open: true, type: 'reject' })}
              className="px-6 py-3 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded-xl transition cursor-pointer"
            >
              Reddet
            </button>
            <button
              onClick={handleApproveClick}
              className="flex-1 py-3 bg-ink hover:bg-slate-800 text-white font-semibold rounded-xl transition cursor-pointer shadow-md"
            >
              Final Onay Ver
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => {
          setModal({ open: false, type: null, customMessage: null });
          setRejectReason('');
        }}
        onConfirm={handleAction}
        title={modal.type === 'approve' ? 'Final Onay' : 'Dilekçeyi Reddet'}
        message={modal.customMessage || `"${petition.eventName}" dilekçesi ${modal.type === 'approve' ? 'onaylanacak' : 'reddedilecek'}. Emin misiniz?`}
        confirmText={modal.type === 'approve' ? 'Onayla' : 'Reddet'}
        confirmColor={modal.type === 'approve' ? 'green' : 'red'}
        loading={actionLoading}
      >
        {modal.type === 'reject' && (
          <div className="mt-4">
            <label className="block text-sm font-bold text-ink mb-1.5">Ret Sebebi (Opsiyonel)</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 bg-paper-input border border-slate-300 hover:border-slate-400 focus:border-red-500 rounded-xl text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition resize-none"
              placeholder="Dilekçenin reddedilme sebebini yazınız..."
              rows={3}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
