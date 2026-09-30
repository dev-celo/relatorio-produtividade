import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  durationOf,
  formatDuration,
  newId,
  toMinutes,
  KIND_LABEL,
  type Activity,
  type ActivityKind,
} from "@/lib/report";
import { kindIcon } from "./kinds";

const KINDS: ActivityKind[] = ["produtiva", "improdutiva", "almoco"];

const blank = (start: string): Activity => ({
  id: newId(),
  name: "",
  subtitle: "",
  start,
  end: start,
  kind: "produtiva",
});

type Props = {
  activities: Activity[];
  onChange: (activities: Activity[]) => void;
  shiftStart: string;
};

export function ActivityEditor({ activities, onChange, shiftStart }: Props) {
  const lastEnd = activities.length ? activities[activities.length - 1].end : shiftStart;
  const [draft, setDraft] = useState<Activity>(() => blank(lastEnd));
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortByStart = (list: Activity[]) =>
    [...list].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

  const submit = () => {
    if (!draft.name.trim()) return;
    if (editingId) {
      onChange(sortByStart(activities.map((a) => (a.id === editingId ? { ...draft } : a))));
      setEditingId(null);
    } else {
      onChange(sortByStart([...activities, { ...draft }]));
    }
    setDraft(blank(draft.end));
  };

  const startEdit = (a: Activity) => {
    setEditingId(a.id);
    setDraft({ ...a });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(blank(lastEnd));
  };

  const remove = (id: string) => {
    onChange(activities.filter((a) => a.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="font-display text-base font-bold tracking-wide text-brand">
        {editingId ? "EDITAR ATIVIDADE" : "NOVA ATIVIDADE"}
      </h2>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Label htmlFor="act-name">Atividade</Label>
          <Input
            id="act-name"
            value={draft.name}
            placeholder="Ex.: DESMONTE"
            onChange={(e) => setDraft({ ...draft, name: e.target.value.toUpperCase() })}
          />
        </div>
        <div>
          <Label htmlFor="act-sub">Complemento</Label>
          <Input
            id="act-sub"
            value={draft.subtitle}
            placeholder="(OPEN PIT)"
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value.toUpperCase() })}
          />
        </div>
        <div>
          <Label htmlFor="act-start">Início</Label>
          <Input
            id="act-start"
            type="time"
            value={draft.start}
            onChange={(e) => setDraft({ ...draft, start: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="act-end">Fim</Label>
          <Input
            id="act-end"
            type="time"
            value={draft.end}
            onChange={(e) => setDraft({ ...draft, end: e.target.value })}
          />
        </div>
        <div>
          <Label>Tipo</Label>
          <div className="mt-1 flex flex-wrap gap-1">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setDraft({ ...draft, kind: k })}
                className={`rounded-md border px-2 py-1 text-xs font-semibold transition-colors ${
                  draft.kind === k
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={submit} disabled={!draft.name.trim()}>
          {editingId ? <Pencil className="size-4" /> : <Plus className="size-4" />}
          {editingId ? "Salvar alterações" : "Inserir atividade"}
        </Button>
        {editingId ? (
          <Button variant="outline" onClick={cancelEdit}>
            <X className="size-4" /> Cancelar
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            Duração: {formatDuration(durationOf(draft))}
          </span>
        )}
      </div>

      {activities.length > 0 ? (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {activities.map((a) => {
            const Icon = kindIcon(a.kind);
            return (
              <li key={a.id} className="flex items-center gap-3 px-3 py-2">
                <Icon className="size-4 shrink-0 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {a.name} <span className="font-normal text-muted-foreground">{a.subtitle}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.start} às {a.end} · {formatDuration(durationOf(a))} · {KIND_LABEL[a.kind]}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)} aria-label="Editar">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(a.id)}
                  aria-label="Excluir"
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
