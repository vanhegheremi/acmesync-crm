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

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: scheduledLeads = [], isLoading: isLoadingScheduled } = useQuery({
    queryKey: ["scheduled-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("next_action_date", today)
        .neq("status", "won")
        .neq("status", "lost");

      if (error) throw error;
      return data as Lead[];
    },
  });

  const { data: staleLeads = [], isLoading: isLoadingStale } = useQuery({
    queryKey: ["stale-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .lt("last_contact_date", sevenDaysAgo)
        .neq("status", "won")
        .neq("status", "lost");

      if (error) throw error;
      return data as Lead[];
    },
  });

  const { data: interestedTryonLeads = [], isLoading: isLoadingInterested } = useQuery({
    queryKey: ["interested-tryon-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("type", "tryon")
        .eq("status", "interested")
        .neq("status", "won")
        .neq("status", "lost");

      if (error) throw error;
      return data as Lead[];
    },
  });

  const { data: problemDetectedHimytLeads = [], isLoading: isLoadingProblem } = useQuery({
    queryKey: ["problem-detected-himyt-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("type", "himyt")
        .eq("status", "problem_detected")
        .neq("status", "won")
        .neq("status", "lost");

      if (error) throw error;
      return data as Lead[];
    },
  });

  const { data: highPriorityLeads = [], isLoading: isLoadingHighPriority } = useQuery({
    queryKey: ["high-priority-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("priority", "high")
        .lt("last_contact_date", sevenDaysAgo)
        .neq("status", "won")
        .neq("status", "lost");

      if (error) throw error;
      return data as Lead[];
    },
  });

  const isLoading = isLoadingScheduled || isLoadingStale || isLoadingInterested || isLoadingProblem || isLoadingHighPriority;

  const totalLeads = scheduledLeads.length + staleLeads.length + interestedTryonLeads.length + 
                     problemDetectedHimytLeads.length + highPriorityLeads.length;

  const renderLeadCard = (lead: Lead) => (
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

            {lead.next_action && (
              <p className="text-sm mb-2">📋 {lead.next_action}</p>
            )}

            {lead.last_contact_date && (
              <p className="text-xs text-muted-foreground">
                Dernier contact:{" "}
                {formatDistanceToNow(new Date(lead.last_contact_date), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
        ) : totalLeads === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">✅ Aucune action en attente pour aujourd'hui !</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-warning mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">{totalLeads} leads nécessitent votre attention</span>
            </div>

            {scheduledLeads.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  📅 Actions programmées aujourd'hui
                  <Badge variant="secondary">{scheduledLeads.length}</Badge>
                </h2>
                {scheduledLeads.map((lead) => renderLeadCard(lead))}
              </div>
            )}

            {staleLeads.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  ⏰ Sans contact depuis 7+ jours
                  <Badge variant="secondary">{staleLeads.length}</Badge>
                </h2>
                {staleLeads.map((lead) => renderLeadCard(lead))}
              </div>
            )}

            {interestedTryonLeads.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  🎯 TRYON intéressés - Démo à programmer
                  <Badge variant="secondary">{interestedTryonLeads.length}</Badge>
                </h2>
                {interestedTryonLeads.map((lead) => renderLeadCard(lead))}
              </div>
            )}

            {problemDetectedHimytLeads.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  🔍 HIMYT problème détecté - Discovery call à planifier
                  <Badge variant="secondary">{problemDetectedHimytLeads.length}</Badge>
                </h2>
                {problemDetectedHimytLeads.map((lead) => renderLeadCard(lead))}
              </div>
            )}

            {highPriorityLeads.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  🚨 Priorité haute non contactés
                  <Badge variant="secondary">{highPriorityLeads.length}</Badge>
                </h2>
                {highPriorityLeads.map((lead) => renderLeadCard(lead))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Today;
