import type { Host } from "@/types/types";
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
import { Trash, Users, Info } from "lucide-react";
import { Button } from "../ui/button";
import HostForm from "../forms/host-form"; // Assicurati che il percorso sia corretto

const API_URL = import.meta.env.VITE_API_URL;

const Hosts = () => {
  const [hosts, setHosts] = useState<Host[] | null>(null);

  const loadHosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/hosts`);
      if (!res.ok) throw new Error("Errore recupero hosts");
      const data = await res.json();
      setHosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHosts();
  }, []);

  const deleteHost = async (id: number) => {
    if (!confirm("Sei sicuro di voler rimuovere questo Host? L'utente non verrà eliminato.")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/hosts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore eliminazione");
      setHosts((prev) => (prev ? prev.filter((h) => h.id !== id) : null));
    } catch (error) {
      console.error(error);
    }
  };

  if (!hosts) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con Titolo e Bottone Aggiungi */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestione Host</h2>
          <p className="text-muted-foreground">
            Visualizza e gestisci gli utenti che hanno privilegi di Host.
          </p>
        </div>
        <HostForm onSuccess={loadHosts} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Elenco Host Attivi
          </CardTitle>
          <CardDescription>Totale Host registrati: {hosts.length}</CardDescription>
        </CardHeader>

        <CardContent>
          {hosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Nessun host trovato. Promuovi un utente per iniziare.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID Host</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Indirizzo</TableHead>
                    <TableHead>Data Reg.</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {hosts.map((host) => (
                    <TableRow key={host.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{host.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{host.nomeUser} {host.cognome}</span>
                          <span className="text-xs text-muted-foreground italic">UID: #{host.idUtente}</span>
                        </div>
                      </TableCell>
                      <TableCell>{host.email}</TableCell>
                      <TableCell className="max-w-50 truncate text-sm">
                        {host.indirizzoUser || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {host.dataRegistrazione
                          ? new Date(host.dataRegistrazione).toLocaleDateString("it-IT")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* Info/Edit Button */}
                        <HostForm 
                          host={host} 
                          onSuccess={loadHosts} 
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          } 
                        />
                        {/* Delete Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteHost(host.id)}
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

export default Hosts;
