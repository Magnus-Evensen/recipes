// Split a recipe body into numbered steps + an optional closing note (paragraphs after the last step)
export function splitBody(body) {
  // Numbered chunks, same rule the page always used
  const chunks = body
    .split(/\n(?=\d+\.)/)
    .map((c) => c.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
  if (!chunks.length) return { steps: [], note: [] };

  // The last step ends at its first blank line; everything after is the note
  const [lastStep, ...note] = chunks[chunks.length - 1]
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { steps: [...chunks.slice(0, -1), lastStep], note };
}
