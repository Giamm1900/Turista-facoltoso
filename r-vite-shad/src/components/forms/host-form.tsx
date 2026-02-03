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
import { Loader2, UserPlus, Info } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import type { Host } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";


const hostSchema = z.object({
  idUtente: z.number().min(1, "ID Utente richiesto per la promozione"),
});

type HostFormValues = z.infer<typeof hostSchema>;

interface HostFormProps {
  host?: Host;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

const HostForm = ({ host, onSuccess, trigger }: HostFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!host;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      idUtente: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        idUtente: host?.idUtente || 0,
      });
    }
  }, [host, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/hosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUtente: data.idUtente }),
      });

      if (!res.ok) throw new Error("Errore durante la creazione dell'host");

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
            <UserPlus className="h-4 w-4 mr-2" /> Promuovi a Host
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Dettagli Host" : "Promuovi Utente a Host"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Informazioni sull'host selezionato." 
              : "Inserisci l'ID dell'utente esistente da registrare come Host."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-2 border p-3 rounded-md bg-secondary/20">
            <Label htmlFor="idUtente" className="font-bold text-primary">ID Utente (Campo Obbligatorio)</Label>
            <Input 
              id="idUtente"
              type="number" 
              {...register("idUtente",{valueAsNumber:true})} 
              disabled={isEditMode} 
              placeholder="Inserisci ID Utente..."
            />
            {errors.idUtente && <p className="text-xs text-destructive font-medium">{errors.idUtente.message}</p>}
          </div>
          {isEditMode && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Info className="h-4 w-4" />
                <span>Informazioni recuperate dal profilo Utente</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">Nome e Cognome</Label>
                  <p className="text-sm font-medium">{host.nomeUser} {host.cognome}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{host.email}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs uppercase text-muted-foreground">Indirizzo</Label>
                  <p className="text-sm font-medium">{host.indirizzoUser}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">Data Reg. Host</Label>
                  <p className="text-sm font-medium">
                    {new Date(host.dataRegistrazione).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Chiudi</Button>
            {!isEditMode && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Conferma Promozione
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HostForm;