const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

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

  const androidAssetsDist = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'dist');
  const distDir = path.join(__dirname, 'dist');

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

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const zipPath = path.join(publicDir, 'android_project.zip');
  console.log(`🔄 3. Compressing android/ directory into ZIP with adm-zip at: ${zipPath}`);

  try {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    const zip = new AdmZip();
    
    // Add local android directory as a folder in the zip
    zip.addLocalFolder(path.join(__dirname, 'android'), 'android');
    
    // Add additional files if they exist
    if (fs.existsSync(path.join(__dirname, 'README_ANDROID.md'))) {
      zip.addLocalFile(path.join(__dirname, 'README_ANDROID.md'));
    }
    if (fs.existsSync(path.join(__dirname, 'build_apk.sh'))) {
      zip.addLocalFile(path.join(__dirname, 'build_apk.sh'));
    }

    zip.writeZip(zipPath);
    console.log(`\n🎉 Success! Android project zipped perfectly with adm-zip.`);
    console.log(`📥 Download the customized Android project ZIP from details view inside AI Studio!`);

    // Also copy to dist directory if it exists for production setups
    const prodDistZip = path.join(distDir, 'android_project.zip');
    try {
      fs.copyFileSync(zipPath, prodDistZip);
      console.log(`✅ Copy also placed in production path at: ${prodDistZip}`);
    } catch (e) {
      // Safe to ignore if build not run yet
    }
  } catch (err) {
    console.error('❌ Zip generation failed:', err.message);
    process.exit(1);
  }
}

run();
