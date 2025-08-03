'use client'

import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import EmergencyContactsPage from "@/pages/EmergencyContactsPage"

export default function EmergencyContacts() {
  return (
    <ProtectedRoute>
      <Layout>
        <EmergencyContactsPage />
      </Layout>
    </ProtectedRoute>
  )
} 