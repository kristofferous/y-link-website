"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/components/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

const clampInt = (value: number, min = 1) => {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.floor(value));
};

export function DmxCapacityTool() {
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.dmxCapacity.tool;

  const [channelsPerFixture, setChannelsPerFixture] = useState(13);
  const [fixtureCount, setFixtureCount] = useState("");
  const [channelsPerUniverse, setChannelsPerUniverse] = useState(512);

  const outputs = useMemo(() => {
    const perFixture = clampInt(channelsPerFixture);
    const perUniverse = clampInt(channelsPerUniverse, 1);
    const fixturesPerUniverse = Math.floor(perUniverse / perFixture);
    const leftover = perUniverse - fixturesPerUniverse * perFixture;
    const parsedCount = fixtureCount.trim() ? clampInt(Number(fixtureCount)) : null;
    const universesRequired =
      parsedCount && fixturesPerUniverse > 0 ? Math.ceil(parsedCount / fixturesPerUniverse) : null;
    const notPossible = perFixture > perUniverse;
    const showWarning = parsedCount !== null && fixturesPerUniverse > 0 && parsedCount > fixturesPerUniverse;

    return {
      fixturesPerUniverse,
      leftover,
      universesRequired,
      notPossible,
      showWarning,
    };
  }, [channelsPerFixture, channelsPerUniverse, fixtureCount]);

  return (
    <SectionCard>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-title text-foreground">{tool.inputs.title}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="capacity-channels">{tool.inputs.channelsPerFixture}</Label>
            <Input
              id="capacity-channels"
              type="number"
              min={1}
              value={channelsPerFixture}
              onChange={(event) => setChannelsPerFixture(clampInt(Number(event.target.value || 1)))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity-count">{tool.inputs.fixtureCount}</Label>
            <Input
              id="capacity-count"
              type="number"
              min={1}
              value={fixtureCount}
              onChange={(event) => setFixtureCount(event.target.value)}
              placeholder="e.g. 24"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity-universe">{tool.inputs.channelsPerUniverse}</Label>
            <Input
              id="capacity-universe"
              type="number"
              min={1}
              value={channelsPerUniverse}
              onChange={(event) => setChannelsPerUniverse(clampInt(Number(event.target.value || 1)))}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-background p-4">
          <p className="text-sm font-semibold text-foreground">{tool.outputs.title}</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <div>
              {tool.outputs.fixturesPerUniverse}: <span className="text-foreground">{outputs.fixturesPerUniverse}</span>
            </div>
            <div>
              {tool.outputs.leftoverChannels}: <span className="text-foreground">{outputs.leftover}</span>
            </div>
            {outputs.universesRequired !== null ? (
              <div>
                {tool.outputs.universesRequired}:{" "}
                <span className="text-foreground">{outputs.universesRequired}</span>
              </div>
            ) : null}
          </div>
        </div>

        {outputs.notPossible ? (
          <div className="rounded-lg border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground">
            {tool.outputs.notPossible}
          </div>
        ) : null}
        {!outputs.notPossible && outputs.showWarning ? (
          <div className="rounded-lg border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground">
            {tool.outputs.warning}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
