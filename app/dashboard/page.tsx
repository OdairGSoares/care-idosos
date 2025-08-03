'use client'

import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import HomePage from "@/pages/HomePage"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Layout>
        <HomePage />
      </Layout>
    </ProtectedRoute>
  )
} 