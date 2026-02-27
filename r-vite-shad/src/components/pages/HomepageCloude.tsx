/**
 * Homepage.tsx — Back Office Dashboard
 *
 * Refactoring highlights:
 * ─ Bento-grid layout responsive 1 → 2 → 4 col (KPI) + 1 → 3 col (cards)
 * ─ KPI Stats row derivata da usePrenotazione (totale, ultimi 30 gg, prev 30 gg, media)
 * ─ Header sezione con data formattata elegantemente
 * ─ <KpiCard> con Skeleton loader integrato (basta passare loading={true})
 * ─ <SectionCard> riutilizzabile per tutte le sezioni child
 * ─ Zero ridondanze, logica derivata con useMemo
 */

import { useMemo } from "react";
import {
  Award,
  Trophy,
  Home,
  Search,
  CalendarDays,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { usePrenotazione } from "../context/rent-provider";

// Child components (unchanged — see improvement notes at the bottom of this file)
import AllSuperHost from "../dashboard/all-super-host";
import MostPopularAbitazione from "../dashboard/most-popular-abitazione";
import ResidencesByHostId from "../dashboard/residences-by-hostId";
import TophostsCard from "../dashboard/Top-hosts-card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: number | string;
  /** Percentage change vs previous period. Pass null when unavailable. */
  delta?: number | null;
  icon: React.ReactNode;
  /** Tailwind bg + text classes for the icon pill */
  accent: string;
  loading?: boolean;
}

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconAccent: string;
  children: React.ReactNode;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateIT(date: Date): string {
  const raw = date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, delta, icon, accent, loading = false }: KpiCardProps) {
  if (loading) {
    return (
      <Card className="border border-border/60 shadow-none">
        <CardContent className="pt-5 pb-4 px-5 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = delta !== null && delta !== undefined && delta > 0;
  const isNegative = delta !== null && delta !== undefined && delta < 0;
  const hasNoData = delta === null || delta === undefined;

  const DeltaIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const deltaColor = isPositive
    ? "text-emerald-600"
    : isNegative
    ? "text-red-500"
    : "text-muted-foreground";

  return (
    <Card className="border border-border/60 shadow-none hover:shadow-sm transition-shadow duration-200">
      <CardContent className="pt-5 pb-4 px-5">
        {/* Label + icon */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <span className={`p-1.5 rounded-md ${accent}`}>{icon}</span>
        </div>

        {/* Value */}
        <p className="text-3xl font-bold tracking-tight text-foreground leading-none">
          {value}
        </p>

        {/* Delta */}
        <div className="flex items-center gap-1 mt-2.5 min-h-4.5">
          {hasNoData ? (
            <span className="text-[11px] text-muted-foreground">Nessun confronto disponibile</span>
          ) : (
            <>
              <DeltaIcon className={`w-3 h-3 ${deltaColor}`} />
              <span className={`text-[11px] font-medium ${deltaColor}`}>
                {isPositive && "+"}
                {delta}% vs 30&nbsp;gg precedenti
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  icon,
  iconAccent,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <Card className={`border border-border/60 shadow-none flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-none">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg mt-0.5 flex-none ${iconAccent}`}>{icon}</div>
          <div>
            <CardTitle className="text-sm font-semibold leading-tight">{title}</CardTitle>
            <CardDescription className="text-xs mt-0.5 leading-snug">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 flex-1">{children}</CardContent>
    </Card>
  );
}

// ─── DashboardHeader ──────────────────────────────────────────────────────────

function DashboardHeader({ date }: { date: string }) {
  return (
    <div className="grid grid-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 flex-none" />
          <span className="text-sm">{date}</span>
        </div>
      </div>

      <Badge
        variant="secondary"
        className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
      >
        <Activity className="h-3 w-3" />
        Dati in tempo reale
      </Badge>
    </div>
  );
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

const Homepage = () => {
  const { prenotazioni } = usePrenotazione();

  // ── Derived KPIs ────────────────────────────────────────────────────────────
  const kpi = useMemo(() => {
    const total = prenotazioni?.length ?? 0;
    const now = new Date();
    const t30 = daysAgo(30);
    const t60 = daysAgo(60);

    // Resolve the date field regardless of which key your API uses
    const getDate = (p: (typeof prenotazioni)[number]) =>
      new Date(p.dataPrenotazione ?? p.created_at ?? p.date ?? "");

    const last30 =
      prenotazioni?.filter((p) => {
        const d = getDate(p);
        return d >= t30 && d <= now;
      }).length ?? 0;

    const prev30 =
      prenotazioni?.filter((p) => {
        const d = getDate(p);
        return d >= t60 && d < t30;
      }).length ?? 0;

    const delta30 = percentChange(last30, prev30);

    // Rough monthly average: total / number of months since oldest booking
    const oldest = prenotazioni?.reduce((min, p) => {
      const d = getDate(p).getTime();
      return d < min ? d : min;
    }, Date.now());
    const months = Math.max(1, Math.ceil((Date.now() - (oldest ?? Date.now())) / (1000 * 60 * 60 * 24 * 30)));
    const avgMonthly = total > 0 ? Math.round(total / months) : 0;

    return { total, last30, prev30, delta30, avgMonthly };
  }, [prenotazioni]);

  const today = formatDateIT(new Date());

  // ── KPI config array ────────────────────────────────────────────────────────
  const kpiCards: KpiCardProps[] = [
    {
      label: "Totale Prenotazioni",
      value: kpi.total.toLocaleString("it-IT"),
      delta: null,
      icon: <BookOpen className="h-4 w-4" />,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Ultimi 30 Giorni",
      value: kpi.last30.toLocaleString("it-IT"),
      delta: kpi.delta30,
      icon: <TrendingUp className="h-4 w-4" />,
      accent: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "30 Giorni Precedenti",
      value: kpi.prev30.toLocaleString("it-IT"),
      delta: null,
      icon: <ArrowUpRight className="h-4 w-4" />,
      accent: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Media Mensile",
      value: kpi.avgMonthly.toLocaleString("it-IT"),
      delta: null,
      icon: <Activity className="h-4 w-4" />,
      accent: "bg-violet-500/10 text-violet-600",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-screen-2xl">

        {/* ── Page header ── */}
        <DashboardHeader date={today} />

        <Separator />

        {/* ── KPI row: 1 col → 2 col → 4 col ── */}
        <section aria-label="KPI principali">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpiCards.map((card) => (
              <KpiCard key={card.label} {...card} />
            ))}
          </div>
        </section>

        {/* ── Bento grid: 1 col → 3 col ── */}
        <section aria-label="Sezioni principali" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Ricerca per Host ID"
            description="Abitazioni associate a un host specifico"
            icon={<Search className="h-4 w-4" />}
            iconAccent="bg-primary/10 text-primary"
          >
            <ResidencesByHostId />
          </SectionCard>

          <SectionCard
            title="Super Host"
            description="Host con oltre 100 prenotazioni totali"
            icon={<Award className="h-4 w-4" />}
            iconAccent="bg-amber-500/10 text-amber-600"
          >
            <AllSuperHost />
          </SectionCard>

          <SectionCard
          className="w-auto"
            title="Top Host del Mese"
            description="Più prenotazioni negli ultimi 30 giorni"
            icon={<Trophy className="h-4 w-4" />}
            iconAccent="bg-emerald-500/10 text-emerald-600"
          >
            <TophostsCard />
          </SectionCard>
        </section>

        {/* ── Full-width bottom row ── */}
        <section aria-label="Abitazioni più prenotate">
          <SectionCard
            title="Abitazioni Più Prenotate"
            description="Le strutture più richieste nell'ultimo mese"
            icon={<Home className="h-4 w-4" />}
            iconAccent="bg-orange-500/10 text-orange-600"
          >
            <MostPopularAbitazione />
          </SectionCard>
        </section>

      </main>
    </div>
  );
};

export default Homepage;

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * SUGGERIMENTI PER I COMPONENTI FIGLI
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. AllSuperHost / TophostsCard / MostPopularAbitazione
 *    ─ Aggiungere un prop `isLoading?: boolean` e rendere uno <Skeleton /> list
 *      al suo interno mentre i dati vengono caricati dal backend.
 *    ─ Esempio pattern:
 *        if (isLoading) return <SkeletonList rows={5} />;
 *        if (!data?.length) return <EmptyState message="Nessun host trovato" />;
 *        return <ul>…</ul>;
 *
 * 2. ResidencesByHostId
 *    ─ Estrarre il campo <Input> in un componente <SearchInput> con debounce
 *      (300ms) per ridurre le chiamate API durante la digitazione.
 *    ─ Gestire lo stato "not found" con un empty state esplicito invece di
 *      una lista vuota silenziosa.
 *
 * 3. EmptyState component (da creare una volta sola e riusare ovunque):
 *
 *    function EmptyState({ message }: { message: string }) {
 *      return (
 *        <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
 *          <Inbox className="h-8 w-8 opacity-40" />
 *          <p className="text-sm">{message}</p>
 *        </div>
 *      );
 *    }
 *
 * 4. SkeletonList helper:
 *
 *    function SkeletonList({ rows = 4 }: { rows?: number }) {
 *      return (
 *        <div className="space-y-2.5">
 *          {Array.from({ length: rows }).map((_, i) => (
 *            <Skeleton key={i} className="h-8 w-full rounded-md" />
 *          ))}
 *        </div>
 *      );
 *    }
 *
 * 5. usePrenotazione — se il context non espone già `isLoading` ed `error`,
 *    aggiungerli è prioritario per guidare lo stato UI dell'intera dashboard.
 *    Esempio interface:
 *
 *    interface PrenotazioneContext {
 *      prenotazioni: Prenotazione[];
 *      isLoading: boolean;
 *      error: string | null;
 *      refetch: () => void;
 *    }
 * ─────────────────────────────────────────────────────────────────────────────
 */
