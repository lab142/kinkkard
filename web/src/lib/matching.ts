import type { GuestProfile, MatchResults, UserProfile } from './types'

export function calculateMatches(user: UserProfile, guest: GuestProfile): MatchResults {
  const userInto = new Set(user.intoKinks)
  const userWouldTry = new Set(user.wouldTryKinks)
  const guestInto = new Set(guest.intoKinks)
  const guestWouldTry = new Set(guest.wouldTryKinks)
  const userPositions = new Set(user.positions)
  const guestPositions = new Set(guest.favoritePositions)

  const matchingKinks = [...userInto].filter((kink) => guestInto.has(kink)).sort()
  const intoToWouldTry = [...userInto].filter((kink) => guestWouldTry.has(kink))
  const wouldTryToInto = [...userWouldTry].filter((kink) => guestInto.has(kink))
  const wouldTryCrossMatches = [...new Set([...intoToWouldTry, ...wouldTryToInto])].sort()
  const bothWouldTryMatches = [...userWouldTry].filter((kink) => guestWouldTry.has(kink)).sort()
  const matchingPositions = [...userPositions].filter((position) => guestPositions.has(position)).sort()

  return {
    matchingPositions,
    matchingKinks,
    wouldTryCrossMatches,
    bothWouldTryMatches,
  }
}
