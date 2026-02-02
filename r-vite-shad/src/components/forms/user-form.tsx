import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Utente } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil } from "lucide-react";
import { z } from "zod";

export const userSchema = z.object({
  nomeUser: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  cognome: z.string().min(2, "Il cognome deve contenere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  indirizzoUser: z
    .string()
    .min(5, "L'indirizzo deve contenere almeno 5 caratteri"),
});

export type UserFormValues = z.infer<typeof userSchema>;

const API_URL = import.meta.env.VITE_API_URL;

interface UserFormDialogProps {
  user?: Utente;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const UserFormDialog = ({ user, onSuccess, trigger }: UserFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nomeUser: user?.nomeUser || "",
      cognome: user?.cognome || "",
      email: user?.email || "",
      indirizzoUser: user?.indirizzoUser || "",
    },
  });

  // Reset dei campi quando cambia l'utente o si chiude il dialog
  useEffect(() => {
    if (open) {
      reset({
        nomeUser: user?.nomeUser || "",
        cognome: user?.cognome || "",
        email: user?.email || "",
        indirizzoUser: user?.indirizzoUser || "",
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: UserFormValues) => {
    setError(null);
    try {
      const url = isEditMode
        ? `${API_URL}/api/v1/users/${user.id}`
        : `${API_URL}/api/v1/users`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Payload pulito
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Errore nel salvataggio");
      }

      reset();
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isEditMode ? "outline" : "default"}
            size={isEditMode ? "sm" : "default"}
          >
            {isEditMode ? (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Modifica
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Nuovo Utente
              </>
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifica Utente" : "Nuovo Utente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Aggiorna le informazioni dell'utente selezionato."
              : "Inserisci i dettagli per registrare un nuovo utente."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeUser">Nome</Label>
              <Input
                id="nomeUser"
                {...register("nomeUser")}
                className={errors.nomeUser ? "border-destructive" : ""}
              />
              {errors.nomeUser && (
                <p className="text-xs text-destructive">
                  {errors.nomeUser.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cognome">Cognome</Label>
              <Input
                id="cognome"
                {...register("cognome")}
                className={errors.cognome ? "border-destructive" : ""}
              />
              {errors.cognome && (
                <p className="text-xs text-destructive">
                  {errors.cognome.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="indirizzoUser">Indirizzo</Label>
            <Input
              id="indirizzoUser"
              {...register("indirizzoUser")}
              className={errors.indirizzoUser ? "border-destructive" : ""}
            />
            {errors.indirizzoUser && (
              <p className="text-xs text-destructive">
                {errors.indirizzoUser.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? "Aggiorna" : "Crea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
