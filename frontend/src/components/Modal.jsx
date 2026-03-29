export default function Modal({ isOpen, onClose, onConfirm, title, message, children, confirmText = 'Onayla', confirmColor = 'blue', loading = false }) {
  if (!isOpen) return null;

  const colorClasses = {
    blue: 'bg-ink hover:bg-slate-800 shadow-md',
    red: 'bg-red-600 hover:bg-red-500 shadow-md',
    green: 'bg-ink hover:bg-slate-800 shadow-md',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative paper-card border-slate-300 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 rotate-[1deg]">
        <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
        {message && <p className="text-slate-600 font-bold mb-6">{message}</p>}
        {children && <div className="mb-6">{children}</div>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-paper-input border-2 border-slate-400 text-slate-600 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_#94a3b8] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#94a3b8] active:translate-y-[3px] active:shadow-none disabled:opacity-50"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                confirmColor === 'red' 
                    ? 'bg-rose-50 border-2 border-rose-600 text-rose-700 shadow-[3px_3px_0px_0px_#e11d48] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#e11d48] active:translate-y-[3px] active:shadow-none'
                : confirmColor === 'green'
                    ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-700 shadow-[3px_3px_0px_0px_#059669] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#059669] active:translate-y-[3px] active:shadow-none'
                : 'bg-blue-50 border-2 border-blue-600 text-blue-700 shadow-[3px_3px_0px_0px_#2563eb] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#2563eb] active:translate-y-[3px] active:shadow-none'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                İşleniyor...
              </span>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
