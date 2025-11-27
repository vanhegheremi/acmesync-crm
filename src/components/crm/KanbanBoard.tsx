import { Lead, LeadStatus, STATUS_LABELS } from "@/types/crm";
import { Card } from "@/components/ui/card";
import { LeadCard } from "./LeadCard";
import { useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface KanbanBoardProps {
  leads: Lead[];
  statuses: LeadStatus[];
  onLeadClick: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

interface DraggableLeadCardProps {
  lead: Lead;
  onLeadClick: (lead: Lead) => void;
}

function DraggableLeadCard({ lead, onLeadClick }: DraggableLeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} onClick={() => onLeadClick(lead)} />
    </div>
  );
}

interface DroppableColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  getColumnColor: (status: LeadStatus) => string;
}

function DroppableColumn({ status, leads, onLeadClick, getColumnColor }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <Card 
        ref={setNodeRef}
        className={`p-4 min-h-[600px] transition-colors ${getColumnColor(status)} ${
          isOver ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
      >
        <div className="mb-4">
          <h3 className="font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
          <p className="text-sm text-muted-foreground">
            {leads.length} leads
          </p>
        </div>
        <SortableContext
          items={leads.map((lead) => lead.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[500px]">
            {leads.map((lead) => (
              <DraggableLeadCard
                key={lead.id}
                lead={lead}
                onLeadClick={onLeadClick}
              />
            ))}
          </div>
        </SortableContext>
      </Card>
    </div>
  );
}

export function KanbanBoard({ leads, statuses, onLeadClick, onStatusChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const leadsByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = leads.filter((lead) => lead.status === status);
      return acc;
    }, {} as Record<LeadStatus, Lead[]>);
  }, [leads, statuses]);

  const activeLead = useMemo(
    () => leads.find((lead) => lead.id === activeId),
    [activeId, leads]
  );

  const getColumnColor = (status: LeadStatus) => {
    if (status === 'won') return 'bg-success/10 border-success/20';
    if (status === 'lost') return 'bg-destructive/10 border-destructive/20';
    return 'bg-muted/50 border-border';
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeLeadId = active.id as string;
    const activeLead = leads.find((lead) => lead.id === activeLeadId);
    
    if (!activeLead) {
      setActiveId(null);
      return;
    }

    // Check if we're dropping over a status column (droppable zone)
    let targetStatus: LeadStatus | null = null;
    
    if (statuses.includes(over.id as LeadStatus)) {
      targetStatus = over.id as LeadStatus;
    } else {
      // If dropped over another lead, find its status
      const overLead = leads.find((lead) => lead.id === over.id);
      if (overLead) {
        targetStatus = overLead.status;
      }
    }
    
    if (targetStatus && activeLead.status !== targetStatus) {
      onStatusChange(activeLeadId, targetStatus);
    }
    
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            leads={leadsByStatus[status] || []}
            onLeadClick={onLeadClick}
            getColumnColor={getColumnColor}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeLead ? (
          <div className="rotate-3 opacity-80">
            <LeadCard lead={activeLead} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
