// ========================================================================
// Freelancer OS Pro - Formulario de Proyecto
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/app/dashboard/projects/actions";
import { ProjectFormData } from "@/types/project";
import { ProjectStatus } from "@prisma/client";
import { Save, X } from "lucide-react";

interface ClientOption {
  id: string;
  name: string;
  company?: string;
}

interface ProjectFormProps {
  project?: {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    budget?: number;
    currency: string;
    clientId: string;
  };
  clients: ClientOption[];
  onClose: () => void;
}

export default function ProjectForm({ project, clients, onClose }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data: ProjectFormData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string || undefined,
        status: formData.get("status") as ProjectStatus,
        startDate: formData.get("startDate") as string || undefined,
        endDate: formData.get("endDate") as string || undefined,
        budget: formData.get("budget") as string || undefined,
        currency: formData.get("currency") as string || "USD",
        clientId: formData.get("clientId") as string,
      };

      if (project) {
        await updateProject(project.id, data);
      } else {
        await createProject(data);
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {project ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={project?.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Rediseño Web E-commerce"
              />
            </div>

            {/* Cliente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                name="clientId"
                required
                defaultValue={project?.clientId}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.company ? `(${client.company})` : ""}
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  ⚠️ No tienes clientes activos. Crea un cliente primero.
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={project?.description}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe el alcance del proyecto..."
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                defaultValue={project?.status || "PLANNING"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="PLANNING">Planificación</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completado</option>
                <option value="ON_HOLD">En Pausa</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                name="currency"
                defaultValue={project?.currency || "USD"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="COP">COP - Peso Colombiano</option>
                <option value="CLP">CLP - Peso Chileno</option>
              </select>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="startDate"
                defaultValue={project?.startDate?.split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                name="endDate"
                defaultValue={project?.endDate?.split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Presupuesto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto
              </label>
              <input
                type="number"
                name="budget"
                step="0.01"
                min="0"
                defaultValue={project?.budget}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="mr-2 h-5 w-5" />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
