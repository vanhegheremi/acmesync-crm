import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { DEMO_ACTIVITIES_WITH_LEADS } from "@/data/demoData";

const Activities = () => {
  const navigate = useNavigate();
  const activitiesWithLeads = DEMO_ACTIVITIES_WITH_LEADS;

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
        {activitiesWithLeads.length === 0 ? (
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
