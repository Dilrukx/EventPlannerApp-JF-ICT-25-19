const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const pad = (n) => String(n).padStart(2, '0');


export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toHHmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const parseDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const combine = (iso, hhmm) => {
  const [y, m, d] = iso.split('-').map(Number);
  const [h, mi] = hhmm.split(':').map(Number);
  return new Date(y, m - 1, d, h, mi);
};

export const timeToDate = (hhmm) => {
  const now = new Date();
  if (!hhmm) return now;
  const [h, m] = hhmm.split(':').map(Number);
  now.setHours(h, m, 0, 0);
  return now;
};


export const formatDateLong = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};


export const formatDateField = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};


export const formatTime = (hhmm) => {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad(h12)}:${pad(m)} ${suffix}`;
};


export const formatDateTime = (iso, hhmm) => `${formatDateLong(iso)} • ${formatTime(hhmm)}`;

export const isUpcoming = (ev) => combine(ev.date, ev.time).getTime() >= Date.now();
