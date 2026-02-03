import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, CalendarPlus, Info } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import type { Prenotazione } from "@/types/types";

const prenotazioneSchema = z.object({
  utenteId: z.number().min(1, "ID Utente richiesto"),
  abitazioneId: z.number().min(1, "ID Abitazione richiesto"),
  dataInizio: z.string().min(1, "Data inizio richiesta"),
  dataFine: z.string().min(1, "Data fine richiesta"),
}).refine((data) => new Date(data.dataFine) > new Date(data.dataInizio), {
  message: "La data di fine deve essere successiva alla data di inizio",
  path: ["dataFine"],
});

type PrenotazioneFormValues = z.infer<typeof prenotazioneSchema>;

interface PrenotazioneFormProps {
  prenotazione?: Prenotazione;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

const PrenotazioneForm = ({ prenotazione, onSuccess, trigger }: PrenotazioneFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!prenotazione;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PrenotazioneFormValues>({
    resolver: zodResolver(prenotazioneSchema),
    defaultValues: {
      utenteId: prenotazione?.utenteId || 0,
      abitazioneId: prenotazione?.abitazioneId || 0,
      dataInizio: prenotazione?.dataInizio || "",
      dataFine: prenotazione?.dataFine || "",
    },
  });

  // Reset dei campi quando il dialog si apre o cambiano i dati
  useEffect(() => {
    if (open) {
      reset({
        utenteId: prenotazione?.utenteId || 0,
        abitazioneId: prenotazione?.abitazioneId || 0,
        dataInizio: prenotazione?.dataInizio ? prenotazione.dataInizio.split('T')[0] : "",
        dataFine: prenotazione?.dataFine ? prenotazione.dataFine.split('T')[0] : "",
      });
    }
  }, [prenotazione, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode 
        ? `${API_URL}/api/v1/prenotazioni/${prenotazione.id}` 
        : `${API_URL}/api/v1/prenotazioni`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Errore durante il salvataggio della prenotazione");

      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di connessione");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">
            <CalendarPlus className="h-4 w-4 mr-2" /> Nuova Prenotazione
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Dettagli Prenotazione" : "Crea Prenotazione"}</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli per la prenotazione dell'abitazione.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utenteId">ID Utente</Label>
              <Input 
                id="utenteId" 
                type="number" 
                {...register("utenteId",{valueAsNumber:true})} 
                disabled={isEditMode} 
              />
              {errors.utenteId && <p className="text-xs text-destructive">{errors.utenteId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="abitazioneId">ID Abitazione</Label>
              <Input 
                id="abitazioneId" 
                type="number" 
                {...register("abitazioneId",{valueAsNumber:true})} 
                disabled={isEditMode} 
              />
              {errors.abitazioneId && <p className="text-xs text-destructive">{errors.abitazioneId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataInizio">Data Inizio</Label>
            <Input id="dataInizio" type="date" {...register("dataInizio")} />
            {errors.dataInizio && <p className="text-xs text-destructive">{errors.dataInizio.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFine">Data Fine</Label>
            <Input id="dataFine" type="date" {...register("dataFine")} />
            {errors.dataFine && <p className="text-xs text-destructive">{errors.dataFine.message}</p>}
          </div>

          {isEditMode && prenotazione?.createdAt && (
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground border-t">
              <Info className="h-3 w-3" />
              Effettuata il: {new Date(prenotazione.createdAt).toLocaleString('it-IT')}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Aggiorna" : "Conferma"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrenotazioneForm;