export const formatDateTime = (dateString?: string) => {
  if (!dateString) return '--';
  
  // Try to parse the date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // If it's a string like "2026-05-25 14:31:51" without T
    if (dateString.includes(' ')) {
      const parts = dateString.split(' ');
      if (parts.length === 2) {
        const [datePart, timePart] = parts;
        const [year, month, day] = datePart.split('-');
        if (timePart.includes(':')) {
           const [hour, min] = timePart.split(':');
           return `${hour}:${min} ${day}/${month}/${year}`;
        }
        return `${day}/${month}/${year}`;
      }
    }
    // Just return as is if can't parse
    return dateString;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  // If it's just a date without time (e.g., 2026-05-25) and hour is 00:00 or local midnight
  if (dateString.length === 10 || !dateString.includes('T')) {
      if (dateString.includes('-')) {
          const [y, m, d] = dateString.split('-');
          return `${d}/${m}/${y}`;
      }
  }

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
