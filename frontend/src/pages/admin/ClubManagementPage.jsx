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
          <h1 className="text-2xl font-bold text-ink">Kulüp Yönetimi</h1>
          <p className="text-slate-600 mt-1">Kulüpleri oluşturun ve yönetin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition shadow-md cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kulüp
        </button>
      </div>

      {/* Kulüp Oluşturma Formu */}
      {showForm && (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-ink mb-4">Yeni Kulüp Oluştur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Kulüp Adı</label>
              <input
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition"
                placeholder="Örn: Bilişim Kulübü"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Danışman</label>
                <select
                  value={form.advisorId}
                  onChange={(e) => setForm(prev => ({ ...prev, advisorId: e.target.value }))}
                  className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition appearance-none cursor-pointer"
                >
                  <option value="" className="bg-paper-input text-slate-500">Danışman seçin</option>
                  {advisors.map(u => (
                    <option key={u.id} value={u.id} className="bg-paper-input">
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                {advisors.length === 0 && <p className="text-red-600 font-bold text-xs mt-1">Henüz ADVISOR rolünde kullanıcı yok</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Başkan</label>
                <select
                  value={form.presidentId}
                  onChange={(e) => setForm(prev => ({ ...prev, presidentId: e.target.value }))}
                  className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition appearance-none cursor-pointer"
                >
                  <option value="" className="bg-paper-input text-slate-500">Başkan seçin</option>
                  {presidents.map(u => (
                    <option key={u.id} value={u.id} className="bg-paper-input">
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                {presidents.length === 0 && <p className="text-red-600 font-bold text-xs mt-1">Henüz PRESIDENT rolünde kullanıcı yok</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-ink bg-paper-input hover:bg-paper-bg border border-slate-300 rounded-xl transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-ink hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition disabled:opacity-50 cursor-pointer shadow-md"
              >
                {formLoading ? 'Oluşturuluyor...' : 'Kulüp Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kulüp Listesi */}
      {clubs.length === 0 ? (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-ink font-bold mb-1">Henüz kulüp yok</h3>
          <p className="text-slate-600 text-sm">İlk kulübü oluşturmak için yukarıdaki butona tıklayın.</p>
        </div>
      ) : (
        <div className="paper-card border-slate-300 shadow-md rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Kulüp Adı</th>
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Danışman</th>
                <th className="text-left text-xs font-bold text-slate-600 uppercase tracking-wider px-6 py-4">Başkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-paper-input transition">
                  <td className="px-6 py-4 text-ink font-medium">{club.name}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm">{club.advisorUsername}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm">{club.presidentUsername}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
