import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityType, ACTIVITY_TYPE_LABELS } from "@/types/crm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddActivityDialogProps {
  leadId: string;
  trigger?: React.ReactNode;
}

const AddActivityDialog = ({ leadId, trigger }: AddActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ActivityType>("email");
  const [content, setContent] = useState("");
  const [doneBy, setDoneBy] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const addActivityMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("activities")
        .insert({
          lead_id: leadId,
          type,
          content,
          done_by: doneBy || null,
          date: new Date(date).toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      toast.success("Activité ajoutée");
      setContent("");
      setDoneBy("");
      setDate(new Date().toISOString().split('T')[0]);
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Le contenu est requis");
      return;
    }
    addActivityMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="sm">Ajouter une activité</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une activité</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as ActivityType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez l'activité..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="doneBy">Réalisé par</Label>
            <Input
              id="doneBy"
              value={doneBy}
              onChange={(e) => setDoneBy(e.target.value)}
              placeholder="Optionnel"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={addActivityMutation.isPending}>
              {addActivityMutation.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityDialog;
