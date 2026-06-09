import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { TeamProvider } from "@/contexts/TeamContext"
import { MarketProvider } from "@/contexts/MarketContext"
import { HomePage } from "@/pages/HomePage"
import { AuthPage } from "@/pages/AuthPage"
import { TeamPage } from "@/pages/TeamPage"
import { MarketPage } from "@/pages/MarketPage"
import { LeaderboardPage } from "@/pages/LeaderboardPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Toaster } from "@/components/ui/Toaster"
import { ROUTES } from "@/constants"

function App() {
  return (
    <Router>
      <AuthProvider>
        <TeamProvider>
          <MarketProvider>
            <Toaster />
            <Routes>
              <Route path={ROUTES.AUTH} element={<AuthPage />} />
              <Route
                path={ROUTES.HOME}
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <HomePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MARKET}
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <MarketPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.TEAM}
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <TeamPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.LEADERBOARD}
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <LeaderboardPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MarketProvider>
        </TeamProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
