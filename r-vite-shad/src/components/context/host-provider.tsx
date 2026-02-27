import type { Host } from "@/types/types";
import { createContext, useContext, useState, type ReactNode } from "react";

interface HostContextType {
  hosts: Host[] | null;
  getAll: () => Host[] | undefined;
  getById: (id: Host["id"]) => Host | null;
  addHost: (host: Host) => Promise<void>;
  removeById: (id: Host["id"]) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

const HostContext = createContext<HostContextType | null>(null);

const useHost = (): HostContextType => {
  const ctx = useContext(HostContext);
  if (!ctx) {
    throw new Error(
      "Error: useHost può essere utilizzato solo all'interno di HostProvider",
    );
  }
  return ctx;
};

const HostProvider = ({ children }: { children: ReactNode }) => {
  const [hosts, setHosts] = useState<Host[] | null>([]);

  const getAll = () => {
    return hosts || undefined;
  };

  const getById = (id: Host["id"]) => {
    if (id === 0 || id === null) {
      return null;
    }
    return hosts?.find((h) => h.id === id);
  };

  const addHost = async (host: Host) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/hosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(host),
      });

      if (!res.ok) throw new Error("Errore durante la creazione dell'host");
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  return <div>HostProvider</div>;
};

export default HostProvider;
