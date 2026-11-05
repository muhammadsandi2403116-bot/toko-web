"use client";

import { useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";


export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("6");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

    </div>
  );
}