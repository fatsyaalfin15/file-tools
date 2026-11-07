// Ubah nama file dari pengguna menjadi aman dipakai di header unduhan
module.exports = function safeBaseName(name = '', fallback = 'file') {
  const base = name
    .replace(/\.[^.]*$/, '') // buang ekstensi
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  return base || fallback;
};