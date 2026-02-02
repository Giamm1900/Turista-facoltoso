import type { Abitazione } from "@/types/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Residences = () => {
  const [residences, setResidences] = useState<Abitazione[] | null>(null);

  useEffect(() => {
    const loadResidences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/abitazioni`);
        if (!res) {
          throw new Error("errore recupero abitazioni");
        }
        const data = await res.json();
        setResidences(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadResidences();
  }, []);

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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tutte le Prenotazioni</CardTitle>
          <CardDescription>
            Totale Abitazioni: {residences.length}
          </CardDescription>

          {/* Barra di ricerca
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per ID, utente, data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div> */}
        </CardHeader>

        <CardContent>
          {residences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessuna prenotazione trovata
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Indirizzo</TableHead>
                    <TableHead>Prezzo Per Notte</TableHead>
                    <TableHead>Disponibilità inizio</TableHead>
                    <TableHead>Disponibilità fine</TableHead>
                    <TableHead>Id Host</TableHead>
                    <TableHead>Numero Locali</TableHead> 
                    <TableHead>Numero Posti Letto</TableHead>
                    <TableHead>Elimina</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {residences.map((residence) => (
                    <TableRow key={residence.id}>
                      <TableCell className="font-medium">
                        #{residence.id}
                      </TableCell>
                      <TableCell>{residence.nomeAbitazione}</TableCell>
                      <TableCell>{residence.indirizzoAbitazione || "N/A"}</TableCell>
                      <TableCell>{residence.prezzoPerNotte.toFixed(2)}€</TableCell>
                      <TableCell>
                        {residence.disponibilitaInizio 
                          ? new Date(residence.disponibilitaInizio).toLocaleString('it-IT')
                          : "N/A"}
                      </TableCell>
                      <TableCell>{residence.disponibilitaFine || "N/A"}</TableCell>
                      <TableCell>{residence.idHost || "N/A"}</TableCell>
                      <TableCell>{residence.nlocali || "N/A"}</TableCell>
                      <TableCell>{residence.npostiLetto || "N/A"}</TableCell>
                      <Button variant="destructive">
                        <TableCell>
                          <Trash />
                        </TableCell>
                      </Button>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Residences;
