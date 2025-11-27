import { Lead, PRIORITY_LABELS } from "@/types/crm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Calendar, Bell } from "lucide-react";
import { formatDistanceToNow, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-priority-high text-priority-high-foreground';
      case 'medium':
        return 'bg-priority-medium text-priority-medium-foreground';
      case 'low':
        return 'bg-priority-low text-priority-low-foreground';
      default:
        return 'bg-priority-low text-priority-low-foreground';
    }
  };

  const hasActionToday = lead.next_action_date && isToday(new Date(lead.next_action_date));

  return (
    <Card
      className={`p-3 md:p-4 cursor-pointer hover:shadow-md transition-all bg-card ${
        hasActionToday 
          ? 'border-2 border-accent shadow-lg ring-2 ring-accent/20' 
          : 'border-border'
      }`}
      onClick={onClick}
    >
      <div className="space-y-2 md:space-y-3">
        {hasActionToday && (
          <Badge className="bg-accent text-accent-foreground w-full justify-center gap-2 py-1 md:py-1.5 animate-pulse text-xs">
            <Bell className="w-3 h-3" />
            <span className="hidden sm:inline">ACTION AUJOURD'HUI</span>
            <span className="sm:hidden">AUJOURD'HUI</span>
          </Badge>
        )}
        
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
            <h4 className="font-semibold text-sm truncate text-foreground">
              {lead.company_name}
            </h4>
          </div>
          <Badge className={`${getPriorityColor(lead.priority)} text-xs flex-shrink-0`}>
            {PRIORITY_LABELS[lead.priority]}
          </Badge>
        </div>

        {lead.contact_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-3 h-3" />
            <span className="truncate">{lead.contact_name}</span>
          </div>
        )}

        {lead.last_contact_date && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              Dernier contact:{" "}
              {formatDistanceToNow(new Date(lead.last_contact_date), {
                addSuffix: true,
                locale: fr,
              })}
            </span>
          </div>
        )}

        {lead.segment && (
          <div className="text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {lead.segment}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
