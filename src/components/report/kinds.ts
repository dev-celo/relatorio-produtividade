import { Tractor, Wrench, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Activity, ActivityKind } from "@/lib/report";

const IDLE_COLORS = ["bg-bar-idle-1", "bg-bar-idle-2", "bg-bar-idle-3"];
const IDLE_SWATCH = ["text-bar-idle-1", "text-bar-idle-2", "text-bar-idle-3"];

export const kindIcon = (kind: ActivityKind): LucideIcon =>
  kind === "produtiva" ? Tractor : kind === "almoco" ? UtensilsCrossed : Wrench;

/** Cor automática pelo tipo (improdutivas alternam tons para leitura no gráfico). */
export const barClass = (activity: Activity, idleIndex: number): string => {
  if (activity.kind === "produtiva") return "bg-bar-prod";
  if (activity.kind === "almoco") return "bg-bar-lunch";
  return IDLE_COLORS[idleIndex % IDLE_COLORS.length] ?? IDLE_COLORS[0]!;
};

export const swatchClass = (activity: Activity, idleIndex: number): string => {
  if (activity.kind === "produtiva") return "text-bar-prod";
  if (activity.kind === "almoco") return "text-bar-lunch";
  return IDLE_SWATCH[idleIndex % IDLE_SWATCH.length] ?? IDLE_SWATCH[0]!;
};

/** Índice da atividade entre as improdutivas, para variar o tom. */
export const idleIndexes = (activities: Activity[]): Record<string, number> => {
  let i = 0;
  const map: Record<string, number> = {};
  for (const a of activities) {
    map[a.id] = a.kind === "improdutiva" ? i++ : 0;
  }
  return map;
};
