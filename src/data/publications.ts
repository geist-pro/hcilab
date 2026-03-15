import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Publication {
  key: string;
  title: string;
  titleLink: string;
  authors: string;
  venue: string;
  year: number;
  bibtexLink: string;
  audioLink: string | null;
}

/**
 * Parse a single raw entry string (between *** markers) into a Publication.
 * Format: [_Title_](/papers/pdf/key.pdf). Authors. Venue. Year. [Bibtex](...). [Mp3 summary](...)?
 */
function parseEntry(raw: string): Publication | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Extract title and titleLink: [_Title_](/papers/pdf/key.pdf)
  const titleMatch = trimmed.match(/^\[_(.+?)_\]\(([^)]+)\)/);
  if (!titleMatch) return null;

  const title = titleMatch[1].trim();
  const rawTitleLink = titleMatch[2].trim();

  // Make PDF links absolute pointing to kaikunze.de
  const titleLink = rawTitleLink.startsWith('/')
    ? `https://kaikunze.de${rawTitleLink}`
    : rawTitleLink;

  // Extract key from the PDF path: /papers/pdf/key.pdf -> key
  const keyMatch = rawTitleLink.match(/\/papers\/pdf\/([^/]+)\.pdf$/);
  const key = keyMatch ? keyMatch[1] : title.toLowerCase().replace(/\s+/g, '_').slice(0, 30);

  // Remove the title link from the front; now parse the rest
  const rest = trimmed.slice(titleMatch[0].length).replace(/^\.\s*/, '');

  // Extract BibTeX link
  const bibtexMatch = rest.match(/\[Bibtex\]\(([^)]+)\)/i);
  const rawBibtexLink = bibtexMatch ? bibtexMatch[1] : '';
  const bibtexLink = rawBibtexLink.startsWith('/')
    ? `https://kaikunze.de${rawBibtexLink}`
    : rawBibtexLink;

  // Extract audio link
  const audioMatch = rest.match(/\[Mp3 summary\]\(([^)]+)\)/i);
  const rawAudioLink = audioMatch ? audioMatch[1] : null;
  const audioLink = rawAudioLink
    ? rawAudioLink.startsWith('/') ? `https://kaikunze.de${rawAudioLink}` : rawAudioLink
    : null;

  // Remove all markdown links from rest to get plain text: Authors. Venue. Year.
  const plain = rest
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split by '. ' to extract fields
  const parts = plain.split(/\.\s+/).map(p => p.trim()).filter(Boolean);

  // Year: last numeric 4-digit token
  let year = 0;
  let yearIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    const m = parts[i].match(/^(20\d{2}|19\d{2})$/);
    if (m) { year = parseInt(m[1]); yearIdx = i; break; }
  }
  if (year === 0) {
    // Try inline year like "2025." in venue string
    const inlineYear = plain.match(/\b(20\d{2}|19\d{2})\b/);
    if (inlineYear) year = parseInt(inlineYear[1]);
  }

  const authors = parts[0] ?? '';
  const venue = yearIdx > 1
    ? parts.slice(1, yearIdx).join('. ')
    : parts[1] ?? '';

  return { key, title, titleLink, authors, venue, year, bibtexLink, audioLink };
}

let _cache: Publication[] | null = null;

export function getPublications(): Publication[] {
  if (_cache) return _cache;

  const mdPath = resolve(process.cwd(), '../kaikunze.de/kaikunze.de-papers/publications.md');
  let content: string;
  try {
    content = readFileSync(mdPath, 'utf-8');
  } catch {
    console.warn('[publications] Could not read publications.md at', mdPath);
    return [];
  }

  // Split on *** separators, skip front-matter section
  const raw = content.split('***');
  const pubs: Publication[] = [];
  for (const chunk of raw) {
    const p = parseEntry(chunk);
    if (p) pubs.push(p);
  }

  // Sort descending by year
  pubs.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  _cache = pubs;
  return pubs;
}

/** Return publications from top venues (CHI, IMWUT, UIST, etc.) — most recent N */
export function getFeaturedPublications(n = 6): Publication[] {
  const topVenues = ['chi', 'imwut', 'uist', 'tei', 'iswc', 'ubicomp', 'pervasive'];
  const all = getPublications();
  const featured = all.filter(p =>
    topVenues.some(v => p.venue.toLowerCase().includes(v))
  );
  return featured.slice(0, n);
}
