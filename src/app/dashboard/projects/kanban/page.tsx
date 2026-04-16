"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { projectService } from "@/modules/erp/services/projectService";
import { Project } from "@/modules/erp/types/project";
import { 
  Plus, 
  LayoutGrid, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "@/modules/erp/components/Kanban/KanbanColumn";
import { KanbanCard } from "@/modules/erp/components/Kanban/KanbanCard";

const COLUMNS = [
  { id: "Medição", label: "Medição", color: "border-blue-500" },
  { id: "Projeto", label: "Design/Projeto", color: "border-purple-500" },
  { id: "Produção", label: "Em Fabricação", color: "border-orange-500" },
  { id: "Montagem", label: "Montagem/Obra", color: "border-emerald-500" },
  { id: "Concluído", label: "Entrega Final", color: "border-brass-500" },
];

export default function KanbanPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const data = await projectService.getAll(user.uid);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Project") {
      setActiveProject(event.active.data.current.project);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Project";
    const isOverACard = over.data.current?.type === "Project";

    if (!isActiveACard) return;

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      setProjects((prev) => {
        const activeIndex = prev.findIndex((p) => p.id === activeId);
        const overIndex = prev.findIndex((p) => p.id === overId);

        if (prev[activeIndex].status !== prev[overIndex].status) {
          const updatedProjects = [...prev];
          updatedProjects[activeIndex].status = updatedProjects[overIndex].status;
          return arrayMove(updatedProjects, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    // Dropping a card over a column
    const isOverAColumn = COLUMNS.some(col => col.id === overId);
    if (isActiveACard && isOverAColumn) {
      setProjects((prev) => {
        const activeIndex = prev.findIndex((p) => p.id === activeId);
        const updatedProjects = [...prev];
        updatedProjects[activeIndex].status = overId as any;
        
        return arrayMove(updatedProjects, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveProject(null);
    const { active, over } = event;
    if (!over) return;

    const project = projects.find(p => p.id === active.id);
    if (project && user) {
      try {
        await projectService.update(project.id, { 
          status: project.status,
          updatedAt: new Date() as any // Firestore will handle serverTimestamp if we use the service update properly
        });
      } catch (error) {
        console.error("Error updating project status after drag:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brass-500" size={48} />
        <p className="text-wood-400 font-bold uppercase tracking-widest text-[10px]">Lixando a madeira...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase px-1 border-l-4 border-brass-500 ml-[-4px]">
            Fluxo de Trabalho
          </h1>
          <p className="text-wood-400 mt-1">Gestão visual e colaborativa da sua marcenaria.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/projects">
              <Button variant="secondary" className="border-wood-800 text-wood-500">
                <LayoutGrid size={18} className="mr-2" />
                Ver em Lista
              </Button>
            </Link>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Novo Projeto
            </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-wood-800">
          <div className="flex gap-6 min-w-[1200px] h-full">
            {COLUMNS.map((col) => (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                label={col.label} 
                color={col.color} 
                projects={projects.filter(p => p.status === col.id)} 
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}>
          {activeProject ? (
            <div className="w-80 rotate-3">
              <KanbanCard project={activeProject} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
