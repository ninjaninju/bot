import axios from 'axios';

export async function register(payload) {
  const url = 'https://mobile.pelni.co.id/superapp/v1/create_account';

  const headers = {
    'User-Agent': 'PELNI Mobile 2.5.9+97 (Android)',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
    'Host': 'mobile.pelni.co.id',
    'nonce': 'KPENrs5ugEfpINEeLxbyjzHrgYS67CQ6CWUXOI1CW6eJDnj7U+PaIvOUMZnvwZfo'
  };


  try {

    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`❌ Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`❌ Request error: ${error.message}`);
    }
  }
}
