import type { Abitazione } from "@/types/types";
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
import { Loader2, Pencil, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema validazione con coercizione per i numeri
const residenceSchema = z.object({
  nomeAbitazione: z.string().min(2, "Nome troppo breve"),
  indirizzoAbitazione: z.string().min(2, "Indirizzo obbligatorio"),
  nlocali: z.number().min(1, "Minimo 1 locale"),
  npostiLetto: z.number().min(1, "Minimo 1 posto letto"),
  prezzoPerNotte: z.number().min(0.1, "Prezzo richiesto"),
  disponibilitaInizio: z.string().min(1, "Data inizio obbligatoria"),
  disponibilitaFine: z.string().min(1, "Data fine obbligatoria"),
  idHost: z.number().min(1, "ID Host obbligatorio"),
});

type ResidenceFormValues = z.infer<typeof residenceSchema>;

interface ResidenceFormProps {
  residence?: Abitazione;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

const ResidenceForm = ({ residence, onSuccess, trigger }: ResidenceFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!residence;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResidenceFormValues>({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      nomeAbitazione: residence?.nomeAbitazione || "",
      indirizzoAbitazione: residence?.indirizzoAbitazione || "",
      nlocali:residence?.nlocali || 1,
      npostiLetto: residence?.npostiLetto || 1,
      prezzoPerNotte:residence?.prezzoPerNotte || 0,
      disponibilitaInizio: residence?.disponibilitaInizio ||"",
      disponibilitaFine: residence?.disponibilitaFine || "",
      idHost: residence?.idHost || 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (residence) {
        // Formattazione date per input type="date" (YYYY-MM-DD)
        const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : "";
        
        reset({
          ...residence,
          disponibilitaInizio: formatDate(residence.disponibilitaInizio),
          disponibilitaFine: formatDate(residence.disponibilitaFine),
        });
      } else {
        reset({
          nomeAbitazione: "",
          indirizzoAbitazione: "",
          nlocali: 1,
          npostiLetto: 1,
          prezzoPerNotte: 0,
          disponibilitaInizio: "",
          disponibilitaFine: "",
          idHost: 1,
        });
      }
    }
  }, [residence, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      const url = isEditMode 
        ? `${API_URL}/api/v1/abitazioni/${residence.id}` 
        : `${API_URL}/api/v1/abitazioni`;

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
            {/* Nome */}
            <div className="col-span-2 space-y-1">
              <Label>Nome Abitazione</Label>
              <Input {...register("nomeAbitazione")} />
              {errors.nomeAbitazione && <p className="text-xs text-destructive">{errors.nomeAbitazione.message}</p>}
            </div>

            {/* Indirizzo */}
            <div className="col-span-2 space-y-1">
              <Label>Indirizzo</Label>
              <Input {...register("indirizzoAbitazione")} />
              {errors.indirizzoAbitazione && <p className="text-xs text-destructive">{errors.indirizzoAbitazione.message}</p>}
            </div>

            {/* Locali */}
            <div className="space-y-1">
              <Label>Locali</Label>
              <Input type="number" {...register("nlocali",{valueAsNumber:true})} />
              {errors.nlocali && <p className="text-xs text-destructive">{errors.nlocali.message}</p>}
            </div>

            {/* Posti Letto */}
            <div className="space-y-1">
              <Label>Posti Letto</Label>
              <Input type="number" {...register("npostiLetto",{valueAsNumber:true})} />
              {errors.npostiLetto && <p className="text-xs text-destructive">{errors.npostiLetto.message}</p>}
            </div>

            {/* Prezzo */}
            <div className="space-y-1">
              <Label>Prezzo/Notte (€)</Label>
              <Input type="number" step="0.01" {...register("prezzoPerNotte",{valueAsNumber:true})} />
              {errors.prezzoPerNotte && <p className="text-xs text-destructive">{errors.prezzoPerNotte.message}</p>}
            </div>

            {/* ID Host */}
            <div className="space-y-1">
              <Label>ID Host</Label>
              <Input type="number" {...register("idHost",{valueAsNumber:true})} />
              {errors.idHost && <p className="text-xs text-destructive">{errors.idHost.message}</p>}
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label>Inizio Disponibilità</Label>
              <Input type="date" {...register("disponibilitaInizio")} />
              {errors.disponibilitaInizio && <p className="text-xs text-destructive">{errors.disponibilitaInizio.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Fine Disponibilità</Label>
              <Input type="date" {...register("disponibilitaFine")} />
              {errors.disponibilitaFine && <p className="text-xs text-destructive">{errors.disponibilitaFine.message}</p>}
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

export default ResidenceForm;