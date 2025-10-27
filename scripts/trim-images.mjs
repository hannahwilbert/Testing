import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const baseDir = path.resolve('docs/images/home');
const files = [
  'finance.png',
  'architecture.png',
  'legal.png',
  'healthcare.png',
  'manufacturing.png',
  'transportation.png',
  'media.png',
  'tech-errors2.png',
  'why-l3.png'
];

async function trimOne(p){
  const inPath = path.join(baseDir, p);
  try{
    // Ensure file exists
    await fs.access(inPath);
  }catch{
    console.warn(`[skip] ${p} not found`);
    return;
  }
  try{
    const img = sharp(inPath);
    const meta = await img.metadata();
    const trimmed = img.trim();
    // Preserve original format/metadata
    await trimmed.toFile(inPath + '.tmp');
    await fs.rename(inPath + '.tmp', inPath);
    console.log(`[trimmed] ${p} (${meta.width}x${meta.height})`);
  }catch(err){
    console.error(`[error] ${p}:`, err?.message || err);
  }
}

async function run(){
  for(const f of files){
    await trimOne(f);
  }
}

run();

