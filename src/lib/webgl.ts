let cached: boolean | null = null

export function supportsWebGL2(): boolean {
  if (cached !== null) return cached
  try {
    cached = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    cached = false
  }
  return cached
}
