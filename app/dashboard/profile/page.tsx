'use client'

import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import ProfilePage from "@/pages/ProfilePage"

export default function Profile() {
  return (
    <ProtectedRoute>
      <Layout>
        <ProfilePage />
      </Layout>
    </ProtectedRoute>
  )
} 