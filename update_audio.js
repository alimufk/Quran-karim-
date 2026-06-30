const fs = require('fs');

const filesToUpdate = [
  'src/pages/ShiaDuas.tsx',
  'src/pages/Radios.tsx',
  'src/pages/ZiyaratDetail.tsx',
  'src/pages/Listen.tsx',
  'src/utils/audioCache.ts',
  'src/hooks/usePrayerTimes.tsx'
];

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('getAudioUrl')) {
    // Add import statement at the top after other imports
    content = content.replace(/(import .*;\n)+/, (match) => match + "import { getAudioUrl } from '../utils/audioUrl';\n");
  }

  // Replace occurrences
  let previous;
  do {
    previous = content;
    content = content.replace(/\`\$\{window\.location\.origin\}\/api\/proxy\?url=\$\{encodeURIComponent\((.+?)\)\}\`/, 'getAudioUrl($1)');
  } while (content !== previous);
  
  fs.writeFileSync(file, content);
}
console.log('Done');
