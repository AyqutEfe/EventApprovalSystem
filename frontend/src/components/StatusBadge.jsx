const statusConfig = {
  PENDING_ADVISOR: {
    label: 'Danışman Onayı Bekliyor',
    classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  PENDING_ADMIN: {
    label: 'Admin Onayı Bekliyor',
    classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  APPROVED: {
    label: 'Onaylandı',
    classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  REJECTED: {
    label: 'Reddedildi',
    classes: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  );
}
