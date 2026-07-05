const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

export function parseGameFrontmatter(markdown) {
  const match = FRONTMATTER_RE.exec(markdown);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^"(.*)"$/, '$1');
    fields[key] = value;
  }
  return fields;
}

export async function fetchGameContent(id, baseUrl = '/') {
  try {
    const url = `${baseUrl}content/${id}.md`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const text = await response.text();
    return parseGameFrontmatter(text);
  } catch {
    return null;
  }
}
