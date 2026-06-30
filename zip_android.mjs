import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiverModule = require('archiver');
console.log('--- ARCHIVER DEBUG ---', typeof archiverModule, Object.keys(archiverModule));
// Safeguard construction across environment configurations
const getArchiver = () => {
  if (typeof archiverModule === 'function') return archiverModule;
  if (typeof archiverModule.default === 'function') return archiverModule.default;
  if (typeof archiverModule.Archiver === 'function') {
    return (type, options) => new archiverModule.Archiver(type, options);
  }
  if (typeof archiverModule.create === 'function') {
    return (type, options) => archiverModule.create(type, options);
  }
  return archiverModule;
};
const archiver = getArchiver();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Helper to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function run() {
  console.log('🔄 1. Building React + Vite Web assets...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ React Web assets compiled successfully.');
  } catch (err) {
    console.error('❌ Failed to compile React Web assets:', err.message);
    process.exit(1);
  }

  const androidAssetsDist = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'assets', 'dist');
  const distDir = path.join(process.cwd(), 'dist');

  console.log('🔄 2. Copying web assets to android assets folder...');
  try {
    if (fs.existsSync(androidAssetsDist)) {
      fs.rmSync(androidAssetsDist, { recursive: true, force: true });
    }
    fs.mkdirSync(androidAssetsDist, { recursive: true });

    if (fs.existsSync(distDir)) {
      copyDir(distDir, androidAssetsDist);
      console.log('✅ Synchronized web assets inside Android app directory.');
    } else {
      throw new Error(`dist/ directory not found at ${distDir}`);
    }
  } catch (err) {
    console.error('❌ Failed to copy assets:', err.message);
    process.exit(1);
  }

  // Create public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const zipPath = path.join(publicDir, 'android_project.zip');
  console.log(`🔄 3. Compressing android/ directory into ZIP at: ${zipPath}`);

  try {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', function () {
      console.log(`\n🎉 Success! Android project zipped perfectly (${archive.pointer()} total bytes).`);
      console.log(`📥 Download the customized Android project ZIP from details view inside AI Studio!`);
      
      // Also copy to dist directory if it exists for production setups
      const prodDistZip = path.join(distDir, 'android_project.zip');
      try {
        fs.copyFileSync(zipPath, prodDistZip);
        console.log(`✅ Copy also placed in production path at: ${prodDistZip}`);
      } catch (e) {
        // Safe to failure in dev
        console.log('(Skipped copying to production dist path - build is running)');
      }
    });

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.warn('Zip warning:', err);
      } else {
        throw err;
      }
    });

    archive.on('error', function (err) {
      throw err;
    });

    archive.pipe(output);

    // Append the entire android folder, keeping directory structure
    archive.directory(path.join(process.cwd(), 'android'), 'android');

    // Also include README_ANDROID.md and build_apk.sh in root of ZIP
    if (fs.existsSync(path.join(process.cwd(), 'README_ANDROID.md'))) {
      archive.file(path.join(process.cwd(), 'README_ANDROID.md'), { name: 'README_ANDROID.md' });
    }
    if (fs.existsSync(path.join(process.cwd(), 'build_apk.sh'))) {
      archive.file(path.join(process.cwd(), 'build_apk.sh'), { name: 'build_apk.sh' });
    }

    await archive.finalize();
  } catch (err) {
    console.error('❌ Zip generation failed:', err.message);
    process.exit(1);
  }
}

run();
