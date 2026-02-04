import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, CalendarPlus} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Abitazione, Prenotazione, Utente } from "@/types/types";

const prenotazioneSchema = z
  .object({
    utenteId: z.number().min(1, "Seleziona un utente"),
    abitazioneId: z.number().min(1, "Seleziona un'abitazione"),
    dataInizio: z.string().min(1, "Data inizio richiesta"),
    dataFine: z.string().min(1, "Data fine richiesta"),
  })
  .refine((data) => new Date(data.dataFine) > new Date(data.dataInizio), {
    message: "La fine deve essere dopo l'inizio",
    path: ["dataFine"],
  })
  .refine((data) => new Date(data.dataInizio) >= new Date(new Date().setHours(0,0,0,0)), {
    message: "Non puoi prenotare nel passato",
    path: ["dataInizio"],
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
  
  const [users, setUsers] = useState<Utente[]>([]);
  const [residences, setResidences] = useState<Abitazione[]>([]);
  
  const [allBookings, setAllBookings] = useState<Prenotazione[]>([]);

  const isEditMode = !!prenotazione;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PrenotazioneFormValues>({
    resolver: zodResolver(prenotazioneSchema),
    defaultValues: {
      utenteId: prenotazione?.utenteId || undefined,
      abitazioneId: prenotazione?.abitazioneId || undefined,
      dataInizio: prenotazione?.dataInizio ? prenotazione.dataInizio.split("T")[0] : "",
      dataFine: prenotazione?.dataFine ? prenotazione.dataFine.split("T")[0] : "",
    },
  });

  const selectedAbitazione = watch("abitazioneId");
  const startDate = watch("dataInizio");
  const endDate = watch("dataFine");

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch(`${API_URL}/api/v1/users`).then(res => res.json()),
        fetch(`${API_URL}/api/v1/abitazioni`).then(res => res.json()),
        fetch(`${API_URL}/api/v1/prenotazioni`).then(res => res.json())
      ]).then(([u, a, p]) => {
        setUsers(u);
        setResidences(a);
        setAllBookings(p);
      }).catch(() => setError("Errore nel caricamento dati"));
    }
  }, [open]);

  // FUNZIONE DI CONTROLLO DISPONIBILITÀ
  const checkAvailability = () => {
    if (!selectedAbitazione || !startDate || !endDate) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflicts = allBookings.filter(b => 
      b.abitazioneId === selectedAbitazione && 
      b.id !== prenotazione?.id &&
      (
        (start >= new Date(b.dataInizio) && start < new Date(b.dataFine)) || 
        (end > new Date(b.dataInizio) && end <= new Date(b.dataFine)) ||    
        (start <= new Date(b.dataInizio) && end >= new Date(b.dataFine))
      )
    );

    return conflicts.length === 0;
  };

  const isAvailable = checkAvailability();

  const onSubmit = handleSubmit(async (data) => {
    if (!isAvailable) {
      setError("L'abitazione è già occupata in queste date!");
      return;
    }

    setError(null);
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `${API_URL}/api/v1/prenotazioni/${prenotazione.id}` : `${API_URL}/api/v1/prenotazioni`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Errore durante il salvataggio");
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di connessione");
    }
  });

    useEffect(() => {
    if (open) {
      reset({
        utenteId: prenotazione?.utenteId || 0,
        abitazioneId: prenotazione?.abitazioneId || 0,
        dataInizio: prenotazione?.dataInizio || "",
        dataFine: prenotazione?.dataFine || ""
      });
    }
  }, [prenotazione, open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button><CalendarPlus className="mr-2 h-4 w-4" /> Nuova Prenotazione</Button>}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifica" : "Crea"} Prenotazione</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* SELECT UTENTE */}
          <div className="space-y-2">
            <Label>Utente</Label>
            <Controller
              control={control}
              name="utenteId"
              render={({ field }) => (
                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Seleziona utente" /></SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.nomeUser} {u.cognome}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* SELECT ABITAZIONE */}
          <div className="space-y-2">
            <Label>Abitazione</Label>
            <Controller
              control={control}
              name="abitazioneId"
              render={({ field }) => (
                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Seleziona abitazione" /></SelectTrigger>
                  <SelectContent>
                    {residences.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.nomeAbitazione}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>


          {/* DATE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Inizio</Label>
              <Input type="date" {...register("dataInizio")} />
            </div>
            <div className="space-y-2">
              <Label>Fine</Label>
              <Input type="date" {...register("dataFine")} />
            </div>
          </div>

          {/* AVVISO DISPONIBILITÀ REAL-TIME */}
          {startDate && endDate && selectedAbitazione && (
            <div className={`p-2 rounded text-xs font-bold ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isAvailable ? "✓ Date disponibili" : "✗ Abitazione occupata in questo periodo"}
            </div>
          )}

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {errors.dataFine && <p className="text-xs text-destructive">{errors.dataFine.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !isAvailable}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salva Prenotazione
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrenotazioneForm;