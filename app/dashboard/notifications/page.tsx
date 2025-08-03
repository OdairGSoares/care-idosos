'use client'

import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import NotificationsPage from "@/pages/NotificationsPage"

export default function Notifications() {
  return (
    <ProtectedRoute>
      <Layout>
        <NotificationsPage />
      </Layout>
    </ProtectedRoute>
  )
} 