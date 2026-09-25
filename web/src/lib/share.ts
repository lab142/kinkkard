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
    orientation: profile.orientation,
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
    const orientation = typeof decoded.orientation === 'string' ? decoded.orientation : null
    return {
      v: 1,
      name,
      orientation,
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

export function shareUrlFor(profile: UserProfile): string {
  const encoded = encodePayload(toSharePayload(profile))
  return `${window.location.origin}/m#${encoded}`
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}
