import type { GuestProfile, SharePayloadV1, UserProfile } from './types'

/** Same JSON the iOS app puts in a QR code. */
export function toQrJson(profile: UserProfile): string {
  return JSON.stringify({
    name: profile.name.trim() || 'Unknown',
    favoritePositions: profile.positions,
    intoKinks: profile.intoKinks,
    wouldTryKinks: profile.wouldTryKinks,
  })
}

export function toSharePayload(profile: UserProfile): SharePayloadV1 {
  return {
    v: 1,
    name: profile.name.trim() || 'Unknown',
    orientations: profile.orientations,
    favoritePositions: profile.positions,
    intoKinks: profile.intoKinks,
    wouldTryKinks: profile.wouldTryKinks,
  }
}

export function encodePayload(payload: SharePayloadV1): string {
  const json = JSON.stringify(payload)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodePayload(encoded: string): SharePayloadV1 | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
    const binary = atob(padded + pad)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    return parseShareJson(json)
  } catch {
    return null
  }
}

export function parseShareJson(raw: string): SharePayloadV1 | null {
  try {
    const decoded = JSON.parse(raw) as Record<string, unknown>
    const name = typeof decoded.name === 'string' ? decoded.name : 'Guest'
    const favoritePositions = asStringArray(decoded.favoritePositions)
    const intoKinks = asStringArray(decoded.intoKinks)
    const wouldTryKinks = asStringArray(decoded.wouldTryKinks)
    const orientations = asStringArray(decoded.orientations ?? decoded.orientation)
    return {
      v: 1,
      name,
      orientations,
      favoritePositions,
      intoKinks,
      wouldTryKinks,
    }
  } catch {
    return null
  }
}

export function payloadToGuest(payload: SharePayloadV1): GuestProfile {
  return {
    name: payload.name,
    favoritePositions: payload.favoritePositions,
    intoKinks: payload.intoKinks,
    wouldTryKinks: payload.wouldTryKinks,
  }
}

export function parseScannedText(text: string): SharePayloadV1 | null {
  const trimmed = text.trim()
  try {
    const url = new URL(trimmed)
    const hash = url.hash.replace(/^#/, '')
    if (hash) {
      const fromHash = decodePayload(hash)
      if (fromHash) return fromHash
    }
  } catch {
    // Not a URL — try JSON or raw payload next.
  }

  if (trimmed.startsWith('{')) return parseShareJson(trimmed)
  return decodePayload(trimmed)
}

export function kinkCardText(profile: UserProfile): string {
  const name = profile.name.trim() || 'Unknown User'
  const positions = profile.positions.length ? profile.positions.join(', ') : 'No positions selected'
  const into = profile.intoKinks.length ? profile.intoKinks.join(', ') : 'No kinks selected'
  const wouldTry = profile.wouldTryKinks.length ? profile.wouldTryKinks.join(', ') : 'No kinks selected'
  return [
    `🔥 Kink Card for ${name} 🔥`,
    '',
    '🛏️ Favorite Positions:',
    positions,
    '',
    '🔥 Into:',
    into,
    '',
    '💡 Would Try:',
    wouldTry,
    '',
    '✨ Generated with Kink List App ✨',
  ].join('\n')
}

export function cardImageBlob(profile: UserProfile): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 1600
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Could not draw the card'))

  const gradient = ctx.createLinearGradient(0, 0, 1200, 1600)
  gradient.addColorStop(0, '#7c3aed')
  gradient.addColorStop(1, '#000000')
  roundRect(ctx, 0, 0, 1200, 1600, 40)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 64px sans-serif'
  ctx.fillText(profile.name.trim() || 'Your Name', 60, 120)

  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(60, 170)
  ctx.lineTo(1140, 170)
  ctx.stroke()

  let y = 250
  y = drawSection(ctx, y, 'Favorite Positions', profile.positions, 'No positions selected')
  y = drawSection(ctx, y, 'Into', profile.intoKinks, 'No kinks selected')
  drawSection(ctx, y, 'Would Try', profile.wouldTryKinks, 'No kinks selected')

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not draw the card'))
    }, 'image/png')
  })
}

function drawSection(ctx: CanvasRenderingContext2D, y: number, title: string, items: string[], empty: string): number {
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 40px sans-serif'
  ctx.fillText(title, 60, y)
  y += 56
  ctx.font = '400 32px sans-serif'
  ctx.fillStyle = items.length ? '#ffffff' : '#c9b4bb'
  const lines = wrapText(ctx, items.length ? items.join(', ') : empty, 1080)
  for (const line of lines.slice(0, 6)) {
    ctx.fillText(line, 60, y)
    y += 46
  }
  return y + 36
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

export function shareUrlFor(profile: UserProfile): string {
  const encoded = encodePayload(toSharePayload(profile))
  return `${window.location.origin}/m#${encoded}`
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}
