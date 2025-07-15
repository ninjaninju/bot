import { generatePayload } from './generatePayload.js';
import { register } from './register.js';
import { confirmPelniEmail } from './fetchPelniLink.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Path file output
const outputFile = path.resolve('./hasil_pendaftaran.txt');

rl.question('Berapa kali kamu ingin mendaftar? ', async (answer) => {
    const jumlah = parseInt(answer);
    if (isNaN(jumlah) || jumlah <= 0) {
        console.log('Masukkan angka yang valid.');
        rl.close();
        return;
    }

    for (let i = 1; i <= jumlah; i++) {
        console.log(`\n➡️  [${i}/${jumlah}] Memulai proses pendaftaran...\n`);
        const payload = generatePayload();
        console.log(' Mencoba Mendaftar:');
        console.log(`Nama     : ${payload.full_name}`);
        console.log(`Email    : ${payload.email}`);
        console.log(`Phone    : ${payload.phone_num}`);
        console.log(`Password : ${payload.password}`);
        console.log(`Identity : ${payload.identity_num}`);
        console.log(`DOB      : ${payload.dob}`);
        console.log(`Gender   : ${payload.gender}`);

        try {
            const result = await register(payload);
            if (result.status) {
                console.log('✅ Sukses Mendaftar');
                const email = 'glentillman94@daouse.com';
                await delay(10000);
                const success = await confirmPelniEmail(email);

                if (success) {
                    console.log('🎉 Email berhasil dikonfirmasi!');

                    // Simpan data ke file
                    const data = `Nama: ${payload.full_name}\nEmail: ${payload.email}\nPhone: ${payload.phone_num}\nPassword: ${payload.password}\nIdentity: ${payload.identity_num}\nDOB: ${payload.dob}\nGender: ${payload.gender}\n----------\n`;
                    fs.appendFileSync(outputFile, data, 'utf8');
                    console.log('📁 Data disimpan ke hasil_pendaftaran.txt');
                } else {
                    console.log('⚠️ Email belum bisa dikonfirmasi.');
                }
            }
        } catch (err) {
            console.error('❌ Error:', err.message);
        }
    }

    rl.close();
});
