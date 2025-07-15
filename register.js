import axios from 'axios';

export async function register(payload) {
  const url = 'https://mobile.pelni.co.id/superapp/v1/create_account';

  const headers = {
    'User-Agent': 'PELNI Mobile 2.5.9+97 (Android)',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
    'Host': 'mobile.pelni.co.id',
    'nonce': 'dfuK2G0pMLIr8fpdIoI1/MaMnQCnkalY6OojZzwmcgwluMaD7Qq1ZHyEocT3k6iR'
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
