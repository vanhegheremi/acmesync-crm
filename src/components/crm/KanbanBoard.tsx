import { Lead, LeadStatus, STATUS_LABELS } from "@/types/crm";
import { Card } from "@/components/ui/card";
import { LeadCard } from "./LeadCard";
import { useMemo } from "react";

interface KanbanBoardProps {
  leads: Lead[];
  statuses: LeadStatus[];
  onLeadClick: (lead: Lead) => void;
}

export function KanbanBoard({ leads, statuses, onLeadClick }: KanbanBoardProps) {
  const leadsByStatus = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = leads.filter((lead) => lead.status === status);
      return acc;
    }, {} as Record<LeadStatus, Lead[]>);
  }, [leads, statuses]);

  const getColumnColor = (status: LeadStatus) => {
    if (status === 'won') return 'bg-success/10 border-success/20';
    if (status === 'lost') return 'bg-destructive/10 border-destructive/20';
    return 'bg-muted/50 border-border';
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => (
        <div key={status} className="flex-shrink-0 w-80">
          <Card className={`p-4 min-h-[600px] ${getColumnColor(status)}`}>
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
              <p className="text-sm text-muted-foreground">
                {leadsByStatus[status]?.length || 0} leads
              </p>
            </div>
            <div className="space-y-3">
              {leadsByStatus[status]?.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => onLeadClick(lead)}
                />
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
