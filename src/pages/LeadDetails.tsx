import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, User, Mail, Phone, Globe, Calendar, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, Activity, STATUS_LABELS, PRIORITY_LABELS, TRYON_STATUSES, HIMYT_STATUSES, LeadStatus, ACTIVITY_TYPE_LABELS, ORIGIN_LABELS, TEMPERATURE_LABELS, LeadOrigin, LeadTemperature, Priority } from "@/types/crm";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import AddActivityDialog from "@/components/crm/AddActivityDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LeadDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextActionDate, setNextActionDate] = useState("");

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setNotes(data.notes || "");
      setNextAction(data.next_action || "");
      setNextActionDate(data.next_action_date?.split('T')[0] || "");
      return data as Lead;
    },
    enabled: !!id,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("lead_id", id)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!id,
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (updates: Partial<Lead>) => {
      const { error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id!);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
      toast.success("Lead mis à jour");
    },
  });

  const completeNextActionMutation = useMutation({
    mutationFn: async () => {
      if (!nextAction) throw new Error("Aucune action à compléter");
      
      // Create completed activity
      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          lead_id: id!,
          type: "other",
          content: nextAction,
          completed: true,
          date: new Date().toISOString(),
          done_by: "Rémi",
        });

      if (activityError) throw activityError;

      // Reset next action and update last contact date
      const { error: leadError } = await supabase
        .from("leads")
        .update({
          next_action: null,
          next_action_date: null,
          last_contact_date: new Date().toISOString(),
        })
        .eq("id", id!);

      if (leadError) throw leadError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
      queryClient.invalidateQueries({ queryKey: ["activities", id] });
      setNextAction("");
      setNextActionDate("");
      toast.success("Tâche effectuée et ajoutée à l'historique");
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activityId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", id] });
      toast.success("Activité supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleSaveNotes = () => {
    updateLeadMutation.mutate({ notes });
  };

  const handleSaveNextAction = () => {
    updateLeadMutation.mutate({ 
      next_action: nextAction,
      next_action_date: nextActionDate 
    });
  };

  const handleStatusChange = (status: LeadStatus) => {
    updateLeadMutation.mutate({ status });
  };

  const handlePriorityChange = (priority: Priority) => {
    updateLeadMutation.mutate({ priority });
  };

  if (isLoading || !lead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const statuses = lead.type === "tryon" ? TRYON_STATUSES : HIMYT_STATUSES;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{lead.company_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  {lead.type === "tryon" ? "TRYON" : "HIMYT"}
                </p>
                {lead.contact_name && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">{lead.contact_name}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-l-4 border-l-primary bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Suivi commercial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lead.last_contact_date && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Dernière action</Label>
                    <p className="mt-1 text-sm">
                      {format(new Date(lead.last_contact_date), "d MMMM yyyy", { locale: fr })}
                      <span className="text-muted-foreground ml-2">
                        ({formatDistanceToNow(new Date(lead.last_contact_date), {
                          addSuffix: true,
                          locale: fr,
                        })})
                      </span>
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="next_action" className="text-sm font-semibold">Prochaine action</Label>
                  {!nextAction && (
                    <p className="mt-1 text-sm text-muted-foreground italic">Aucune action programmée</p>
                  )}
                  <Input
                    id="next_action"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder="Ex: Envoyer démo, rappeler le client..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="next_action_date">Date prochaine action</Label>
                  <Input
                    id="next_action_date"
                    type="date"
                    value={nextActionDate}
                    onChange={(e) => setNextActionDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveNextAction} size="sm" variant="outline">
                    Enregistrer le suivi
                  </Button>
                  {nextAction && (
                    <Button 
                      onClick={() => completeNextActionMutation.mutate()} 
                      size="sm"
                      disabled={completeNextActionMutation.isPending}
                    >
                      Tâche effectuée
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {lead.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                        {lead.email}
                      </a>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Site web
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {lead.segment && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Segment</Label>
                      <Badge variant="outline" className="mt-1">{lead.segment}</Badge>
                    </div>
                  )}

                  {lead.origin && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Origine du lead</Label>
                      <Select value={lead.origin} onValueChange={(value: LeadOrigin) => updateLeadMutation.mutate({ origin: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ORIGIN_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {lead.temperature && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Température du lead</Label>
                    <div className="mt-1">
                      <Select value={lead.temperature} onValueChange={(value: LeadTemperature) => updateLeadMutation.mutate({ temperature: value })}>
                        <SelectTrigger>
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={
                                  lead.temperature === 'hot' 
                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                    : lead.temperature === 'warm'
                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                                }
                              >
                                {TEMPERATURE_LABELS[lead.temperature]}
                              </Badge>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TEMPERATURE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={
                                    key === 'hot' 
                                      ? 'bg-red-500 text-white' 
                                      : key === 'warm'
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-gray-400 text-white'
                                  }
                                >
                                  {label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground">Statut</Label>
                  <Select value={lead.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Ajouter des notes..."
                />
                <Button onClick={handleSaveNotes} className="mt-4" size="sm">
                  Enregistrer les notes
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historique des activités</CardTitle>
                  <AddActivityDialog leadId={lead.id} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune activité enregistrée
                    </p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className={`border-l-2 border-primary pl-4 pb-4 last:pb-0 ${activity.completed ? 'opacity-60' : ''}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {ACTIVITY_TYPE_LABELS[activity.type as keyof typeof ACTIVITY_TYPE_LABELS]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(activity.date), "d MMM yyyy", { locale: fr })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AddActivityDialog 
                              leadId={id!} 
                              activity={activity}
                              mode="edit"
                              trigger={
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              }
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'activité</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteActivityMutation.mutate(activity.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <p className={`text-sm mb-1 ${activity.completed ? 'line-through' : ''}`}>{activity.content}</p>
                        {activity.done_by && (
                          <p className="text-xs text-muted-foreground">Par {activity.done_by}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Priorité</Label>
                  <Select value={lead.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {lead.last_contact_date && (
                  <div>
                    <p className="text-muted-foreground">Dernier contact</p>
                    <p className="mt-1">
                      {formatDistanceToNow(new Date(lead.last_contact_date), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetails;
