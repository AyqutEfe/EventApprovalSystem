import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function ClubManagementPage() {
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', advisorId: '', presidentId: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clubsRes, usersRes] = await Promise.all([
        adminService.getClubs(),
        adminService.getUsers(),
      ]);
      setClubs(clubsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const advisors = users.filter(u => u.role === 'ADVISOR');
  const presidents = users.filter(u => u.role === 'PRESIDENT');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.advisorId || !form.presidentId) {
      toast.error('Tüm alanları doldurun');
      return;
    }
    setFormLoading(true);
    try {
      await adminService.createClub({
        name: form.name,
        advisorId: Number(form.advisorId),
        presidentId: Number(form.presidentId),
      });
      toast.success('Kulüp başarıyla oluşturuldu!');
      setForm({ name: '', advisorId: '', presidentId: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Kulüp oluşturulurken hata oluştu';
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Kulüp Yönetimi</h1>
          <p className="text-slate-400 mt-1">Kulüpleri oluşturun ve yönetin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kulüp
        </button>
      </div>

      {/* Kulüp Oluşturma Formu */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Yeni Kulüp Oluştur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Kulüp Adı</label>
              <input
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Örn: Bilişim Kulübü"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Danışman</label>
                <select
                  value={form.advisorId}
                  onChange={(e) => setForm(prev => ({ ...prev, advisorId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-800">Danışman seçin</option>
                  {advisors.map(u => (
                    <option key={u.id} value={u.id} className="bg-slate-800">
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                {advisors.length === 0 && <p className="text-amber-400 text-xs mt-1">Henüz ADVISOR rolünde kullanıcı yok</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Başkan</label>
                <select
                  value={form.presidentId}
                  onChange={(e) => setForm(prev => ({ ...prev, presidentId: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-800">Başkan seçin</option>
                  {presidents.map(u => (
                    <option key={u.id} value={u.id} className="bg-slate-800">
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                {presidents.length === 0 && <p className="text-amber-400 text-xs mt-1">Henüz PRESIDENT rolünde kullanıcı yok</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                {formLoading ? 'Oluşturuluyor...' : 'Kulüp Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kulüp Listesi */}
      {clubs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-white font-medium mb-1">Henüz kulüp yok</h3>
          <p className="text-slate-500 text-sm">İlk kulübü oluşturmak için yukarıdaki butona tıklayın.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Kulüp Adı</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Danışman</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Başkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{club.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{club.advisorUsername}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{club.presidentUsername}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
