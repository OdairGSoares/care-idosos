'use client'

import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import AppointmentsPage from "@/pages/AppointmentsPage"

export default function Appointments() {
  return (
    <ProtectedRoute>
      <Layout>
        <AppointmentsPage />
      </Layout>
    </ProtectedRoute>
  )
} 