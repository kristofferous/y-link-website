"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShareToolButton } from "@/components/tools/ShareToolButton";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

const STANDARD_PRESET = { slots: 512, breakUs: 88, mabUs: 8, slotUs: 4 };
const HIGH_SPEED_PRESET = { slots: 128, breakUs: 88, mabUs: 8, slotUs: 4 };

const clampInt = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
};

const calcFrame = (slots: number, breakUs: number, mabUs: number, slotUs: number) => {
  // DMX frame = break + MAB + start code slot + (slots * slotTime)
  // Each slot = 11 bits (1 start + 8 data + 2 stop) at slotUs per bit? No:
  // slotUs is the duration of one slot (not one bit). Standard: 4µs per bit, 11 bits = 44µs per slot.
  // But the "slot time" param in DMX spec refers to µs per slot (44µs standard).
  const frameUs = breakUs + mabUs + slotUs + slots * slotUs;
  return frameUs;
};

export function DmxRefreshRateTool() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.dmxRefreshRate.tool;

  const [slots, setSlots] = useState(() => {
    const raw = searchParams.get("slots");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? clampInt(parsed, 1, 512) : 512;
  });
  const [breakUs, setBreakUs] = useState(() => {
    const raw = searchParams.get("break");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? clampInt(parsed, 88, 1000) : 88;
  });
  const [mabUs, setMabUs] = useState(() => {
    const raw = searchParams.get("mab");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? clampInt(parsed, 8, 1000) : 8;
  });
  const [slotUs, setSlotUs] = useState(() => {
    const raw = searchParams.get("slot");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? clampInt(parsed, 4, 8) : 4;
  });

  const syncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncUrl = (s: number, b: number, m: number, sl: number) => {
    if (syncRef.current) clearTimeout(syncRef.current);
    syncRef.current = setTimeout(() => {
      router.replace(`?slots=${s}&break=${b}&mab=${m}&slot=${sl}`, { scroll: false });
    }, 300);
  };

  const update = (
    nextSlots: number,
    nextBreak: number,
    nextMab: number,
    nextSlot: number,
  ) => {
    setSlots(nextSlots);
    setBreakUs(nextBreak);
    setMabUs(nextMab);
    setSlotUs(nextSlot);
    syncUrl(nextSlots, nextBreak, nextMab, nextSlot);
  };

  const applyPreset = (preset: typeof STANDARD_PRESET) => {
    update(preset.slots, preset.breakUs, preset.mabUs, preset.slotUs);
  };

  const frameUs = calcFrame(slots, breakUs, mabUs, slotUs);
  const frameMs = frameUs / 1000;
  const fps = frameUs > 0 ? 1_000_000 / frameUs : 0;
  const latencyMs = frameMs;
  const flickerFree = fps >= 30;

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-title text-foreground">{tool.inputs.title}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(STANDARD_PRESET)}
              >
                {tool.inputs.presets.standard}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(HIGH_SPEED_PRESET)}
              >
                {tool.inputs.presets.highSpeed}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="rr-slots">{tool.inputs.slots}</Label>
              <Input
                id="rr-slots"
                type="number"
                min={1}
                max={512}
                value={slots}
                onChange={(e) => {
                  const v = clampInt(Number(e.target.value || 1), 1, 512);
                  setSlots(v);
                  syncUrl(v, breakUs, mabUs, slotUs);
                }}
              />
              <p className="text-xs text-muted-foreground">{tool.inputs.slotsHelp}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rr-break">{tool.inputs.break}</Label>
              <Input
                id="rr-break"
                type="number"
                min={88}
                max={1000}
                value={breakUs}
                onChange={(e) => {
                  const v = clampInt(Number(e.target.value || 88), 88, 1000);
                  setBreakUs(v);
                  syncUrl(slots, v, mabUs, slotUs);
                }}
              />
              <p className="text-xs text-muted-foreground">{tool.inputs.breakHelp}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rr-mab">{tool.inputs.mab}</Label>
              <Input
                id="rr-mab"
                type="number"
                min={8}
                max={1000}
                value={mabUs}
                onChange={(e) => {
                  const v = clampInt(Number(e.target.value || 8), 8, 1000);
                  setMabUs(v);
                  syncUrl(slots, breakUs, v, slotUs);
                }}
              />
              <p className="text-xs text-muted-foreground">{tool.inputs.mabHelp}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rr-slot">{tool.inputs.slotTime}</Label>
              <Input
                id="rr-slot"
                type="number"
                min={4}
                max={8}
                value={slotUs}
                onChange={(e) => {
                  const v = clampInt(Number(e.target.value || 4), 4, 8);
                  setSlotUs(v);
                  syncUrl(slots, breakUs, mabUs, v);
                }}
              />
              <p className="text-xs text-muted-foreground">{tool.inputs.slotTimeHelp}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-4">
          <p className="text-title text-foreground">{tool.outputs.title}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.outputs.frameTime}
              </p>
              <p className="mt-2 text-lg text-foreground">
                {frameUs.toLocaleString()} µs
              </p>
              <p className="text-sm text-muted-foreground">{frameMs.toFixed(2)} ms</p>
            </div>

            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.outputs.fps}
              </p>
              <p className="mt-2 text-lg text-foreground">{fps.toFixed(1)} FPS</p>
            </div>

            <div
              className={`rounded-lg border p-4 ${
                flickerFree
                  ? "border-foreground/20 bg-foreground/5"
                  : "border-destructive/40 bg-destructive/10"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.outputs.flicker}
              </p>
              <p
                className={`mt-2 text-lg font-semibold ${
                  flickerFree ? "text-foreground" : "text-destructive"
                }`}
              >
                {flickerFree ? tool.outputs.flickerOk : tool.outputs.flickerFail}
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.outputs.latency}
              </p>
              <p className="mt-2 text-lg text-foreground">{latencyMs.toFixed(2)} ms</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <ShareToolButton />
    </div>
  );
}
