import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { isDemoModeActive } from "@/hooks/useDemoMode";
import { DEMO_ACTIVITIES_WITH_LEADS } from "@/data/demoData";

const Activities = () => {
  const navigate = useNavigate();
  const isDemo = isDemoModeActive();

  const { data: activitiesWithLeads = [], isLoading } = useQuery({
    queryKey: ["all-activities"],
    queryFn: async () => {
      if (isDemo) return DEMO_ACTIVITIES_WITH_LEADS;
      const { data, error } = await supabase
        .from("activities")
        .select(`
          *,
          leads:lead_id (
            company_name,
            type
          )
        `)
        .order("date", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Timeline d'activités</h1>
              <p className="text-sm text-muted-foreground">Historique complet des interactions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : activitiesWithLeads.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucune activité enregistrée</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activitiesWithLeads.map((activity: any) => (
              <Card key={activity.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <Badge className={activity.leads?.type === 'tryon' ? 'bg-primary' : 'bg-accent'}>
                          {activity.leads?.type === 'tryon' ? 'TRYON' : 'HIMYT'}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">
                          {activity.leads?.company_name}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{activity.content}</p>
                      {activity.done_by && (
                        <p className="text-xs text-muted-foreground">Par: {activity.done_by}</p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.date), {
                        addSuffix: true,
                        locale: fr,
                      })}
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

export default Activities;
