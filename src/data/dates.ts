const TR_MONTHS = [
  'ocak',
  'şubat',
  'mart',
  'nisan',
  'mayıs',
  'haziran',
  'temmuz',
  'ağustos',
  'eylül',
  'ekim',
  'kasım',
  'aralık',
];

/** "6 Ekim 2026" → "2026-10-06". Tanınmayan biçimde undefined döner (JSON-LD'de alan atlanır). */
export function trDateToIso(value: string): string | undefined {
  const match = value.trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  if (!match) return undefined;
  const month = TR_MONTHS.indexOf(match[2].toLocaleLowerCase('tr-TR'));
  if (month === -1) return undefined;
  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}
