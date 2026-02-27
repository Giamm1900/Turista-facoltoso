/**
 * TophostsCard.tsx — Modern redesign
 * Layout: podium hero per i top 3 + lista compatta per gli altri.
 * Stile: numeri grandi, gerarchia visiva immediata, zero card ripetute.
 */

import { Trophy, Medal, Inbox } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────
interface TopHost {
  nome: string;
  numero: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
      <Inbox className="h-8 w-8 opacity-30" />
      <p className="text-sm">Nessun dato disponibile</p>
    </div>
  );
}

// Colori e icone per il podio
const PODIUM = [
  {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    avatar: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    number: "text-amber-500",
    icon: <Trophy className="h-3.5 w-3.5 text-amber-500" />,
    label: "1°",
  },
  {
    bg: "bg-slate-50 dark:bg-slate-800/30",
    border: "border-slate-200 dark:border-slate-700",
    avatar: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    number: "text-slate-500",
    icon: <Medal className="h-3.5 w-3.5 text-slate-400" />,
    label: "2°",
  },
  {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-800",
    avatar: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    number: "text-orange-500",
    icon: <Medal className="h-3.5 w-3.5 text-orange-400" />,
    label: "3°",
  },
];

// ─── Podium card (top 3) ──────────────────────────────────────────────────────
function PodiumCard({ host, rank }: { host: TopHost; rank: number }) {
  const style = PODIUM[rank - 1];

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border ${style.bg} ${style.border} transition-transform hover:-translate-y-0.5 duration-200`}
    >
      {/* Rank badge */}
      <span
        className={`absolute top-2 right-2 text-[10px] font-black tabular-nums ${style.number}`}
      >
        {style.label}
      </span>

      {/* Icon */}
      <div className="mt-1">{style.icon}</div>

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarFallback className={`text-sm font-bold ${style.avatar}`}>
          {host.nome.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <p className="text-xs font-semibold text-center truncate w-full leading-tight px-1">
        {host.nome}
      </p>

      {/* Count */}
      <div className="text-center">
        <p className={`text-xl font-black tabular-nums leading-none ${style.number}`}>
          {host.numero.toLocaleString("it-IT")}
        </p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">
          pren.
        </p>
      </div>
    </div>
  );
}

// ─── List row (4° posto in poi) ───────────────────────────────────────────────
function HostListRow({ host, rank }: { host: TopHost; rank: number }) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <span className="w-5 text-center text-[11px] font-bold text-muted-foreground/50 tabular-nums shrink-0">
        {rank}
      </span>
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className="text-[11px] font-bold bg-muted text-muted-foreground">
          {host.nome.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="flex-1 text-sm font-medium truncate">{host.nome}</span>
      <div className="text-right shrink-0">
        <span className="text-sm font-black tabular-nums">
          {host.numero.toLocaleString("it-IT")}
        </span>
        <span className="text-[10px] text-muted-foreground ml-1">pren.</span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface TophostsCardProps {
  topHosts: TopHost[];
}

const TophostsCard = ({ topHosts }: TophostsCardProps) => {
  if (!topHosts?.length) return <EmptyState />;

  const sorted = [...topHosts].sort((a, b) => b.numero - a.numero);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Podio del mese
          </span>
        </div>
        <Badge variant="secondary" className="text-[10px] px-2 py-0 h-4 font-medium">
          {sorted.length} host
        </Badge>
      </div>

      {/* Podium — 3 card affiancate */}
      <div className="grid grid-cols-3 gap-2">
        {podium.map((host, i) => (
          <PodiumCard key={host.nome} host={host} rank={i + 1} />
        ))}
      </div>

      {/* Rest — compact list */}
      {rest.length > 0 && (
        <>
          <Separator />
          <div className="space-y-0">
            {rest.map((host, i) => (
              <HostListRow key={host.nome} host={host} rank={i + 4} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TophostsCard;