import type { Feedback } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { DialogFooter, Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Label } from "../ui/label";

const feedbackSchema = z.object({
  idHost: z.number().min(1, "id host richiesto"),
  titolo: z.string().min(2, "titolo richiesto").max(50),
  testo: z.string().min(2).max(500, "testo richiesto"),
  punteggio: z.number().min(1).max(5, "punteggio obbligatorio"),
  prenotazioneId: z.number().min(1, "campo richiesto"),
});

type FeedbackSchemaValue = z.infer<typeof feedbackSchema>;

interface FeedbackSchemaProps {
  feedback?: Feedback;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

const FeedbackForm = ({ feedback, onSuccess, trigger }: FeedbackSchemaProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!feedback;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FeedbackSchemaValue>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      idHost: feedback?.idHost || 0,
      titolo: feedback?.titolo || "",
      testo: feedback?.testo || "",
      punteggio: feedback?.punteggio || 1,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        idHost: feedback?.idHost || 0,
        titolo: feedback?.titolo || "",
        testo: feedback?.testo || "",
        punteggio: feedback?.punteggio || 1,
      });
    }
  }, [feedback, open, reset]);

  const onSubmit = handleSubmit (async(data)=>{
    setError(null);
    try {
      const url = isEditMode 
        ? `${API_URL}/api/v1/feedbacks/${feedback.id}` 
        : `${API_URL}/api/v1/feedbacks`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Errore nel salvataggio");
      }

      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={isEditMode ? "outline" : "default"}>
            {isEditMode ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {isEditMode ? "Modifica" : "Nuova Abitazione"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifica" : "Crea"} Abitazione</DialogTitle>
          <DialogDescription>Compila tutti i campi obbligatori.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2 space-y-1">
              <Label>Id Host</Label>
              <Input type="number"{...register("idHost",{valueAsNumber:true})} />
              {errors.idHost && <p className="text-xs text-destructive">{errors.idHost.message}</p>}
            </div>


            <div className="col-span-2 space-y-1">
              <Label>Titolo</Label>
              <Input {...register("titolo")} />
              {errors.titolo && <p className="text-xs text-destructive">{errors.titolo.message}</p>}
            </div>

            
            <div className="space-y-1">
              <Label>Testo</Label>
              <Input {...register("testo")} />
              {errors.testo && <p className="text-xs text-destructive">{errors.testo.message}</p>}
            </div>

            
            <div className="space-y-1">
              <Label>Punteggio</Label>
              <Input type="punteggio" {...register("punteggio",{valueAsNumber:true})} />
              {errors.punteggio && <p className="text-xs text-destructive">{errors.punteggio.message}</p>}
            </div>

            
            <div className="space-y-1">
              <Label>Id Prenotazione</Label>
              <Input {...register("prenotazioneId",{valueAsNumber:true})} />
              {errors.prenotazioneId && <p className="text-xs text-destructive">{errors.prenotazioneId.message}</p>}
            </div>

          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Aggiorna" : "Crea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
