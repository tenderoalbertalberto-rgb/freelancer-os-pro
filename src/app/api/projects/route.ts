// ========================================================================
// Freelancer OS Pro - API Route: GET /api/projects
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener proyectos con información del cliente
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Obtener clientes activos para el dropdown
    const clients = await prisma.client.findMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        company: true,
      },
    });

    return NextResponse.json({ projects, clients });
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
