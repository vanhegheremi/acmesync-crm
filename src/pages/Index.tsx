import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Factory, Plus, Calendar, AlertTriangle } from "lucide-react";
import { DEMO_ALL_LEADS } from "@/data/demoData";

function computeStats(type: "tryon" | "himyt") {
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const active = DEMO_ALL_LEADS.filter(
    (l) => l.type === type && l.status !== "won" && l.status !== "lost"
  );
  const totalCount = active.length;
  const actionTodayCount = active.filter(
    (l) => l.next_action_date?.split("T")[0] === today
  ).length;
  const staleCount = active.filter((l) => {
    if (!l.last_contact_date || l.last_contact_date >= sevenDaysAgo) return false;
    if (!l.next_action_date) return true;
    return l.next_action_date <= today;
  }).length;
  const overdueCount = active.filter(
    (l) => l.next_action_date && l.next_action_date.split("T")[0] < today
  ).length;
  return { total: totalCount, actionNeeded: actionTodayCount + staleCount, overdue: overdueCount };
}

const Index = () => {
  const navigate = useNavigate();
  const tryonStats = computeStats("tryon");
  const himytStats = computeStats("himyt");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">CRM Pipeline</h1>
          <p className="text-muted-foreground mt-1">HIMYT x TRYON</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer bg-card border-border"
            onClick={() => navigate("/pipeline/tryon")}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">Pipeline TRYON</CardTitle>
              </div>
              <CardDescription className="text-base">Eshops / Mode / Shopify</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Leads en cours</span>
                  <span className="text-2xl font-bold text-foreground">{tryonStats?.total || 0}</span>
                </div>
                <div 
                  className="flex justify-between items-center p-3 rounded-lg bg-warning/10 cursor-pointer hover:bg-warning/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/today");
                  }}
                >
                  <span className="text-sm text-muted-foreground">À relancer aujourd'hui</span>
                  <span className="text-2xl font-bold text-warning">{tryonStats?.actionNeeded || 0}</span>
                </div>
                {(tryonStats?.overdue ?? 0) > 0 && (
                  <div 
                    className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 animate-pulse cursor-pointer hover:bg-destructive/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/today");
                    }}
                  >
                    <span className="text-sm text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      En retard
                    </span>
                    <span className="text-2xl font-bold text-destructive">{tryonStats?.overdue || 0}</span>
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/add-lead?type=tryon");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un lead TRYON
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer bg-card border-border"
            onClick={() => navigate("/pipeline/himyt")}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Factory className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-2xl text-foreground">Pipeline HIMYT</CardTitle>
              </div>
              <CardDescription className="text-base">Dev, Automation, IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Leads en cours</span>
                  <span className="text-2xl font-bold text-foreground">{himytStats?.total || 0}</span>
                </div>
                <div 
                  className="flex justify-between items-center p-3 rounded-lg bg-warning/10 cursor-pointer hover:bg-warning/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/today");
                  }}
                >
                  <span className="text-sm text-muted-foreground">À relancer aujourd'hui</span>
                  <span className="text-2xl font-bold text-warning">{himytStats?.actionNeeded || 0}</span>
                </div>
                {(himytStats?.overdue ?? 0) > 0 && (
                  <div 
                    className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 animate-pulse cursor-pointer hover:bg-destructive/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/today");
                    }}
                  >
                    <span className="text-sm text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      En retard
                    </span>
                    <span className="text-2xl font-bold text-destructive">{himytStats?.overdue || 0}</span>
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-4 bg-accent hover:bg-accent/90"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/add-lead?type=himyt");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un lead HIMYT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
