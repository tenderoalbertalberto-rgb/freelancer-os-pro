// ========================================================================
// Freelancer OS Pro - Página Principal del Dashboard
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Users,
  FolderKanban,
  FileText,
  DollarSign,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Obtener métricas
  const [clientsCount, projectsCount, invoicesCount, totalRevenue] =
    await Promise.all([
      prisma.client.count({
        where: { userId: session?.user?.id },
      }),
      prisma.project.count({
        where: { userId: session?.user?.id },
      }),
      prisma.invoice.count({
        where: { userId: session?.user?.id },
      }),
      prisma.invoice.aggregate({
        where: {
          userId: session?.user?.id,
          status: "PAID",
        },
        _sum: {
          total: true,
        },
      }),
    ]);

  const stats = [
    {
      name: "Clientes Activos",
      value: clientsCount,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Proyectos",
      value: projectsCount,
      icon: FolderKanban,
      color: "bg-green-500",
    },
    {
      name: "Facturas",
      value: invoicesCount,
      icon: FileText,
      color: "bg-yellow-500",
    },
    {
      name: "Ingresos Totales",
      value: `$${(totalRevenue._sum.total || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido adicional */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <p className="text-gray-500">
          Aquí se mostrarán las últimas actividades del sistema.
        </p>
      </div>
    </div>
  );
}
