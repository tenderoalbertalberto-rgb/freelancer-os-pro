// ========================================================================
// Freelancer OS Pro - Página de Proyectos (CRUD Completo con Modal)
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, FolderKanban } from "lucide-react";
import { ProjectStatus } from "@prisma/client";
import ProjectForm from "@/components/projects/project-form";
import { deleteProject } from "./actions";

interface Client {
  id: string;
  name: string;
  company?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  currency: string;
  clientId: string;
  client: Client;
  tasks: Array<{ id: string; status: string }>;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Error al cargar datos");
      const data = await res.json();
      setProjects(data.projects);
      setClients(data.clients);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleNewProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    fetchData();
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto? Se eliminarán también las tareas asociadas.")) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      alert("Error al eliminar el proyecto");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return "bg-blue-100 text-blue-800";
      case ProjectStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case ProjectStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case ProjectStatus.ON_HOLD:
        return "bg-gray-100 text-gray-800";
      case ProjectStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return "Planificación";
      case ProjectStatus.IN_PROGRESS:
        return "En Progreso";
      case ProjectStatus.COMPLETED:
        return "Completado";
      case ProjectStatus.ON_HOLD:
        return "En Pausa";
      case ProjectStatus.CANCELLED:
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500 mt-1">
            {projects.length} {projects.length === 1 ? "proyecto registrado" : "proyectos registrados"}
          </p>
        </div>
        <button
          onClick={handleNewProject}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de proyecto o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 mt-2">Cargando proyectos...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">
              {searchTerm
                ? "No se encontraron proyectos con ese criterio"
                : "No hay proyectos registrados"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNewProject}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                + Crear el primer proyecto
              </button>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {project.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {project.tasks.length} {project.tasks.length === 1 ? "tarea" : "tareas"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.client.name}
                    </div>
                    {project.client.company && (
                      <div className="text-xs text-gray-500">
                        {project.client.company}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(project.startDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      → {formatDate(project.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(project.budget, project.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-primary-600 hover:text-primary-900 mr-3 transition-colors"
                      title="Editar proyecto"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={deletingId === project.id}
                      className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <ProjectForm
          project={editingProject || undefined}
          clients={clients}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
