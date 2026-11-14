// Shared helpers for event start and end times ("HH:MM", 24-hour).

export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Half-hour slots from 06:00 to 23:30. */
export const TIME_SLOTS = Array.from({ length: 36 }, (_, i) => {
  const mins = 6 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
});

/** "14:30" -> "2:30 pm" */
export function formatTime(hhmm) {
  if (!hhmm || !TIME_RE.test(hhmm)) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "2:00 pm to 6:00 pm", or '' when either time is missing. */
export function formatTimeRange(start, end) {
  return start && end ? `${formatTime(start)} to ${formatTime(end)}` : '';
}
