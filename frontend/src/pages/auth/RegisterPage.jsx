import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'PRESIDENT', label: 'Kulüp Başkanı' },
  { value: 'ADVISOR', label: 'Danışman' },
  { value: 'ADMIN', label: 'Müdür Yardımcısı' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'PRESIDENT' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(form);
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-desk flex items-center justify-center px-4 font-kalam">
      <div className="w-full max-w-md relative z-10">
        {/* Logo / Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink mb-4 shadow-md rotate-[2deg]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-ink">Kayıt Ol</h1>
          <p className="text-slate-600 mt-1 font-bold text-lg">Yeni hesap oluşturun</p>
        </div>

        {/* Form Kartı */}
        <div className="paper-card rounded-2xl p-8 border-slate-300 shadow-xl -rotate-[1deg]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-lg font-bold text-ink mb-1.5">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition"
                placeholder="En az 3 karakter"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-ink mb-1.5">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition"
                placeholder="ornek@trakya.edu.tr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-ink mb-1.5">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-lg font-bold text-ink mb-1.5">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-paper-input border border-slate-300 rounded-xl text-ink font-bold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-slate-400 transition appearance-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value} className="bg-paper-input text-ink">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-ink hover:bg-slate-800 text-white font-bold text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md rotate-[0.5deg]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Kayıt yapılıyor...
                </span>
              ) : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-6 font-bold">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-ink hover:text-slate-600 underline transition">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
