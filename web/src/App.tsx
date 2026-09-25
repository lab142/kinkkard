import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { ProfileProvider, useProfile } from './lib/profile-context'
import { GamePage } from './pages/GamePage'
import { ImportPage } from './pages/ImportPage'
import { MatchPage } from './pages/MatchPage'
import { MultiplayerPage } from './pages/MultiplayerPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ProfilePage } from './pages/ProfilePage'
import { ScanPage } from './pages/ScanPage'
import { SharePage } from './pages/SharePage'

function AppRoutes() {
  const { isComplete } = useProfile()

  return (
    <Routes>
      <Route path="/m" element={<ImportPage />} />
      {isComplete ? (
        <>
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/share" element={<SharePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="/play" element={<GamePage />} />
          <Route path="/multiplayer" element={<MultiplayerPage />} />
        </>
      ) : (
        <Route path="*" element={<OnboardingPage />} />
      )}
    </Routes>
  )
}

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ProfileProvider>
  )
}
