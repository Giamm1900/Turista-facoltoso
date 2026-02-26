import type { Prenotazione } from "@/types/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface PrenotazioneContextI {
  prenotazioni: Prenotazione[] | null;
  addPrenotazione: (prenotazione: Prenotazione) => void;
  getPrenotazioneById: (id: Prenotazione["id"]) => Prenotazione | undefined;
  removePrenotazione: (id: Prenotazione["id"]) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;
const PrenotazioneContext = createContext<PrenotazioneContextI | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const usePrenotazione = (): PrenotazioneContextI => {
  const ctx = useContext(PrenotazioneContext);
  if (!ctx) {
    throw new Error("usePrenotazione deve essere usato dentro RentProvider");
  }
  return ctx;
};

const RentProvider = ({ children }: { children: ReactNode }) => {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[] | null>([]);

  const getPrenotazioneById = (id: Prenotazione["id"]) => {
    return prenotazioni?.find((prenotazione) => prenotazione.id === id);
  };

  const addPrenotazione = async (prenotazione: Prenotazione) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prenotazione),
      });
      if (!res.ok) throw new Error("Errore durante il salvataggio");
      const newPrenotazione:Prenotazione = await res.json();
      setPrenotazioni((prev) => [...(prev ?? []),newPrenotazione])
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const removePrenotazione = async(id: Prenotazione["id"]) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/prenotazioni/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      setPrenotazioni((prev) => prev?.filter((p) => p.id !== id) ?? []);
    } catch (err) {
        console.error("Error: ",err)
    }
  };

  useEffect(() => {
    const loadPrenotazione = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/prenotazioni`);
        if (!res.ok) {
          throw new Error("Errore Recupero Prenotazioni");
        }
        const data = await res.json();
        setPrenotazioni(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    loadPrenotazione();
  }, []);

  return (<PrenotazioneContext value={{prenotazioni,getPrenotazioneById,removePrenotazione,addPrenotazione}}>{children}</PrenotazioneContext>);
};

export default RentProvider;
