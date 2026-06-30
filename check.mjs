import fs from 'fs';
try {
  const stat = fs.statSync('android/gradlew');
  console.log('gradlew permissions:', (stat.mode & 0o777).toString(8));
} catch(e) {
  console.error(e.message);
}
