import { useState, useMemo, useCallback } from 'react';

/**
 * Tablo sütunlarına tıklayarak sıralama yapılmasını sağlayan hook.
 *
 * @param {Array} data - Sıralanacak veri dizisi
 * @param {string} defaultKey - Varsayılan sıralama alanı
 * @param {'asc'|'desc'} defaultDir - Varsayılan sıralama yönü
 */
export default function useSortableTable(data, defaultKey = 'createdAt', defaultDir = 'desc') {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);

  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }, [sortKey, sortDir]);

  const sorted = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // null / undefined → en sona
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Tarih alanları
      if (sortKey === 'createdAt' || sortKey === 'eventStartDate' || sortKey === 'eventEndDate') {
        valA = new Date(valA);
        valB = new Date(valB);
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      // String alanları
      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB, 'tr', { sensitivity: 'base' });
        return sortDir === 'asc' ? cmp : -cmp;
      }

      // Sayısal
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
  }, [data, sortKey, sortDir]);

  return { sorted, sortKey, sortDir, handleSort };
}
