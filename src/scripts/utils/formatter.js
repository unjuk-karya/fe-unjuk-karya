export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes} menit`; // menit
  } else if (hours < 24) {
    return `${hours} jam`; // jam
  } else if (days < 7) {
    return `${days} hari`; // hari
  } else {
    return date.toLocaleDateString('id-ID'); // tanggal
  }
}