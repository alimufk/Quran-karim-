import fs from 'fs';
import https from 'https';
import path from 'path';

const files = [
  'Dua_e_Kumail.mp3',
  'Dua_e_Nudbah.mp3',
  'Dua_e_Tawassul.mp3',
  'Dua_e_Ahad.mp3',
  'Dua_e_Sabah.mp3',
  'Dua_e_Faraj.mp3',
  'Dua_e_Iftitah.mp3',
  'Dua_e_Jawshan Kabeer.mp3',
  'Dua_e_Mashlool.mp3',
  'Dua_e_Mujeer.mp3'
];

const download = (filename) => {
  return new Promise((resolve, reject) => {
    const dest = path.join('public', filename.replace(/ /g, '_'));
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${dest}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    const url = `https://archive.org/download/duas_arabic_audio_mp3/${encodeURIComponent(filename)}`;
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

(async () => {
  for (const f of files) {
    console.log('Downloading', f);
    await download(f);
  }
  console.log('All done!');
})();
