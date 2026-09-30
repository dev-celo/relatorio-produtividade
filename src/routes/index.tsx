import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Printer, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReportSheet } from "@/components/report/ReportSheet";
import { ActivityEditor } from "@/components/report/ActivityEditor";
import {
  emptyReport,
  loadStore,
  sampleReport,
  saveStore,
  todayISO,
  type Activity,
  type Report,
} from "@/lib/report";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relatório Diário de Produção | Base do ARMCO" },
      {
        name: "description",
        content:
          "Monte o relatório diário de produção com linha do tempo em Gantt, horas produtivas, pausas e aproveitamento da frente.",
      },
      { property: "og:title", content: "Relatório Diário de Produção | Base do ARMCO" },
      {
        property: "og:description",
        content:
          "Ferramenta editável para registrar atividades do dia, durações e aproveitamento da jornada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [report, setReport] = useState<Report>(() => emptyReport(todayISO()));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const store = loadStore();
    if (store) {
      const date = store.lastDate || todayISO();
      setReport(store.reports[date] ?? emptyReport(date));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const store = loadStore() ?? { reports: {}, lastDate: report.date };
    store.reports[report.date] = report;
    store.lastDate = report.date;
    saveStore(store);
  }, [report, hydrated]);

  const patch = (p: Partial<Report>) => {
    setReport((prev) => {
      if (p.date && p.date !== prev.date) {
        const store = loadStore();
        const existing = store?.reports[p.date];
        if (existing) return existing;
      }
      return { ...prev, ...p };
    });
  };

  const setActivities = (activities: Activity[]) => setReport((prev) => ({ ...prev, activities }));

  return (
    <main className="min-h-screen bg-muted/40 px-3 py-5">
      <div className="mx-auto w-full max-w-[1400px] space-y-4">
        <div className="no-print flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border bg-card p-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={report.company}
                onChange={(e) => patch({ company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="logo">Link do logo (URL da imagem)</Label>
              <Input
                id="logo"
                value={report.logoUrl}
                onChange={(e) => patch({ logoUrl: e.target.value })}
                placeholder="https://.../logo.png"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setReport(sampleReport())}>
              <Sparkles className="size-4" /> Exemplo
            </Button>
            <Button variant="outline" onClick={() => setReport(emptyReport(report.date))}>
              <RotateCcw className="size-4" /> Limpar dia
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="size-4" /> Imprimir / PDF
            </Button>
          </div>
        </div>

        <ReportSheet report={report} onChange={patch} />

        <div className="no-print">
          <ActivityEditor
            activities={report.activities}
            onChange={setActivities}
            shiftStart={report.shiftStart}
          />
        </div>
      </div>
    </main>
  );
}
