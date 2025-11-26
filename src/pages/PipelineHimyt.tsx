import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, HIMYT_STATUSES, LeadStatus } from "@/types/crm";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { toast } from "sonner";

const PipelineHimyt = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads-himyt"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("type", "himyt")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ leadId, newStatus }: { leadId: string; newStatus: LeadStatus }) => {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads-himyt"] });
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateStatusMutation.mutate({ leadId, newStatus });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pipeline HIMYT</h1>
                <p className="text-sm text-muted-foreground">PME Industrielles + Automatisation IA</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button className="bg-accent hover:bg-accent/90" onClick={() => navigate("/add-lead?type=himyt")}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un lead
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : (
          <KanbanBoard
            leads={leads}
            statuses={HIMYT_STATUSES}
            onLeadClick={(lead) => navigate(`/lead/${lead.id}`)}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
};

export default PipelineHimyt;
