export type OnboardingStep = 'splash' | 'gender' | 'orientation' | 'name' | 'positions' | 'kinks' | 'complete'

export type UserProfile = {
  id: string
  name: string
  gender: string | null
  orientations: string[]
  positions: string[]
  intoKinks: string[]
  wouldTryKinks: string[]
  hasCompletedOrientation: boolean
  hasCompletedPositions: boolean
  hasCompletedKinks: boolean
}

export type GuestProfile = {
  name: string
  favoritePositions: string[]
  intoKinks: string[]
  wouldTryKinks: string[]
}

export type SharePayloadV1 = {
  v: 1
  name: string
  orientations?: string[]
  favoritePositions: string[]
  intoKinks: string[]
  wouldTryKinks: string[]
}

export type MatchResults = {
  matchingPositions: string[]
  matchingKinks: string[]
  wouldTryCrossMatches: string[]
  bothWouldTryMatches: string[]
}

export function emptyProfile(): UserProfile {
  return {
    id: crypto.randomUUID(),
    name: '',
    gender: null,
    orientations: [],
    positions: [],
    intoKinks: [],
    wouldTryKinks: [],
    hasCompletedOrientation: false,
    hasCompletedPositions: false,
    hasCompletedKinks: false,
  }
}

export function isProfileComplete(profile: UserProfile): boolean {
  return (
    profile.hasCompletedOrientation &&
    profile.hasCompletedPositions &&
    profile.hasCompletedKinks
  )
}

export function emptyGuest(): GuestProfile {
  return {
    name: '',
    favoritePositions: [],
    intoKinks: [],
    wouldTryKinks: [],
  }
}

export function hasGuestData(guest: GuestProfile): boolean {
  return guest.name.length > 0 || guest.favoritePositions.length > 0 || guest.intoKinks.length > 0 || guest.wouldTryKinks.length > 0
}
