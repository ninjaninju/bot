import axios from 'axios';

/**
 * Ambil semua pesan dari temp-mail.io berdasarkan email
 */
const fetchTempMailMessages = async (username, domain) => {
  try {
    const res = await axios.get(`https://api.internal.temp-mail.io/api/v3/email/${username}@${domain}/messages`);
    return res.data;
  } catch (err) {
    console.error('❌ Gagal fetch email:', err.message);
    return [];
  }
};

/**
 * Ambil dan konfirmasi link terakhir dari email PELNI
 * @param {string} email - contoh: glentillman94@daouse.com
 * @returns {Promise<boolean>} - true jika berhasil konfirmasi
 */
export const confirmPelniEmail = async (email) => {
  const [username, domain] = email.split('@');
  const messages = await fetchTempMailMessages(username, domain);

  if (!messages.length) {
    console.log('📭 Belum ada email masuk.');
    return false;
  }

  // Urutkan email dari yang terbaru
  const sorted = messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  for (const msg of sorted) {
    if (/pelni/i.test(msg.subject)) {
      const match = msg.body_text.match(/https:\/\/customers\.pelni\.co\.id\/account\/confirm\/[a-zA-Z0-9]+/);
      if (match) {
        const link = match[0];
        console.log(`✅ Link konfirmasi terbaru:\n${link}`);

        // Kirim GET request untuk konfirmasi
        try {
          const response = await axios.get(link);
          console.log('✅ Konfirmasi berhasil dengan status:', response.status);
          return true;
        } catch (err) {
          console.error('❌ Gagal konfirmasi link:', err.message);
          return false;
        }
      }
    }
  }

  console.log('❌ Tidak ditemukan link konfirmasi dari PELNI.');
  return false;
};
