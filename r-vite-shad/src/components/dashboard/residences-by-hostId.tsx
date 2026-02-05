import type { Abitazione } from "@/types/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const API_URL = import.meta.env.VITE_API_URL;

const ResidencesByHostId = () => {
  const [hostId, setHostId] = useState<string>("");
  const [residences, setResidences] = useState<Abitazione[]>([]);

  const loadResidencesByHostId = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/abitazioni/hosts/${id}`);
      if (!res.ok) {
        setResidences([]);
        return;
      }
      const data = await res.json();
      setResidences(data);
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      setResidences([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHostId(val);

    if (val === "") {
      setResidences([]);
      return;
    }

    const numericId = parseInt(val, 10);
    if (!isNaN(numericId)) {
      loadResidencesByHostId(numericId);
    }
  };

  return (
    <Card className="w-full items-center border-none shadow-lg bg-linear-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      <CardContent className="">
          <CardTitle className="text-2xl">Ricerca Abitazionoe per ID Host</CardTitle>
        
            <Label htmlFor="idHost">
                idHost
            </Label>
            <Input
            id="idHost"
            type="number"
            className="border rounded px-3 py-2 w-full max-w-xs"
            value={hostId}
            onChange={handleInputChange}
            placeholder="Es: 123"
          />

        <CardDescription className="mt-6">
          <h3 className="font-semibold mb-2">Risultati:</h3>
          {residences && residences.length > 0 ? (
            <ul className="space-y-2">
              {residences.map((a) => (
                <li
                  key={a.id}
                  className="p-3 bg-gray-50 rounded shadow-sm border border-gray-200"
                >
                  <strong>{a.nomeAbitazione || "Nome non disponibile"}</strong>{" "}
                  <br />
                  <span className="text-sm text-gray-600">
                    {a.indirizzoAbitazione || "Indirizzo non presente"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              {hostId
                ? "Nessuna abitazione trovata per questo host."
                : "Inserisci un ID host."}
            </p>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ResidencesByHostId;
