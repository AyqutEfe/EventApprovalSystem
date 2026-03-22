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
            className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-ink bg-paper-input hover:bg-paper-bg border border-slate-300 rounded-xl transition cursor-pointer"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 text-sm font-medium text-white rounded-xl transition shadow-lg cursor-pointer disabled:opacity-50 ${colorClasses[confirmColor]}`}
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
