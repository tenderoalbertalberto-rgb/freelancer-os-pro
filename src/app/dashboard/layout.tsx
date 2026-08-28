// ========================================================================
// Freelancer OS Pro - Layout del Dashboard
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Bienvenido, {session.user.name}
            </h2>
          </div>
        </header>

        {/* Contenido de la página */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
