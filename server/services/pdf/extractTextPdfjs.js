import fs from 'fs';
import logger from '../../utils/logger.js';

// Use pdf-parse for reliable text extraction (handles most text-based PDFs)
// Dynamically import to avoid ESM/CJS issues
async function getPdfParse() {
  const mod = await import('pdf-parse/lib/pdf-parse.js');
  return mod.default || mod;
}

export async function extractPdfText(filePath) {
  logger.debug(`[extractPdfText] Starting extraction for: ${filePath}`);
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfParse = await getPdfParse();
    const data = await pdfParse(dataBuffer);
    const text = (data.text || '').trim();
    logger.debug(`[extractPdfText] Extracted ${text.length} chars from PDF.`);
    return text;
  } catch (err) {
    logger.error(`[extractPdfText] pdf-parse failed:`, err.message);
    throw new Error('Failed to parse PDF. Please ensure the file is a text-based PDF.');
  }
}
