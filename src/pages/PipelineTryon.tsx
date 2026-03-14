import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Lead, TRYON_STATUSES, LeadStatus } from "@/types/crm";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { DEMO_TRYON_LEADS } from "@/data/demoData";

const PipelineTryon = () => {
  const navigate = useNavigate();
  const leads: Lead[] = DEMO_TRYON_LEADS;

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
              <Button onClick={() => navigate("/add-lead?type=tryon")}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un lead
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 max-w-full overflow-hidden">
        <KanbanBoard
          leads={leads}
          statuses={TRYON_STATUSES}
          onLeadClick={(lead) => navigate(`/lead/${lead.id}`)}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
};

export default PipelineTryon;
