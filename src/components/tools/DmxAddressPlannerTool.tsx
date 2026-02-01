"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "@/lib/i18n/TranslationProvider";
import { prefixLocale } from "@/lib/i18n/routing";
import { CHANNELS_PER_UNIVERSE, checkOverlap, clampInt, nextFreeAddress } from "@/lib/tools/dmx";

type FixtureType = "wash" | "spot" | "beam" | "fx" | "other";

type Fixture = {
  id: string;
  name: string;
  channels: number;
  type: FixtureType;
};

type Placement = {
  fixtureId: string;
  universe: number;
  startAddress: number;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fixture-${Math.random().toString(16).slice(2)}`;
};

const fixtureTypeOrder: FixtureType[] = ["wash", "spot", "beam", "fx", "other"];

const fixtureTypeTone: Record<FixtureType, string> = {
  wash: "bg-foreground/8 border-foreground/20",
  spot: "bg-foreground/12 border-foreground/25",
  beam: "bg-foreground/16 border-foreground/30",
  fx: "bg-foreground/20 border-foreground/35",
  other: "bg-foreground/6 border-foreground/15",
};

export function DmxAddressPlannerTool() {
  const { dictionary, locale } = useTranslations();
  const tool = dictionary.tools.dmxAddressPlanner.tool;
  const defaults = dictionary.tools.dmxAddressPlanner.defaults;

  const [initialFixtureId] = useState(() => createId());
  const [fixtures, setFixtures] = useState<Fixture[]>(() => [
    {
      id: initialFixtureId,
      name: defaults.sampleName,
      channels: 12,
      type: "wash",
    },
  ]);
  const [activeFixtureId, setActiveFixtureId] = useState<string | null>(initialFixtureId);
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [warning, setWarning] = useState<string | null>(null);
  const [universes, setUniverses] = useState<number[]>([1]);
  const [activeUniverse, setActiveUniverse] = useState(1);

  useEffect(() => {
    if (activeFixtureId && fixtures.some((fixture) => fixture.id === activeFixtureId)) return;
    setActiveFixtureId(fixtures[0]?.id ?? null);
  }, [activeFixtureId, fixtures]);

  const fixtureById = useMemo(() => {
    return new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  }, [fixtures]);

  const updateFixture = (id: string, patch: Partial<Fixture>) => {
    setFixtures((current) => current.map((fixture) => (fixture.id === id ? { ...fixture, ...patch } : fixture)));
  };

  const addFixture = () => {
    const id = createId();
    setFixtures((current) => [
      ...current,
      {
        id,
        name: defaults.newName,
        channels: 8,
        type: "spot",
      },
    ]);
    setActiveFixtureId(id);
  };

  const removeFixture = (id: string) => {
    setFixtures((current) => current.filter((fixture) => fixture.id !== id));
    setPlacements((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const clearPlacement = (id: string) => {
    setPlacements((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const placeFixture = (fixtureId: string, startAddress: number, universe = activeUniverse) => {
    const fixture = fixtureById.get(fixtureId);
    if (!fixture) return;
    const maxAddress = CHANNELS_PER_UNIVERSE - fixture.channels + 1;
    if (startAddress > maxAddress) {
      setWarning(tool.warnings.outOfRange);
      return;
    }
    setPlacements((current) => ({
      ...current,
      [fixtureId]: { fixtureId, universe, startAddress },
    }));
    setWarning(null);
  };

  const { cellFixtures, usedChannels, overlapMessages, occupancy } = useMemo(() => {
    const grids = new Map<number, Array<Set<string>>>();
    const rangesByUniverse = new Map<number, Array<{ id: string; start: number; end: number }>>();

    universes.forEach((universe) => {
      grids.set(universe, Array.from({ length: CHANNELS_PER_UNIVERSE }, () => new Set<string>()));
      rangesByUniverse.set(universe, []);
    });

    Object.values(placements).forEach((placement) => {
      const fixture = fixtureById.get(placement.fixtureId);
      if (!fixture) return;
      const grid = grids.get(placement.universe);
      if (!grid) return;
      const start = placement.startAddress;
      const end = placement.startAddress + fixture.channels - 1;
      for (let channel = start; channel <= end; channel += 1) {
        if (channel >= 1 && channel <= CHANNELS_PER_UNIVERSE) {
          grid[channel - 1].add(fixture.id);
        }
      }
      const ranges = rangesByUniverse.get(placement.universe);
      ranges?.push({ id: fixture.id, start, end });
    });

    const messages: string[] = [];
    rangesByUniverse.forEach((ranges, universe) => {
      const overlaps = checkOverlap(ranges);
      overlaps.forEach((overlap) => {
        const a = fixtureById.get(overlap.aId)?.name ?? defaults.fallbackName;
        const b = fixtureById.get(overlap.bId)?.name ?? defaults.fallbackName;
        messages.push(
          tool.warnings.overlap
            .replace("{a}", a)
            .replace("{b}", b)
            .replace("{start}", String(overlap.start))
            .replace("{end}", String(overlap.end))
            .replace("{universe}", String(universe)),
        );
      });
    });

    let used = 0;
    grids.forEach((grid) => {
      used += grid.filter((cell) => cell.size > 0).length;
    });

    const activeGrid =
      grids.get(activeUniverse) ?? Array.from({ length: CHANNELS_PER_UNIVERSE }, () => new Set<string>());
    const occupied = activeGrid.map((cell) => cell.size > 0);

    return {
      cellFixtures: activeGrid,
      usedChannels: used,
      overlapMessages: messages,
      occupancy: occupied,
    };
  }, [placements, fixtureById, defaults.fallbackName, tool.warnings.overlap, universes, activeUniverse]);

  const activeFixture = activeFixtureId ? fixtureById.get(activeFixtureId) ?? null : null;

  const totalChannels = CHANNELS_PER_UNIVERSE * universes.length;
  const utilization = totalChannels ? Math.round((usedChannels / totalChannels) * 100) : 0;

  const handleNextFree = () => {
    if (!activeFixture) return;
    const next = nextFreeAddress(occupancy, activeFixture.channels, 1);
    if (!next) {
      const nextUniverse = Math.max(...universes) + 1;
      setUniverses((current) => [...current, nextUniverse]);
      setActiveUniverse(nextUniverse);
      placeFixture(activeFixture.id, 1, nextUniverse);
      return;
    }
    placeFixture(activeFixture.id, next, activeUniverse);
  };

  const sendToPatchSheet = () => {
    const payload = Object.values(placements)
      .map((placement) => {
        const fixture = fixtureById.get(placement.fixtureId);
        if (!fixture) return null;
        return {
          name: fixture.name.trim() || defaults.fallbackName,
          channels: fixture.channels,
          universe: placement.universe,
          address: placement.startAddress,
        };
      })
      .filter((entry): entry is { name: string; channels: number; universe: number; address: number } => Boolean(entry));

    if (payload.length === 0) {
      setWarning(tool.warnings.noFixturesPlaced);
      return;
    }

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const destination = `${prefixLocale(locale, "/tools/dmx-patch-sheet")}?import=${encoded}`;
    window.location.href = destination;
  };

  const addUniverse = () => {
    const nextUniverse = Math.max(...universes) + 1;
    setUniverses((current) => [...current, nextUniverse]);
    setActiveUniverse(nextUniverse);
  };

  return (
    <div className="space-y-8">
      <SectionCard className="border-0 bg-transparent !p-0 shadow-none sm:rounded-xl sm:border sm:border-border/40 sm:bg-card sm:!p-8 sm:shadow-lg">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-title text-foreground">{tool.fixtures.title}</p>
              <p className="text-sm text-muted-foreground">{tool.fixtures.subtitle}</p>
            </div>
            <Button type="button" variant="outline" onClick={addFixture}>
              {tool.fixtures.add}
            </Button>
          </div>

          {fixtures.length === 0 ? (
            <div className="rounded-lg border border-border/40 bg-background px-4 py-6 text-sm text-muted-foreground">
              {tool.status.noFixtures}
            </div>
          ) : (
            <>
              <div className="space-y-4 sm:hidden">
                {fixtures.map((fixture) => {
                  const placement = placements[fixture.id];
                  const isActive = fixture.id === activeFixtureId;
                  return (
                    <div
                      key={fixture.id}
                      className={`rounded-lg border border-border/40 bg-background p-4 ${
                        isActive ? "ring-1 ring-foreground/20" : ""
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">{tool.fixtures.name}</Label>
                          <Input
                            value={fixture.name}
                            onChange={(event) => updateFixture(fixture.id, { name: event.target.value })}
                            placeholder={defaults.placeholderName}
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">{tool.fixtures.channels}</Label>
                            <Input
                              type="number"
                              min={1}
                              value={fixture.channels}
                              onChange={(event) =>
                                updateFixture(fixture.id, { channels: clampInt(Number(event.target.value || 1)) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">{tool.fixtures.type}</Label>
                            <Select
                              value={fixture.type}
                              onValueChange={(value) => updateFixture(fixture.id, { type: value as FixtureType })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fixtureTypeOrder.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {tool.types[type]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tool.fixtures.status}:{" "}
                          <span className="text-foreground">
                            {placement ? tool.fixtures.placed : tool.fixtures.unplaced}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            onClick={() => setActiveFixtureId(fixture.id)}
                          >
                            {isActive ? tool.fixtures.selected : tool.fixtures.select}
                          </Button>
                          {placement ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => clearPlacement(fixture.id)}
                            >
                              {tool.actions.clearPlacement}
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFixture(fixture.id)}
                          >
                            {tool.fixtures.remove}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{tool.fixtures.name}</TableHead>
                      <TableHead>{tool.fixtures.channels}</TableHead>
                      <TableHead>{tool.fixtures.type}</TableHead>
                      <TableHead>{tool.fixtures.status}</TableHead>
                      <TableHead className="text-right">{tool.fixtures.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixtures.map((fixture) => {
                      const placement = placements[fixture.id];
                      const isActive = fixture.id === activeFixtureId;
                      return (
                        <TableRow key={fixture.id} className={isActive ? "bg-card/60" : undefined}>
                          <TableCell>
                            <Input
                              value={fixture.name}
                              onChange={(event) => updateFixture(fixture.id, { name: event.target.value })}
                              placeholder={defaults.placeholderName}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={fixture.channels}
                              onChange={(event) =>
                                updateFixture(fixture.id, { channels: clampInt(Number(event.target.value || 1)) })
                              }
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={fixture.type}
                              onValueChange={(value) => updateFixture(fixture.id, { type: value as FixtureType })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fixtureTypeOrder.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {tool.types[type]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {placement ? tool.fixtures.placed : tool.fixtures.unplaced}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={isActive ? "default" : "outline"}
                                onClick={() => setActiveFixtureId(fixture.id)}
                              >
                                {isActive ? tool.fixtures.selected : tool.fixtures.select}
                              </Button>
                              {placement ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => clearPlacement(fixture.id)}
                                >
                                  {tool.actions.clearPlacement}
                                </Button>
                              ) : null}
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFixture(fixture.id)}
                              >
                                {tool.fixtures.remove}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard className="border-0 bg-transparent !p-0 shadow-none sm:rounded-xl sm:border sm:border-border/40 sm:bg-card sm:!p-8 sm:shadow-lg">
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-title text-foreground">
                {tool.grid.title.replace("{universe}", String(activeUniverse))}
              </p>
              <p className="text-sm text-muted-foreground">{tool.grid.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[160px]">
                <Label className="text-xs text-muted-foreground">{tool.grid.universeLabel}</Label>
                <Select value={String(activeUniverse)} onValueChange={(value) => setActiveUniverse(Number(value))}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {universes.map((universe) => (
                      <SelectItem key={universe} value={String(universe)}>
                        {tool.grid.universeOption.replace("{universe}", String(universe))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" onClick={addUniverse}>
                {tool.actions.addUniverse}
              </Button>
              <Button type="button" variant="outline" onClick={handleNextFree} disabled={!activeFixture}>
                {tool.actions.nextFree}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {tool.grid.legend}
            </span>
            {fixtureTypeOrder.map((type) => (
              <span
                key={type}
                className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${fixtureTypeTone[type]}`}
              >
                {tool.types[type]}
              </span>
            ))}
            <span className="rounded-full border border-destructive/60 bg-destructive/15 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-destructive">
              {tool.grid.overlap}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
            <div className="w-fit max-w-full justify-self-start rounded-lg border border-border/40 bg-background p-3 sm:p-4">
              <div className="max-h-[420px] overflow-x-auto overflow-y-auto rounded-md md:max-h-[520px]">
                <div
                  className="grid gap-px rounded-md bg-border/40 p-1 [--cell-size:clamp(14px,calc((100vw-3.5rem)/16),22px)] [--grid-columns:16] [--grid-rows:32] md:[--cell-size:18px] md:[--grid-columns:32] md:[--grid-rows:16]"
                  style={{
                    gridTemplateColumns: "repeat(var(--grid-columns), var(--cell-size))",
                    gridTemplateRows: "repeat(var(--grid-rows), var(--cell-size))",
                  }}
                >
                  {cellFixtures.map((fixturesAtCell, index) => {
                    const channel = index + 1;
                    const ids = Array.from(fixturesAtCell);
                    const primary = ids[0];
                    const fixture = primary ? fixtureById.get(primary) : null;
                    const isOverlap = ids.length > 1;
                    const isSelected =
                      activeFixtureId && fixture && fixture.id === activeFixtureId && !isOverlap;
                    const placementLabel = fixture
                      ? `${fixture.name} (${tool.types[fixture.type]}, ch ${channel})`
                      : `${tool.grid.channel} ${channel}`;

                    return (
                      <button
                        key={`channel-${channel}`}
                        type="button"
                        className={[
                          "h-[var(--cell-size)] w-[var(--cell-size)] rounded-[2px] border border-border/40 text-[10px] leading-none text-muted-foreground transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          fixture ? fixtureTypeTone[fixture.type] : "bg-background",
                          isSelected ? "ring-2 ring-foreground/40" : "",
                          isOverlap ? "border-destructive/70 bg-destructive/20 text-destructive" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-label={placementLabel}
                        title={placementLabel}
                        onClick={() => {
                          if (!activeFixtureId) return;
                          placeFixture(activeFixtureId, channel, activeUniverse);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border/40 bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{tool.summary.title}</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div>
                    {tool.summary.universes}: <span className="text-foreground">{universes.length}</span>
                  </div>
                  <div>
                    {tool.summary.channelsUsed}:{" "}
                    <span className="text-foreground">
                      {usedChannels}/{totalChannels}
                    </span>
                  </div>
                  <div>
                    {tool.summary.utilization}: <span className="text-foreground">{utilization}%</span>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={sendToPatchSheet}
                >
                  {tool.actions.sendToPatch}
                </Button>
              </div>

              <div className="rounded-lg border border-border/40 bg-background p-4 text-sm text-muted-foreground">
                {activeFixture ? (
                  <p>
                    {tool.status.selected} <span className="text-foreground">{activeFixture.name}</span>
                  </p>
                ) : (
                  <p>{tool.status.selectFixture}</p>
                )}
              </div>
            </div>
          </div>

          {warning ? (
            <div className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
              {warning}
            </div>
          ) : null}

          {overlapMessages.length > 0 ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <div className="space-y-2">
                {overlapMessages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
