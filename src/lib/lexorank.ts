export const LEXO_START = "m"
export const LEXO_END = "z"

export function midpoint(a: string, b: string): string {
  // Pad to same length
  const maxLen = Math.max(a.length, b.length) + 1
  const A = a.padEnd(maxLen, '0')
  const B = b.padEnd(maxLen, '0')

  // Convert to char codes, find midpoint
  const codes = []
  for (let i = 0; i < maxLen; i++) {
    const aCode = A.charCodeAt(i)
    const bCode = B.charCodeAt(i)
    codes.push(Math.floor((aCode + bCode) / 2))
  }

  return codes.map(c => String.fromCharCode(c)).join('').trimEnd()
}

export function generateInitialRanks(count: number): string[] {
  if (count === 0) return []
  const ranks: string[] = []
  const step = Math.floor(('z'.charCodeAt(0) - '0'.charCodeAt(0)) / (count + 1))
  for (let i = 1; i <= count; i++) {
    ranks.push(String.fromCharCode('0'.charCodeAt(0) + step * i))
  }
  return ranks
}
