import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { petitionService } from '../../services/petitionService';
import toast from 'react-hot-toast';

const schema = z.object({
  eventName: z.string().min(1, 'Etkinlik adı boş olamaz'),
  eventDate: z.string().min(1, 'Etkinlik tarihi boş olamaz'),
  location: z.string().min(1, 'Etkinlik yeri boş olamaz'),
  description: z.string().min(1, 'Açıklama boş olamaz'),
});

export default function CreatePetitionPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await petitionService.create(data);
      toast.success('Dilekçe başarıyla oluşturuldu!');
      navigate('/petitions/my');
    } catch (error) {
      const message = error.response?.data?.message || 'Dilekçe oluşturulurken hata oluştu';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Yeni Dilekçe Oluştur</h1>
        <p className="text-slate-400 mt-1">Etkinlik bilgilerini girerek yeni bir dilekçe oluşturun</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Etkinlik Adı</label>
            <input
              {...register('eventName')}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Örn: Bilgisayar Mühendisliği Semineri"
            />
            {errors.eventName && <p className="text-red-400 text-xs mt-1">{errors.eventName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Etkinlik Tarihi</label>
            <input
              type="date"
              {...register('eventDate')}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.eventDate && <p className="text-red-400 text-xs mt-1">{errors.eventDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Lokasyon</label>
            <input
              {...register('location')}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Örn: Balkan Yerleşkesi Amfi"
            />
            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Açıklama</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Etkinlik hakkında detaylı açıklama..."
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/petitions/my')}
              className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-600/30"
            >
              {loading ? 'Oluşturuluyor...' : 'Dilekçe Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
