import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  emptyGuest,
  emptyProfile,
  isProfileComplete,
  type GuestProfile,
  type UserProfile,
} from './types'

const PROFILE_KEY = 'winkkard.profile'
const GUEST_KEY = 'winkkard.guest'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

function readProfile(): UserProfile {
  const fallback = emptyProfile()
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw) as Partial<UserProfile> & { orientation?: string | string[] | null }
    const stored = data.orientations ?? data.orientation
    const orientations = Array.isArray(stored)
      ? stored.filter((item): item is string => typeof item === 'string')
      : typeof stored === 'string' && stored
        ? [stored]
        : []
    return {
      ...fallback,
      ...data,
      orientations,
      positions: Array.isArray(data.positions) ? data.positions : [],
      intoKinks: Array.isArray(data.intoKinks) ? data.intoKinks : [],
      wouldTryKinks: Array.isArray(data.wouldTryKinks) ? data.wouldTryKinks : [],
    }
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

type ProfileContextValue = {
  profile: UserProfile
  guest: GuestProfile
  isComplete: boolean
  setProfile: (next: UserProfile) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  setGuest: (next: GuestProfile) => void
  resetOnboarding: () => void
  clearGuest: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => readProfile())
  const [guest, setGuestState] = useState<GuestProfile>(() => readJson(GUEST_KEY, emptyGuest()))

  const setProfile = useCallback((next: UserProfile) => {
    setProfileState(next)
    writeJson(PROFILE_KEY, next)
  }, [])

  const setGuest = useCallback((next: GuestProfile) => {
    setGuestState(next)
    writeJson(GUEST_KEY, next)
  }, [])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfileState((current) => {
      const next = { ...current, ...patch }
      writeJson(PROFILE_KEY, next)
      return next
    })
  }, [])

  const resetOnboarding = useCallback(() => {
    const fresh = emptyProfile()
    setProfileState(fresh)
    writeJson(PROFILE_KEY, fresh)
    setGuestState(emptyGuest())
    localStorage.removeItem(GUEST_KEY)
  }, [])

  const clearGuest = useCallback(() => {
    setGuestState(emptyGuest())
    localStorage.removeItem(GUEST_KEY)
  }, [])

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      guest,
      isComplete: isProfileComplete(profile),
      setProfile,
      updateProfile,
      setGuest,
      resetOnboarding,
      clearGuest,
    }),
    [profile, guest, setProfile, updateProfile, setGuest, resetOnboarding, clearGuest],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within ProfileProvider')
  return context
}
