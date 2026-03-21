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

  const handleAction = async () => {
    setActionLoading(true);
    try {
      if (modal.type === 'approve') {
        await adminService.approve(id);
        toast.success('Dilekçe onaylandı!');
      } else {
        await adminService.reject(id);
        toast.success('Dilekçe reddedildi');
      }
      navigate('/admin/petitions/pending');
    } catch (error) {
      const message = error.response?.data?.message || 'İşlem başarısız';
      toast.error(message);
    } finally {
      setActionLoading(false);
      setModal({ open: false, type: null, customMessage: null });
    }
  };

  const handleApproveClick = async () => {
    setActionLoading(true);
    try {
      const { data: events } = await petitionService.checkDate(petition.eventDate);
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
            <p className="text-slate-500 text-sm mt-1">Kulüp: {petition.clubName} • Başkan: {petition.createdByUsername}</p>
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

        <div className="mb-8">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Açıklama</p>
          <p className="text-slate-300 leading-relaxed">{petition.description}</p>
        </div>

        {petition.status === 'PENDING_ADMIN' && (
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setModal({ open: true, type: 'reject' })}
              className="px-6 py-3 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition cursor-pointer"
            >
              Reddet
            </button>
            <button
              onClick={handleApproveClick}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              Final Onay Ver
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, type: null, customMessage: null })}
        onConfirm={handleAction}
        title={modal.type === 'approve' ? 'Final Onay' : 'Dilekçeyi Reddet'}
        message={modal.customMessage || `"${petition.eventName}" dilekçesi ${modal.type === 'approve' ? 'onaylanacak' : 'reddedilecek'}. Emin misiniz?`}
        confirmText={modal.type === 'approve' ? 'Onayla' : 'Reddet'}
        confirmColor={modal.type === 'approve' ? 'green' : 'red'}
        loading={actionLoading}
      />
    </div>
  );
}
