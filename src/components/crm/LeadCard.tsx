import { Lead, PRIORITY_LABELS } from "@/types/crm";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Calendar, Bell, AlertTriangle } from "lucide-react";
import { formatDistanceToNow, isToday, isPast, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-primary/20 text-primary';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const hasActionToday = lead.next_action_date && isToday(new Date(lead.next_action_date));
  const isOverdue = lead.next_action_date && isPast(startOfDay(new Date(lead.next_action_date))) && !isToday(new Date(lead.next_action_date));

  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-all bg-card ${
        isOverdue
          ? 'border-2 border-destructive shadow-lg ring-2 ring-destructive/20'
          : hasActionToday 
            ? 'border-2 border-accent shadow-lg ring-2 ring-accent/20' 
            : 'border-border'
      }`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {isOverdue && (
          <Badge className="bg-destructive text-destructive-foreground w-full justify-center gap-2 py-1.5 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            EN RETARD
          </Badge>
        )}
        {hasActionToday && !isOverdue && (
          <Badge className="bg-accent text-accent-foreground w-full justify-center gap-2 py-1.5 animate-pulse">
            <Bell className="w-3 h-3" />
            ACTION AUJOURD'HUI
          </Badge>
        )}
        
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
            <h4 className="font-semibold text-sm truncate text-foreground">
              {lead.company_name}
            </h4>
          </div>
          <Badge className={getPriorityColor(lead.priority)}>
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
