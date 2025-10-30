import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Files to trim (transparent/solid padding) for Expertise > Team Expertise cards
const targets = [
  'src/images/home/helpdesk.png',
  'src/images/home/clients/helpdesk.png', // in case template uses clients path
  'src/images/home/clients/consulting.png',
  'src/images/home/clients/infrastructure.png',
  'src/images/home/clients/reportingdashboards.png',
  'src/images/home/architecture.png',
];

async function trimFile(file){
  try {
    await fs.access(file);
  } catch {
    return { file, skipped: true, reason: 'missing' };
  }
  try {
    const img = sharp(file, { limitInputPixels: false });
    const meta = await img.metadata();
    // Trim transparent or uniform edges; small threshold to catch subtle halos
    const trimmed = img.trim({ threshold: 10 });
    const tmp = file + '.tmp';
    await trimmed.toFile(tmp);
    await fs.rename(tmp, file);
    return { file, width: meta.width, height: meta.height, ok: true };
  } catch (err) {
    return { file, error: err?.message || String(err) };
  }
}

async function mirrorToDocs(srcFile){
  if (!srcFile.startsWith('src/')) return;
  const docsPath = path.join('docs', srcFile.slice(4));
  try{
    await fs.mkdir(path.dirname(docsPath), { recursive: true });
    await fs.copyFile(srcFile, docsPath);
    return { docsPath, ok: true };
  }catch(err){
    return { docsPath, error: err?.message || String(err) };
  }
}

async function run(){
  for(const f of targets){
    const res = await trimFile(f);
    if(res?.ok){
      await mirrorToDocs(f);
      console.log(`[trimmed] ${f}`);
    } else if(res?.skipped){
      console.log(`[skip] ${f} (${res.reason})`);
    } else {
      console.warn(`[error] ${f}: ${res?.error || 'unknown'}`);
    }
  }
}

run();
