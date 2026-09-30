export type ActivityKind = "produtiva" | "improdutiva" | "almoco";

export type Activity = {
  id: string;
  name: string;
  subtitle: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  kind: ActivityKind;
};

export type Report = {
  company: string;
  logoUrl: string;
  title: string;
  subtitle: string;
  date: string; // yyyy-mm-dd
  mainActivity: string;
  mainActivityNote: string;
  situation: string;
  summary: string;
  shiftStart: string;
  activities: Activity[];
};

export const KIND_LABEL: Record<ActivityKind, string> = {
  produtiva: "Produtiva",
  improdutiva: "Improdutiva",
  almoco: "Almoço",
};

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map((n) => Number.parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
};

export const durationOf = (a: Activity): number =>
  Math.max(0, toMinutes(a.end) - toMinutes(a.start));

export const formatDuration = (minutes: number): string => {
  const safe = Math.max(0, Math.round(minutes));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}h${String(m).padStart(2, "0")}min`;
};

export const formatDateBR = (iso: string): string => {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};

/** Jornada de referência: seg-qui 9h, sex 8h, fim de semana 9h. */
export const referenceMinutes = (iso: string): number => {
  const [y, m, d] = iso.split("-").map((n) => Number.parseInt(n, 10));
  if (!y || !m || !d) return 540;
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day === 5 ? 480 : 540;
};

export type Totals = {
  shiftTotal: number;
  productive: number;
  lunch: number;
  unavailable: number;
  reference: number;
  utilization: number;
};

export const computeTotals = (report: Report): Totals => {
  const acts = report.activities;
  const reference = referenceMinutes(report.date);
  const sumBy = (kind: ActivityKind) =>
    acts.filter((a) => a.kind === kind).reduce((s, a) => s + durationOf(a), 0);

  const starts = acts.map((a) => toMinutes(a.start));
  const ends = acts.map((a) => toMinutes(a.end));
  const shiftTotal = acts.length ? Math.max(...ends) - Math.min(...starts) : 0;

  const productive = sumBy("produtiva");
  return {
    shiftTotal: Math.max(0, shiftTotal),
    productive,
    lunch: sumBy("almoco"),
    unavailable: sumBy("improdutiva"),
    reference,
    utilization: reference > 0 ? Math.round((productive / reference) * 100) : 0,
  };
};

/** Eixo do gráfico: barra cheia = jornada de referência. */
export const computeAxis = (report: Report) => {
  const acts = report.activities;
  const reference = referenceMinutes(report.date);
  const startBase = acts.length
    ? Math.min(toMinutes(report.shiftStart), ...acts.map((a) => toMinutes(a.start)))
    : toMinutes(report.shiftStart);
  const axisStart = Math.floor(startBase / 60) * 60;
  const lastEnd = acts.length ? Math.max(...acts.map((a) => toMinutes(a.end))) : axisStart;
  const spanNeeded = Math.max(reference, Math.ceil((lastEnd - axisStart) / 60) * 60);
  const axisEnd = axisStart + spanNeeded;
  const hours: number[] = [];
  for (let t = axisStart; t <= axisEnd; t += 60) hours.push(t);
  return { axisStart, axisEnd, span: axisEnd - axisStart, hours };
};

export const labelFromMinutes = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const newId = () => Math.random().toString(36).slice(2, 10);

export const todayISO = (): string => {
  const now = new Date();
  const off = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - off).toISOString().slice(0, 10);
};

export const emptyReport = (date: string): Report => ({
  company: "SOLUM",
  logoUrl: "",
  title: "RELATÓRIO DIÁRIO DE PRODUÇÃO",
  subtitle: "BASE DO ARMCO – BASE 2",
  date,
  mainActivity: "REGULARIZAÇÃO DA ESCAVAÇÃO DA BASE",
  mainActivityNote: "(ATIVIDADE PRINCIPAL - SOLUM)",
  situation: "",
  summary: "",
  shiftStart: "07:00",
  activities: [],
});

export const sampleReport = (): Report => ({
  ...emptyReport("2026-08-04"),
  situation:
    "A execução da Base 2 do ARMCO permaneceu majoritariamente restringida devido às atividades operacionais do túnel, com janela operacional limitada.",
  summary:
    "Das 07:00 às 16:40, a execução da Base 2 do ARMCO ficou majoritariamente restringida devido às atividades operacionais do túnel (desmonte, medição de gás, limpeza e desmonte geral), sendo possível avançar apenas em janelas operacionais limitadas.",
  activities: [
    { id: newId(), name: "DESMONTE", subtitle: "", start: "07:00", end: "07:30", kind: "improdutiva" },
    { id: newId(), name: "MEDIÇÃO DE GÁS", subtitle: "", start: "07:30", end: "08:00", kind: "improdutiva" },
    {
      id: newId(),
      name: "REGULARIZAÇÃO PARA CONCRETO MAGRO",
      subtitle: "(ATIVIDADE PRINCIPAL - SOLUM)",
      start: "08:00",
      end: "08:14",
      kind: "produtiva",
    },
    {
      id: newId(),
      name: "LIMPEZA",
      subtitle: "(EQUIPE SOLUM AGUARDANDO)",
      start: "08:14",
      end: "10:39",
      kind: "improdutiva",
    },
    {
      id: newId(),
      name: "EXECUÇÃO DO CONCRETO MAGRO",
      subtitle: "(ATIVIDADE PRINCIPAL - SOLUM)",
      start: "10:39",
      end: "11:58",
      kind: "produtiva",
    },
    {
      id: newId(),
      name: "DESMONTE GERAL",
      subtitle: "(OPEN PIT)",
      start: "11:58",
      end: "14:00",
      kind: "improdutiva",
    },
    {
      id: newId(),
      name: "REGULARIZAÇÃO DA ESCAVAÇÃO DA BASE",
      subtitle: "(ATIVIDADE PRINCIPAL - SOLUM)",
      start: "14:00",
      end: "16:40",
      kind: "produtiva",
    },
  ],
});

const STORE_KEY = "rdp:reports:v1";

type Store = { reports: Record<string, Report>; lastDate: string };

export const loadStore = (): Store | null => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Store;
    if (!parsed?.reports) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveStore = (store: Store) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota errors */
  }
};
