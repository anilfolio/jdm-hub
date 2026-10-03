const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image scanlines
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', idatData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Draw red rounded-rect badge with white JD monogram
function getBadgePixel(x, y, size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.22;
  const halfInner = size / 2 - radius;

  // Signed distance to rounded rectangle
  const dx = Math.max(0, Math.abs(x + 0.5 - cx) - halfInner);
  const dy = Math.max(0, Math.abs(y + 0.5 - cy) - halfInner);
  const dist = Math.sqrt(dx * dx + dy * dy) - radius;

  // Antialiasing for outer boundary
  if (dist > 0.5) return [0, 0, 0, 0]; // transparent
  const outerAlpha = Math.max(0, Math.min(1, 0.5 - dist));

  // Border (thickness ~1-2px depending on size)
  const borderWidth = Math.max(1, size * 0.05);
  const isBorder = dist > -borderWidth;

  // Normalized coordinates within the badge for letter rasterization (-1 to 1)
  // Slant for dynamic italic speed look
  const nx = ((x + 0.5) / size) * 2 - 1;
  const ny = ((y + 0.5) / size) * 2 - 1;
  const slantedX = nx + (ny * 0.15); // italic slant

  // Check if inside "J" or "D"
  // "J": centered around x = -0.32, y from -0.45 to +0.45
  let inLetter = false;

  // J letter definition:
  // Stem: x in [-0.22, -0.06], y in [-0.45, 0.25]
  if (slantedX >= -0.24 && slantedX <= -0.08 && ny >= -0.45 && ny <= 0.28) {
    inLetter = true;
  }
  // J bottom curve:
  const jCurveDx = slantedX - -0.24;
  const jCurveDy = ny - 0.22;
  const jCurveDist = Math.sqrt(jCurveDx * jCurveDx + jCurveDy * jCurveDy);
  if (jCurveDist <= 0.24 && jCurveDist >= 0.08 && ny >= 0.15 && slantedX <= -0.08) {
    inLetter = true;
  }
  // J bottom hook tip:
  if (slantedX >= -0.44 && slantedX <= -0.28 && ny >= 0.05 && ny <= 0.28) {
    inLetter = true;
  }

  // D letter definition:
  // D vertical stem: x in [0.06, 0.20], y in [-0.45, 0.45]
  if (slantedX >= 0.06 && slantedX <= 0.20 && ny >= -0.45 && ny <= 0.45) {
    inLetter = true;
  }
  // D outer curve / bowl
  const dCenterY = 0.0;
  const dCenterX = 0.15;
  const dNormY = ny / 0.45;
  if (Math.abs(dNormY) <= 1.0) {
    const dMaxX = dCenterX + Math.sqrt(Math.max(0, 1 - dNormY * dNormY)) * 0.38;
    const dMinX = dCenterX + Math.sqrt(Math.max(0, 1 - dNormY * dNormY)) * 0.20;
    if (slantedX >= 0.18 && slantedX <= dMaxX) {
      inLetter = true;
    }
  }
  // D top and bottom horizontal bars
  if (slantedX >= 0.12 && slantedX <= 0.35 && ((ny >= -0.45 && ny <= -0.31) || (ny >= 0.31 && ny <= 0.45))) {
    inLetter = true;
  }

  if (inLetter) {
    return [255, 255, 255, Math.round(outerAlpha * 255)];
  }

  // Border: crisp white or subtle highlight
  if (isBorder) {
    return [255, 255, 255, Math.round(outerAlpha * 240)];
  }

  // Red gradient body (#e20c0c to #b8080c)
  const gradT = (y / size);
  const r = Math.round(226 * (1 - gradT) + 184 * gradT);
  const g = Math.round(12 * (1 - gradT) + 8 * gradT);
  const b = Math.round(12 * (1 - gradT) + 12 * gradT);

  return [r, g, b, Math.round(outerAlpha * 255)];
}

// Build multi-resolution ICO file
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const entries = [];
  const datas = [];

  for (const png of pngBuffers) {
    // Read width and height from PNG IHDR
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);

    const entry = Buffer.alloc(16);
    entry[0] = width >= 256 ? 0 : width;
    entry[1] = height >= 256 ? 0 : height;
    entry[2] = 0; // color palette
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bit depth
    entry.writeUInt32LE(png.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    entries.push(entry);
    datas.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

// Generate PNGs
const png16 = createPng(16, 16, (x, y, s) => getBadgePixel(x, y, s));
const png32 = createPng(32, 32, (x, y, s) => getBadgePixel(x, y, s));
const png48 = createPng(48, 48, (x, y, s) => getBadgePixel(x, y, s));
const png180 = createPng(180, 180, (x, y, s) => getBadgePixel(x, y, s));
const png192 = createPng(192, 192, (x, y, s) => getBadgePixel(x, y, s));

const icoBuffer = createIco([png16, png32, png48]);

// Write ICO files
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(__dirname, '../app/favicon.ico'), icoBuffer);

// Write Apple Touch & Web App Icons
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), png192);

// Generate Vector SVG Favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="jd_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E51313" />
      <stop offset="100%" stop-color="#B8080C" />
    </linearGradient>
    <filter id="badge_shadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Outer Rounded Square Badge with White Stroke -->
  <rect x="3" y="3" width="58" height="58" rx="15" ry="15" fill="url(#jd_bg)" stroke="#FFFFFF" stroke-width="3.5" filter="url(#badge_shadow)" />

  <!-- Speed Blade Accent Accent Under JD -->
  <g transform="skewX(-10)">
    <!-- Monogram Text: JD -->
    <text x="36" y="44" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif" 
      font-size="34" 
      font-weight="900" 
      font-style="italic" 
      fill="#FFFFFF" 
      text-anchor="middle" 
      letter-spacing="-1.5">JD</text>
  </g>

  <!-- Aerodynamic Accent Line -->
  <rect x="18" y="50" width="28" height="2" rx="1" fill="#FFFFFF" opacity="0.8" />
  <rect x="48" y="50" width="3" height="2" rx="1" fill="#FFFFFF" opacity="0.4" />
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);
fs.writeFileSync(path.join(__dirname, '../app/icon.svg'), svgContent);

console.log('Favicon assets successfully generated!');
