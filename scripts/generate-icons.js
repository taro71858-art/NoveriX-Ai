import fs from 'fs';
import zlib from 'zlib';

function createPNG(size, outputPath) {
  // Generate RGBA raw buffer
  const width = size;
  const height = size;
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (rowBytes + 1));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowBytes + 1);
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // Coordinates normalized -1 to +1
      const nx = (x / (width - 1)) * 2 - 1;
      const ny = (y / (height - 1)) * 2 - 1;
      const distFromCenter = Math.sqrt(nx * nx + ny * ny);

      // Squircle background corner radius
      const cornerRadius = 0.85;
      const isInside = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4) <= 1;

      // Gradient from emerald (#10b981) to deep blue (#2563eb)
      const gradT = (nx + ny + 2) / 4;
      let r = Math.round(16 + gradT * (37 - 16));
      let g = Math.round(185 + gradT * (99 - 185));
      let b = Math.round(129 + gradT * (235 - 129));
      let a = isInside ? 255 : 0;

      // Draw growth arrow in the center
      // Center area: nx between -0.5 and 0.5, ny between -0.5 and 0.5
      // Diagonal arrow pointing to top right: from (-0.3, 0.3) to (0.3, -0.3)
      // Line: ny ≈ -nx
      const lineDist = Math.abs(ny + nx);
      const isStem = lineDist < 0.12 && nx > -0.35 && nx < 0.28 && ny > -0.28 && ny < 0.35;
      const isArrowHead1 = Math.abs(ny - (-0.3)) < 0.08 && nx > 0.05 && nx < 0.32;
      const isArrowHead2 = Math.abs(nx - 0.3) < 0.08 && ny > -0.32 && ny < -0.05;

      if (isInside && (isStem || isArrowHead1 || isArrowHead2)) {
        r = 255;
        g = 255;
        b = 255;
        a = 255;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Generated ${outputPath} (${size}x${size})`);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc = crc ^ byte;
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

// Generate icons
fs.mkdirSync('./public', { recursive: true });
createPNG(192, './public/icon-192.png');
createPNG(512, './public/icon-512.png');
createPNG(180, './public/apple-touch-icon.png');
createPNG(192, './icon-192.png');
createPNG(512, './icon-512.png');
