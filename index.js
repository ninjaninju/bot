import { generatePayload } from './generatePayload.js';
import { register } from './register.js';
import { getTempEmail, getVerificationCode, getVerificationLink } from './email.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Path file output
const outputFile = path.resolve('./hasil_pendaftaran.txt');

rl.question('Masukkan referral code: ', (referral_code) => {
    rl.question('Berapa kali kamu ingin mendaftar? ', async (answer) => {
        const jumlah = parseInt(answer);
        if (isNaN(jumlah) || jumlah <= 0) {
            console.log('Masukkan angka yang valid.');
            rl.close();
            return;
        }

        for (let i = 1; i <= jumlah; i++) {
            console.log(`\n➡️  [${i}/${jumlah}] Memulai proses pendaftaran...\n`);
            const payload = await generatePayload(referral_code);
         console.log(payload)

            try {
                const result = await register(payload);
                if (result.status) {
                    console.log('✅ Sukses Mendaftar');
                    console.log("⏳ Menunggu kode verifikasi masuk ke inbox...");
                    let code = null;
                    let attempts = 0;
                    const maxAttempts = 10;

                    while (!code && attempts < maxAttempts) {
                        await delay(5000);
                        attempts++;
                        console.log(`🔍 Mengecek inbox (percobaan ke-${attempts})...`);
                        code = await getVerificationLink(payload.email);
                    }

                    if (code) {
                        console.log(`✅ Link verifikasi ditemukan: ${code}`);
                        try {
                            const response = await axios.get(code);
                            console.log('✅ Konfirmasi berhasil dengan status:', response.status);
                        } catch (err) {
                            console.log('❌ Gagal konfirmasi link:', err.message);
                        }
                        const data = `Nama: ${payload.full_name}\nEmail: ${payload.email}\nPhone: ${payload.phone_num}\nPassword: ${payload.password}\nIdentity: ${payload.identity_num}\nDOB: ${payload.dob}\nGender: ${payload.gender}\n----------\n`;
                        fs.appendFileSync(outputFile, data, 'utf8');
                        console.log('📁 Data disimpan ke hasil_pendaftaran.txt');
                    } else {
                        console.log("⚠️ Gagal mendapatkan kode verifikasi setelah beberapa kali percobaan.");
                    }
                }



            } catch (err) {
                console.error('❌ Error:', err.message);
            }
        }

        rl.close();
    });
});
