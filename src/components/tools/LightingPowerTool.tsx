"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "@/lib/i18n/TranslationProvider";
import presets from "@/data/lighting/power-presets.json";

type Preset = {
  name: string;
  watts: number;
};

type FixtureRow = {
  id: string;
  name: string;
  presetName: string;
  quantity: number;
  watts: number;
};

const PRESET_CUSTOM = "custom";

const clampNumber = (value: number, min = 0) => {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, value);
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fixture-${Math.random().toString(16).slice(2)}`;
};

const defaultPreset = presets[0] as Preset | undefined;

export function LightingPowerTool() {
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.lightingPower.tool;

  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    {
      id: createId(),
      name: defaultPreset?.name ?? tool.defaults.newName,
      presetName: defaultPreset?.name ?? PRESET_CUSTOM,
      quantity: 4,
      watts: defaultPreset?.watts ?? 50,
    },
  ]);

  const [voltage, setVoltage] = useState(230);
  const [breakerAmps, setBreakerAmps] = useState(16);
  const [circuitCount, setCircuitCount] = useState(6);
  const [phaseCount, setPhaseCount] = useState(3);

  const updateFixture = (id: string, patch: Partial<FixtureRow>) => {
    setFixtures((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addFixture = () => {
    setFixtures((current) => [
      ...current,
      {
        id: createId(),
        name: tool.defaults.newName,
        presetName: PRESET_CUSTOM,
        quantity: 1,
        watts: 0,
      },
    ]);
  };

  const removeFixture = (id: string) => {
    setFixtures((current) => current.filter((row) => row.id !== id));
  };

  const applyPreset = (id: string, presetName: string) => {
    const preset = (presets as Preset[]).find((item) => item.name === presetName);
    if (!preset) {
      updateFixture(id, { presetName, name: tool.defaults.customName });
      return;
    }
    updateFixture(id, {
      presetName,
      name: preset.name,
      watts: preset.watts,
    });
  };

  const results = useMemo(() => {
    const safeVoltage = clampNumber(voltage, 1);
    const safeCircuits = Math.max(1, Math.floor(circuitCount));
    const safeBreaker = clampNumber(breakerAmps, 1);
    const safePhases = Math.max(1, Math.min(Math.floor(phaseCount), safeCircuits));

    const units: Array<{ watts: number; amps: number }> = [];
    fixtures.forEach((row) => {
      const quantity = Math.max(0, Math.floor(row.quantity));
      const watts = clampNumber(row.watts);
      const resolvedWatts = watts;
      const resolvedAmps = resolvedWatts / safeVoltage;

      for (let i = 0; i < quantity; i += 1) {
        units.push({ watts: resolvedWatts, amps: resolvedAmps });
      }
    });

    const totalWatts = units.reduce((sum, unit) => sum + unit.watts, 0);
    const totalAmps = units.reduce((sum, unit) => sum + unit.amps, 0);

    const circuitLoads = Array.from({ length: safeCircuits }, () => 0);
    units.forEach((unit, index) => {
      const circuitIndex = index % safeCircuits;
      circuitLoads[circuitIndex] += unit.amps;
    });

    const safeLimit = safeBreaker * 0.8;
    const phaseLoads = Array.from({ length: safePhases }, () => 0);
    circuitLoads.forEach((load, index) => {
      phaseLoads[index % safePhases] += load;
    });

    const maxPhase = Math.max(...phaseLoads);
    const minPhase = Math.min(...phaseLoads);
    const imbalance = maxPhase > 0 ? (maxPhase - minPhase) / maxPhase : 0;

    return {
      totalWatts,
      totalAmps,
      circuitLoads,
      safeLimit,
      safeVoltage,
      safeCircuits,
      safeBreaker,
      safePhases,
      phaseLoads,
      imbalance,
    };
  }, [fixtures, voltage, breakerAmps, circuitCount, phaseCount]);

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-title text-foreground">{tool.inputs.title}</p>
              <p className="text-sm text-muted-foreground">{tool.inputs.subtitle}</p>
            </div>
            <Button type="button" variant="outline" onClick={addFixture}>
              {tool.inputs.add}
            </Button>
          </div>

          <div className="space-y-4 sm:hidden">
            {fixtures.map((row) => (
              <div key={row.id} className="rounded-lg border border-border/40 bg-background p-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{tool.inputs.preset}</Label>
                    <Select value={row.presetName} onValueChange={(value) => applyPreset(row.id, value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PRESET_CUSTOM}>{tool.defaults.customName}</SelectItem>
                        {(presets as Preset[]).map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">{tool.inputs.quantity}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={row.quantity}
                        onChange={(event) =>
                          updateFixture(row.id, {
                            quantity: Math.max(0, Math.floor(Number(event.target.value || 0))),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">{tool.inputs.watts}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={row.watts}
                        onChange={(event) =>
                          updateFixture(row.id, { watts: clampNumber(Number(event.target.value || 0)) })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateFixture(row.id, { quantity: Math.max(0, Math.floor(row.quantity + 10)) })
                      }
                    >
                      {tool.inputs.bulkAdd}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFixture(row.id)}>
                      {tool.inputs.remove}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tool.inputs.preset}</TableHead>
                  <TableHead>{tool.inputs.quantity}</TableHead>
                  <TableHead>{tool.inputs.watts}</TableHead>
                  <TableHead className="text-right">{tool.inputs.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixtures.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Select value={row.presetName} onValueChange={(value) => applyPreset(row.id, value)}>
                        <SelectTrigger className="w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PRESET_CUSTOM}>{tool.defaults.customName}</SelectItem>
                          {(presets as Preset[]).map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={row.quantity}
                        onChange={(event) =>
                          updateFixture(row.id, {
                            quantity: Math.max(0, Math.floor(Number(event.target.value || 0))),
                          })
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={row.watts}
                        onChange={(event) =>
                          updateFixture(row.id, { watts: clampNumber(Number(event.target.value || 0)) })
                        }
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateFixture(row.id, { quantity: Math.max(0, Math.floor(row.quantity + 10)) })
                          }
                        >
                          {tool.inputs.bulkAdd}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFixture(row.id)}>
                          {tool.inputs.remove}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-title text-foreground">{tool.circuits.title}</p>
              <p className="text-sm text-muted-foreground">{tool.circuits.subtitle}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="power-voltage">{tool.circuits.voltage}</Label>
                <Input
                  id="power-voltage"
                  type="number"
                  min={1}
                  value={voltage}
                  onChange={(event) => setVoltage(clampNumber(Number(event.target.value || 0), 1))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="power-breaker">{tool.circuits.breaker}</Label>
                <Input
                  id="power-breaker"
                  type="number"
                  min={1}
                  value={breakerAmps}
                  onChange={(event) => setBreakerAmps(clampNumber(Number(event.target.value || 0), 1))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="power-circuits">{tool.circuits.count}</Label>
                <Input
                  id="power-circuits"
                  type="number"
                  min={1}
                  value={circuitCount}
                  onChange={(event) => setCircuitCount(Math.max(1, Math.floor(Number(event.target.value || 1))))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="power-phases">{tool.circuits.phases}</Label>
                <Select value={String(phaseCount)} onValueChange={(value) => setPhaseCount(Number(value))}>
                  <SelectTrigger id="power-phases">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3].map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{tool.circuits.safety}</Label>
                <div className="rounded-lg border border-border/40 bg-background px-3 py-2 text-sm text-muted-foreground">
                  {tool.circuits.safetyValue.replace("{value}", "80")}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{tool.circuits.perCircuit}</p>
              <div className="mt-4 space-y-3">
                {results.circuitLoads.map((amps, index) => {
                  const loadRatio = results.safeLimit > 0 ? amps / results.safeLimit : 0;
                  const loadPct = Math.min(100, Math.round(loadRatio * 100));
                  const color =
                    loadRatio > 1 ? "bg-destructive" : loadRatio > 0.8 ? "bg-foreground/40" : "bg-foreground/20";
                  return (
                    <div key={`circuit-${index}`} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{tool.circuits.circuitLabel.replace("{index}", String(index + 1))}</span>
                        <span>
                          {amps.toFixed(1)}A / {results.safeLimit.toFixed(1)}A
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-border/50">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${loadPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {results.imbalance > 0.2 ? (
              <div className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
                {tool.circuits.phaseWarning.replace("{value}", String(Math.round(results.imbalance * 100)))}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard>
          <div className="space-y-6">
            <div>
              <p className="text-title text-foreground">{tool.results.title}</p>
              <p className="text-sm text-muted-foreground">{tool.results.subtitle}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background p-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div>
                  {tool.results.totalWatts}:{" "}
                  <span className="text-foreground">{results.totalWatts.toFixed(0)} W</span>
                </div>
                <div>
                  {tool.results.totalAmps}:{" "}
                  <span className="text-foreground">{results.totalAmps.toFixed(1)} A</span>
                </div>
                <div>
                  {tool.results.perCircuit}:{" "}
                  <span className="text-foreground">
                    {(results.totalAmps / results.safeCircuits).toFixed(1)} A
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/40 bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.results.phaseTitle}
              </p>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {results.phaseLoads.map((load, index) => (
                  <div key={`phase-${index}`}>
                    {tool.results.phaseLabel.replace("{index}", String(index + 1))}:{" "}
                    <span className="text-foreground">{load.toFixed(1)} A</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
