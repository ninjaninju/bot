import { faker } from '@faker-js/faker';
import { getTempEmail, getVerificationCode, getVerificationLink } from './email.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function generateIdentityNum({ dob = '2000-01-14', gender = 'L' } = {}) {
  const kodeWilayah = '1809';
  const date = new Date(dob);

  let day = date.getDate();
  if (gender === 'P') day += 40;

  const dayStr = String(day).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const tanggalLahir = `${dayStr}${month}${year}`;
  const nomorUrut = Math.floor(1000 + Math.random() * 9000);

  return `${kodeWilayah}${tanggalLahir}${nomorUrut}`;
}

function generatePhoneNumber() {
  const prefix = faker.helpers.arrayElement([
    '62811', '62812', '62813', '62821', '62822',
    '62823', '62831', '62852', '62853'
  ]);
  const number = faker.string.numeric(7);
  return `${prefix}${number}`;
}

function generatePassword(length = 12) {
  const upper = faker.string.alpha({ casing: 'upper', length: 1 });
  const lower = faker.string.alpha({ casing: 'lower', length: 1 });
  const digit = faker.string.numeric(1);
  const symbol = faker.helpers.arrayElement(['!', '@', '#', '$', '%', '^', '&', '*']);
  const middle = faker.string.alphanumeric(length - 4);

  return (upper + lower + digit + symbol + middle)
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export async function generatePayload(referral_code = 'OJMVXDHZ') {
  const full_name = faker.person.fullName();

  // Buat email dengan domain @jkotypc.com
  const rawUsername = faker.internet.username({
    firstName: full_name.split(' ')[0],
    lastName: full_name.split(' ')[1] || ''
  });

  const cleanedUsername = rawUsername
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Hilangkan karakter selain huruf/angka

    const emailData = await getTempEmail();

    if (!emailData || !emailData.email) {
        console.log("❌ Gagal membuat email sementara.");
        return;
    }

    const email = emailData.email;
    console.log("📬 Email berhasil dibuat:", email);

  const dob = faker.date.birthdate({ min: 18, max: 40, mode: 'age' });
  const dobFormatted = dob.toISOString().split('T')[0];
  const gender = faker.helpers.arrayElement(['L', 'P']);
  const identity_num = generateIdentityNum({ dob: dobFormatted, gender });
  const phone_num = generatePhoneNumber();
  const password = generatePassword();

  return {
    full_name,
    email,
    phone_num,
    password,
    is_user: true,
    identity_num,
    dob: dobFormatted,
    gender : gender,
    id_parent: null,
    referral_code: referral_code,
    country_code: 'ID',
    device_fingerprint:
      'google/redfin/redfin:11/RQ2A.210305.006/7119741:user/release-keys'
  };
}
