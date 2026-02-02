import type { Host } from "@/types/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const API_URL = import.meta.env.VITE_API_URL;

const Hosts = () => {
  const [hosts, setHosts] = useState<Host[] | null>(null);

  useEffect(() => {
    const loadHosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/hosts`);
        if (!res) {
          throw new Error("errore recupero hosts");
        }
        const data = await res.json();
        setHosts(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadHosts();
  }, []);

    if (!hosts) {
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
          <CardTitle>Tutti gli Hosts</CardTitle>
          <CardDescription>
            Totale Hosts: {hosts.length}
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
          {hosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessuna prenotazione trovata
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>ID Utente</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cognome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Indirizzo</TableHead>
                    <TableHead>Data Registrazione</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {hosts.map((host) => (
                    <TableRow key={host.id}>
                      <TableCell className="font-medium">
                        #{host.id}
                      </TableCell>
                      <TableCell>{host.idUtente}</TableCell>
                      <TableCell>{host.nomeUser}</TableCell>
                      <TableCell>{host.cognome}</TableCell>
                      <TableCell>{host.email}</TableCell>
                      <TableCell>{host.indirizzoUser}</TableCell>
                      <TableCell>
                        {host.dataRegistrazione 
                          ? new Date(host.dataRegistrazione).toLocaleString('it-IT')
                          : "N/A"}
                      </TableCell>
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
}

export default Hosts