import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { TeamProvider } from "@/contexts/TeamContext"
import { MarketProvider } from "@/contexts/MarketContext"
import { HomePage } from "@/pages/HomePage"
import { AuthPage } from "@/pages/AuthPage"
import { TeamPage } from "@/pages/TeamPage"
import { MarketPage } from "@/pages/MarketPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Toaster } from "@/components/ui/Toaster"

function App() {
  return (
    <Router>
      <AuthProvider>
        <TeamProvider>
          <MarketProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout title="Dashboard" subtitle="Overview & Statistics">
                      <HomePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/market"
                element={
                  <ProtectedRoute>
                    <DashboardLayout title="Transfer Market" subtitle="Buy & Sell Players">
                      <MarketPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <DashboardLayout title="My Team" subtitle="Manage Your Squad">
                      <TeamPage />
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
