/**
 * Tıklanabilir, sıralanabilir tablo başlık hücresi.
 * Aktif sıralama yönüne göre ▲ veya ▼ oku gösterir.
 */
export default function SortableHeader({ label, sortKey, currentSortKey, sortDir, onSort, align = 'left' }) {
  const isActive = currentSortKey === sortKey;

  const arrow = isActive
    ? sortDir === 'asc' ? ' ▲' : ' ▼'
    : '';

  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`${align === 'right' ? 'text-right' : 'text-left'}
        text-xs font-bold uppercase tracking-wider px-6 py-4 cursor-pointer select-none
        transition-colors
        ${isActive ? 'text-ink' : 'text-slate-600 hover:text-ink'}`}
    >
      {label}{arrow}
    </th>
  );
}
