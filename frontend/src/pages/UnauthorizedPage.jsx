import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-paper-desk flex items-center justify-center px-4 font-kalam">
      <div className="text-center paper-card p-12 rounded-3xl shadow-xl rotate-[1deg]">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 border border-red-200 mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-ink mb-2">Yetkisiz Erişim</h1>
        <p className="text-slate-600 mb-8 font-bold text-lg">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
