import { Clock, ClipboardList, Target, TriangleAlert, Calendar } from "lucide-react";
import {
  computeAxis,
  computeTotals,
  durationOf,
  formatDuration,
  labelFromMinutes,
  toMinutes,
  type Report,
} from "@/lib/report";
import { barClass, idleIndexes, kindIcon, swatchClass } from "./kinds";
import { AutoTextarea } from "./AutoTextarea";

type Props = {
  report: Report;
  onChange: (patch: Partial<Report>) => void;
};

export function ReportSheet({ report, onChange }: Props) {
  const totals = computeTotals(report);
  const axis = computeAxis(report);
  const idle = idleIndexes(report.activities);

  const pct = (minutes: number) => (minutes / axis.span) * 100;

  return (
    <div className="print-sheet mx-auto w-full max-w-[1400px] rounded-xl bg-background p-4 shadow-sm ring-1 ring-border">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-3 rounded-lg bg-brand px-6 py-4 text-brand-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {report.logoUrl ? (
            <img
              src={report.logoUrl}
              alt={report.company}
              className="h-14 w-auto max-w-[140px] rounded bg-brand-foreground/95 object-contain p-1"
            />
          ) : null}
          <div className="min-w-0">
            <input
              value={report.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full rounded-sm border border-transparent bg-transparent font-display text-2xl font-bold tracking-tight outline-none hover:border-brand-foreground/40 focus:border-brand-foreground/70 sm:text-3xl"
            />
            <input
              value={report.subtitle}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              className="w-full rounded-sm border border-transparent bg-transparent text-sm font-bold tracking-wide text-gold outline-none hover:border-brand-foreground/40 focus:border-brand-foreground/70"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-brand-foreground/40 px-4 py-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide opacity-80">Data:</p>
            <input
              type="date"
              value={report.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="rounded-sm border border-transparent bg-transparent text-lg font-bold outline-none hover:border-brand-foreground/40 focus:border-brand-foreground/70"
            />
          </div>
          <Calendar className="size-7 shrink-0 opacity-90" />
        </div>
      </header>

      {/* Atividade principal + situação */}
      <div className="mt-2 grid gap-2 rounded-lg md:grid-cols-2">
        <div className="flex gap-3 rounded-lg bg-brand-soft px-5 py-4">
          <Target className="mt-1 size-7 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-brand">ATIVIDADE PRINCIPAL:</p>
            <input
              value={report.mainActivity}
              onChange={(e) => onChange({ mainActivity: e.target.value })}
              className="w-full rounded-sm border border-transparent bg-transparent text-[15px] uppercase text-foreground outline-none hover:border-border focus:border-ring"
            />
            <input
              value={report.mainActivityNote}
              onChange={(e) => onChange({ mainActivityNote: e.target.value })}
              className="w-full rounded-sm border border-transparent bg-transparent text-[15px] uppercase text-foreground outline-none hover:border-border focus:border-ring"
            />
          </div>
        </div>
        <div className="flex gap-3 rounded-lg bg-brand-soft px-5 py-4">
          <TriangleAlert className="mt-1 size-7 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-brand">SITUAÇÃO:</p>
            <AutoTextarea
              value={report.situation}
              onChange={(e) => onChange({ situation: e.target.value })}
              placeholder="Descreva a situação do dia..."
              className="text-[15px] leading-snug"
            />
          </div>
        </div>
      </div>

      {/* Linha do tempo */}
      <section className="mt-2 rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Clock className="size-5" />
          </span>
          <h2 className="font-display text-lg font-bold tracking-wide text-brand">
            LINHA DO TEMPO - ATIVIDADES DO DIA
          </h2>
        </div>

        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[300px_1fr] gap-0">
              <div className="rounded-t-md bg-brand px-3 py-1.5 text-xs font-bold tracking-wide text-brand-foreground">
                ATIVIDADES RELACIONADAS
              </div>
              <div className="relative h-7">
                {axis.hours.map((h) => (
                  <span
                    key={h}
                    className="absolute -translate-x-1/2 text-xs font-medium text-muted-foreground"
                    style={{ left: `${pct(h - axis.axisStart)}%` }}
                  >
                    {labelFromMinutes(h)}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[300px_1fr] border-t border-brand/60">
              {/* Lista */}
              <ul className="divide-y divide-border">
                {report.activities.map((a) => {
                  const Icon = kindIcon(a.kind);
                  return (
                    <li key={a.id} className="flex h-16 items-center gap-2 px-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-brand">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-[11px] font-bold uppercase text-brand">
                          {a.name}
                        </p>
                        {a.subtitle ? (
                          <p className={`truncate text-[10px] font-bold ${swatchClass(a, idle[a.id])}`}>
                            {a.subtitle}
                          </p>
                        ) : null}
                        <p className="text-[10px] text-muted-foreground">
                          {a.start} às {a.end} · {formatDuration(durationOf(a))}
                        </p>
                      </div>
                    </li>
                  );
                })}
                {report.activities.length === 0 ? (
                  <li className="flex h-16 items-center px-2 text-xs text-muted-foreground">
                    Nenhuma atividade lançada.
                  </li>
                ) : null}
              </ul>

              {/* Gráfico */}
              <div className="relative">
                {axis.hours.map((h) => (
                  <span
                    key={h}
                    className="absolute top-0 bottom-0 border-l border-dashed border-border"
                    style={{ left: `${pct(h - axis.axisStart)}%` }}
                  />
                ))}
                {report.activities.map((a) => {
                  const left = pct(toMinutes(a.start) - axis.axisStart);
                  const width = Math.max(0.4, pct(durationOf(a)));
                  return (
                    <div key={a.id} className="relative h-16">
                      <div
                        className="absolute top-3 flex justify-between text-[10px] font-medium text-foreground"
                        style={{ left: `${left}%`, width: `${width}%`, minWidth: 68 }}
                      >
                        <span>{a.start}</span>
                        <span>{a.end}</span>
                      </div>
                      <div
                        className={`absolute top-8 h-4 rounded-sm ${barClass(a, idle[a.id])}`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        title={`${a.name} · ${formatDuration(durationOf(a))}`}
                      />
                    </div>
                  );
                })}
                {report.activities.length === 0 ? <div className="h-16" /> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé: resumo, tempos e legenda */}
      <div className="mt-2 grid gap-2 lg:grid-cols-3">
        <div className="flex gap-3 rounded-lg border border-border p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <ClipboardList className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-bold tracking-wide text-brand">
              RESUMO DO IMPACTO
            </h3>
            <AutoTextarea
              value={report.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="Resumo do impacto do dia..."
              className="mt-1 text-[13px] leading-snug"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h3 className="font-display text-sm font-bold tracking-wide text-brand">TEMPOS DO DIA</h3>
          <table className="mt-2 w-full text-[13px]">
            <tbody className="divide-y divide-border">
              <Row label="Tempo total do turno" value={formatDuration(totals.shiftTotal)} />
              <Row label="Jornada de referência" value={formatDuration(totals.reference)} />
              <Row label="Tempo produtivo" value={formatDuration(totals.productive)} />
              <Row label="Almoço" value={formatDuration(totals.lunch)} />
              <Row label="Tempo indisponível" value={formatDuration(totals.unavailable)} />
              <Row label="Aproveitamento da frente" value={`${totals.utilization}%`} strong />
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border p-4">
          <h3 className="font-display text-sm font-bold tracking-wide text-brand">LEGENDA</h3>
          <ul className="mt-2 space-y-1.5">
            {report.activities.map((a) => {
              const Icon = kindIcon(a.kind);
              return (
                <li key={a.id} className="flex items-center gap-2 text-[12px]">
                  <Icon className="size-3.5 shrink-0 text-brand" />
                  <span className={`size-3 shrink-0 rounded-[3px] ${barClass(a, idle[a.id])}`} />
                  <span className="truncate uppercase">
                    {a.name} {a.subtitle}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr>
      <td className="py-1.5">{label}</td>
      <td className={`py-1.5 text-right ${strong ? "font-bold text-brand" : "font-semibold"}`}>
        {value}
      </td>
    </tr>
  );
}
