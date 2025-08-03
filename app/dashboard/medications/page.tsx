'use client'

import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import MedicationsPage from "@/pages/MedicationsPage"

export default function Medications() {
  return (
    <ProtectedRoute>
      <Layout>
        <MedicationsPage />
      </Layout>
    </ProtectedRoute>
  )
} 