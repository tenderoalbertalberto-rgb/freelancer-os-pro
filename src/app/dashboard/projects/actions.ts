// ========================================================================
// Freelancer OS Pro - Server Actions para Proyectos
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectFormSchema, ProjectFormData } from "@/types/project";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";

export async function createProject(formData: ProjectFormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  // Validar datos
  const validatedData = projectFormSchema.parse(formData);

  // Verificar que el cliente pertenece al usuario
  const client = await prisma.client.findFirst({
    where: {
      id: validatedData.clientId,
      userId: session.user.id,
    },
  });

  if (!client) {
    throw new Error("Cliente no encontrado o no autorizado");
  }

  // Crear proyecto
  const project = await prisma.project.create({
    data: {
      name: validatedData.name,
      description: validatedData.description || null,
      status: validatedData.status,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      budget: validatedData.budget ? parseFloat(validatedData.budget) : null,
      currency: validatedData.currency,
      userId: session.user.id,
      clientId: validatedData.clientId,
    },
  });

  revalidatePath("/dashboard/projects");
  return { success: true, projectId: project.id };
}

export async function updateProject(
  projectId: string,
  formData: ProjectFormData
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  // Validar datos
  const validatedData = projectFormSchema.parse(formData);

  // Verificar que el proyecto pertenece al usuario
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: session.user.id,
    },
  });

  if (!existingProject) {
    throw new Error("Proyecto no encontrado o no autorizado");
  }

  // Verificar que el cliente pertenece al usuario
  const client = await prisma.client.findFirst({
    where: {
      id: validatedData.clientId,
      userId: session.user.id,
    },
  });

  if (!client) {
    throw new Error("Cliente no encontrado o no autorizado");
  }

  // Actualizar proyecto
  await prisma.project.update({
    where: { id: projectId },
    data: {
      name: validatedData.name,
      description: validatedData.description || null,
      status: validatedData.status,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      budget: validatedData.budget ? parseFloat(validatedData.budget) : null,
      currency: validatedData.currency,
      clientId: validatedData.clientId,
    },
  });

  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  // Verificar que el proyecto pertenece al usuario
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: session.user.id,
    },
  });

  if (!existingProject) {
    throw new Error("Proyecto no encontrado o no autorizado");
  }

  // Eliminar proyecto
  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/dashboard/projects");
  return { success: true };
}
