import type { Abitazione, Feedback, Prenotazione, Utente } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  DialogFooter,
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Option {
  id: number;
  label: string;
}
const feedbackSchema = z.object({
  idUser: z.number().min(1, "id utente richiesto"),
  idAbitazione: z.number().min(1, "id abitazione richiesto"),
  titolo: z.string().min(2, "titolo richiesto").max(50),
  testo: z.string().min(2).max(500, "testo richiesto"),
  punteggio: z.number().min(1).max(5, "punteggio obbligatorio"),
  prenotazioneId: z.number( "campo richiesto"),
});

type FeedbackSchemaValue = z.infer<typeof feedbackSchema>;

interface FeedbackSchemaProps {
  feedback?: Feedback;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;
type PrenotazionePrew = Pick<Prenotazione,"id">
const FeedbackForm = ({
  feedback,
  onSuccess,
  trigger,
}: FeedbackSchemaProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Option[]>([]);
  const [reservations,setReservation] = useState<PrenotazionePrew[] | null>([]);
  const [abitazioni, setAbitazioni] = useState<Option[]>([]);
  const isEditMode = !!feedback;

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch(`${API_URL}/api/v1/users`).then((res) => res.json()),
        fetch(`${API_URL}/api/v1/abitazioni`).then((res) => res.json()),
        fetch(`${API_URL}/api/v1/prenotazioni`).then((res) => res.json()),
      ])
        .then(([usersData, abitazioniData,reservationData]) => {
          setUsers(usersData.map((u: Utente) => ({ id: u.id, label: `${u.nomeUser} ${u.cognome}` })));
          setAbitazioni(abitazioniData.map((a: Abitazione) => ({ id: a.id, label: a.nomeAbitazione })));
          setReservation(reservationData.map((r:Prenotazione)=>({id:r.id})));
        })
        .catch((err) => console.error("Errore fetch:", err));
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FeedbackSchemaValue>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      idUser: feedback?.idUser || 0,
      idAbitazione: feedback?.idAbitazione || 0,
      titolo: feedback?.titolo || "",
      testo: feedback?.testo || "",
      punteggio: feedback?.punteggio || 1,
      prenotazioneId: feedback?.prenotazioneId || 0, 
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        idUser: feedback?.idUser || 0,
        idAbitazione: feedback?.idAbitazione || 0,
        titolo: feedback?.titolo || "",
        testo: feedback?.testo || "",
        punteggio: feedback?.punteggio || 1,
        prenotazioneId: feedback?.prenotazioneId || 0,
      });
    }
  }, [feedback, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
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
            {isEditMode ? "Modifica" : "Nuovo Feedback"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifica" : "Crea"} Feedback</DialogTitle>
          <DialogDescription>Seleziona l'utente e l'abitazione dai menu a tendina.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            
            {/* SELECT UTENTE */}
            <div className="col-span-2 space-y-1">
              <Label>Utente</Label>
              <Controller
                control={control}
                name="idUser"
                render={({ field }) => (
                  <Select 
                    onValueChange={(val)=>field.onChange(Number(val))} 
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona utente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>{u.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.idUser && <p className="text-xs text-destructive">{errors.idUser.message}</p>}
            </div>

            {/* SELECT ABITAZIONE */}
            <div className="col-span-2 space-y-1">
              <Label>Abitazione</Label>
              <Controller
                control={control}
                name="idAbitazione"
                render={({ field }) => (
                  <Select 
                    onValueChange={(val)=>field.onChange(Number(val))} 
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona abitazione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {abitazioni.map((a) => (
                        <SelectItem key={a.id} value={a.id.toString()}>{a.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.idAbitazione && <p className="text-xs text-destructive">{errors.idAbitazione.message}</p>}
            </div>

            <div className="col-span-2 space-y-1">
              <Label>Titolo</Label>
              <Input {...register("titolo")} placeholder="Esempio: Soggiorno fantastico" />
              {errors.titolo && <p className="text-xs text-destructive">{errors.titolo.message}</p>}
            </div>

            <div className="col-span-2 space-y-1">
              <Label>Testo</Label>
              <Input {...register("testo")} placeholder="Scrivi qui la tua recensione..." />
              {errors.testo && <p className="text-xs text-destructive">{errors.testo.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Punteggio (1-5)</Label>
              <Input type="number" min="1" max="5" {...register("punteggio",{valueAsNumber:true})} />
              {errors.punteggio && <p className="text-xs text-destructive">{errors.punteggio.message}</p>}
            </div>

            <div className="col-span-2 space-y-1">
              <Label>Prenotazione</Label>
              <Controller
                control={control}
                name="prenotazioneId"
                render={({ field }) => (
                  <Select 
                    onValueChange={(val)=>field.onChange(Number(val))} 
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona Prenotazione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {reservations?.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>{r.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                />
            </div>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annulla</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Aggiorna" : "Invia Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
