import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, STATUS_LABELS } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Today = () => {
  const navigate = useNavigate();

  const { data: actionNeededLeads = [], isLoading } = useQuery({
    queryKey: ["action-needed-leads"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Leads with action scheduled for today
      const { data: todayLeads, error: error1 } = await supabase
        .from("leads")
        .select("*")
        .eq("next_action_date", today)
        .neq("status", "won")
        .neq("status", "lost");

      if (error1) throw error1;

      // Leads not contacted in last 7 days
      const { data: staleLeads, error: error2 } = await supabase
        .from("leads")
        .select("*")
        .lt("last_contact_date", sevenDaysAgo)
        .neq("status", "won")
        .neq("status", "lost");

      if (error2) throw error2;

      // Combine and deduplicate
      const allLeads = [...(todayLeads || []), ...(staleLeads || [])];
      const uniqueLeads = Array.from(
        new Map(allLeads.map((lead) => [lead.id, lead])).values()
      );

      return uniqueLeads as Lead[];
    },
  });

  const getActionReason = (lead: Lead) => {
    const today = new Date().toISOString().split('T')[0];
    if (lead.next_action_date === today) {
      return "Action programmée aujourd'hui";
    }
    if (lead.last_contact_date) {
      const daysSinceContact = Math.floor(
        (Date.now() - new Date(lead.last_contact_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceContact >= 7) {
        return `Pas de contact depuis ${daysSinceContact} jours`;
      }
    }
    return "Action requise";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">À faire aujourd'hui</h1>
              <p className="text-sm text-muted-foreground">Leads nécessitant votre attention</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : actionNeededLeads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">✅ Aucune action en attente pour aujourd'hui !</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-warning mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">{actionNeededLeads.length} leads nécessitent votre attention</span>
            </div>

            {actionNeededLeads.map((lead) => (
              <Card
                key={lead.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/lead/${lead.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{lead.company_name}</h3>
                        <Badge className={lead.type === 'tryon' ? 'bg-primary' : 'bg-accent'}>
                          {lead.type === 'tryon' ? 'TRYON' : 'HIMYT'}
                        </Badge>
                        <Badge variant="outline">{STATUS_LABELS[lead.status]}</Badge>
                      </div>

                      {lead.contact_name && (
                        <p className="text-sm text-muted-foreground mb-2">{lead.contact_name}</p>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-warning font-medium">{getActionReason(lead)}</span>
                      </div>

                      {lead.last_contact_date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Dernier contact:{" "}
                          {formatDistanceToNow(new Date(lead.last_contact_date), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); /* TODO: Open activity dialog */ }}>
                        Relancer
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); /* TODO: Schedule action */ }}>
                        Programmer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Today;
