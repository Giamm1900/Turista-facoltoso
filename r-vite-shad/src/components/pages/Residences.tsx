import type { Abitazione } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Trash, MapPin, Pencil, ChartColumn } from "lucide-react";
import ResidenceForm from "../forms/residence-form";

const API_URL = import.meta.env.VITE_API_URL;

const Residences = () => {
  const [residences, setResidences] = useState<Abitazione[] | null>(null);
  const [mediaPosti, setMediaPosti] = useState<number>(0);

  useEffect(() => {
    loadResidences();
    loadMediaPosti();
  }, []);

  const loadResidences = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/abitazioni`);
      if (!res.ok) throw new Error("Errore recupero abitazioni");
      const data = await res.json();
      setResidences(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMediaPosti = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/abitazioni/postiletto/media`);
      if (!res.ok) throw new Error("Errore recupero media posti letto");
      const data = await res.json();
      setMediaPosti(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteResidence = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa abitazione?")) return;

    try {
      const res = await fetch(`${API_URL}/api/v1/abitazioni/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");

      setResidences((prev) => (prev ? prev.filter((r) => r.id !== id) : null));
    } catch (error) {
      console.error(error);
      alert("Impossibile eliminare l'abitazione.");
    }
  };

  if (!residences) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Elenco Abitazioni</CardTitle>
            <CardDescription>
              Totale strutture registrate: {residences.length}
            </CardDescription>
            <ChartColumn />
            media posti letto : {mediaPosti}
          </div>
          <ResidenceForm onSuccess={loadResidences} />
        </CardHeader>
        <CardContent>
          {residences.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Nessuna abitazione trovata. Inizia creandone una nuova.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Indirizzo</TableHead>
                    <TableHead>Prezzo</TableHead>
                    <TableHead>Locali/Posti</TableHead>
                    <TableHead>Host ID</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {residences.map((residence) => (
                    <TableRow key={residence.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {residence.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {residence.nomeAbitazione}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {residence.indirizzoAbitazione || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {residence.prezzoPerNotte.toFixed(2)}€
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                          NLocali: {residence.nlocali} / PostiLetto:{" "}
                          {residence.npostiLetto}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-green-200 px-2 py-1 rounded-full">
                          {residence.idHost}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <ResidenceForm
                          residence={residence}
                          onSuccess={loadResidences}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteResidence(residence.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Residences;
