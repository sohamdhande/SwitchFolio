const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export const LEXO_START = "0";
export const LEXO_END = "z";

export function midpoint(a: string, b: string): string {
  if (a >= b) {
    throw new Error(`Invalid inputs: a (${a}) must be strictly less than b (${b})`);
  }

  let result = "";
  let i = 0;
  
  while (true) {
    const charA = a[i];
    const charB = b[i];
    
    const indexA = charA !== undefined ? ALPHABET.indexOf(charA) : -1;
    const indexB = charB !== undefined ? ALPHABET.indexOf(charB) : ALPHABET.length;
    
    if (indexB - indexA > 1) {
      const midIndex = Math.floor((indexA + indexB) / 2);
      result += ALPHABET[midIndex];
      return result;
    } else if (indexB - indexA === 1) {
      result += ALPHABET[Math.max(0, indexA)];
    } else {
      result += ALPHABET[indexA];
    }
    i++;
    if (i > 30) throw new Error("LexoRank exhaustion: could not find midpoint.");
  }
}

export function generateInitialRanks(count: number): string[] {
  if (count === 0) return [];
  const ranks: string[] = [];
  const step = Math.floor(ALPHABET.length / (count + 1));
  for (let i = 1; i <= count; i++) {
    ranks.push(ALPHABET[step * i]);
  }
  return ranks;
}

/**
 * Checks if a computed midpoint rank is valid (strictly between a and b).
 * Returns false when rank exhaustion has occurred and a rebalance is needed.
 */
export function needsRebalance(newRank: string, rankA: string, rankB: string): boolean {
  return newRank <= rankA || newRank >= rankB;
}

/**
 * Assigns evenly distributed ranks across all items in order.
 * Use this when rank exhaustion is detected (two adjacent ranks
 * with no valid string between them).
 */
export function rebalanceRanks<T extends { id: string }>(
  items: T[]
): Array<T & { lexoRank: string }> {
  if (items.length === 0) return [];

  const step = Math.floor(ALPHABET.length / (items.length + 1));
  const safeStep = Math.max(step, 1);

  return items.map((item, index) => {
    // Build a rank string from evenly spaced positions
    const position = safeStep * (index + 1);
    let rank: string;

    if (position < ALPHABET.length) {
      rank = ALPHABET[position];
    } else {
      // If we exceed the single-char space, use two-char ranks
      const first = Math.floor(index / ALPHABET.length);
      const second = index % ALPHABET.length;
      rank = ALPHABET[Math.min(first, ALPHABET.length - 1)] + ALPHABET[second];
    }

    return { ...item, lexoRank: rank };
  });
}

