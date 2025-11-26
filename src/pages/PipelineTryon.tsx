import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, TRYON_STATUSES } from "@/types/crm";
import { KanbanBoard } from "@/components/crm/KanbanBoard";

const PipelineTryon = () => {
  const navigate = useNavigate();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads-tryon"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("type", "tryon")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
  });

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
                <h1 className="text-2xl font-bold text-foreground">Pipeline TRYON</h1>
                <p className="text-sm text-muted-foreground">Eshops / Mode / Shopify</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button onClick={() => navigate("/add-lead?type=tryon")}>
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
            statuses={TRYON_STATUSES}
            onLeadClick={(lead) => navigate(`/lead/${lead.id}`)}
          />
        )}
      </main>
    </div>
  );
};

export default PipelineTryon;
