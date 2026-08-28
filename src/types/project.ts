// ========================================================================
// Freelancer OS Pro - Tipos y Validaciones para Proyectos
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

export const projectFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
  currency: z.string().default("USD"),
  clientId: z.string().min(1, "Debes seleccionar un cliente"),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
