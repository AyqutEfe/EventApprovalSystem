const statusConfig = {
  PENDING_ADVISOR: {
    label: 'Danışman Onayı Bekliyor',
    classes: 'highlight-marker highlight-yellow',
  },
  PENDING_ADMIN: {
    label: 'Müdür Onayı Bekliyor',
    classes: 'highlight-marker highlight-blue',
  },
  APPROVED: {
    label: 'Onaylandı',
    classes: 'highlight-marker highlight-green',
  },
  REJECTED: {
    label: 'Reddedildi',
    classes: 'highlight-marker highlight-red',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    classes: 'text-slate-600 font-medium',
  };

  return (
    <span className={config.classes}>
      {config.label}
    </span>
  );
}
