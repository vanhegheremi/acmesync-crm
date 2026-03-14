import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Lead, PARTICULIERS_STATUSES, LeadStatus } from "@/types/crm";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { DEMO_PARTICULIERS_LEADS } from "@/data/demoData";

const PipelineTryon = () => {
  const navigate = useNavigate();
  const leads: Lead[] = DEMO_PARTICULIERS_LEADS;

  const handleStatusChange = (_leadId: string, _newStatus: LeadStatus) => {
    // Données de démo — aucune persistance
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
                <h1 className="text-2xl font-bold text-foreground">Pipeline Particuliers</h1>
                <p className="text-sm text-muted-foreground">Artisans indépendants / Auto-entrepreneurs</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/add-lead?type=particuliers")}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un artisan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 max-w-full overflow-hidden">
        <KanbanBoard
          leads={leads}
          statuses={PARTICULIERS_STATUSES}
          onLeadClick={(lead) => navigate(`/lead/${lead.id}`)}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
};

export default PipelineTryon;
