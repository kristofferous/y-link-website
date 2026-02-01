"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

const DIP_VALUES = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
const MAX_ADDRESS = 1023;

const clampInt = (value: number, min = 0, max = MAX_ADDRESS) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
};

const buildSwitches = (value: number) =>
  DIP_VALUES.map((weight) => (value & weight) === weight);

const toBinaryString = (value: number) => value.toString(2).padStart(10, "0");

export function DmxDipSwitchTool() {
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.dmxDip.tool;

  const [decimal, setDecimal] = useState(1);
  const [switches, setSwitches] = useState<boolean[]>(() => buildSwitches(1));

  const binary = useMemo(() => toBinaryString(decimal), [decimal]);

  const updateFromDecimal = (nextValue: number) => {
    const clamped = clampInt(nextValue, 0, MAX_ADDRESS);
    setDecimal(clamped);
    setSwitches(buildSwitches(clamped));
  };

  const toggleSwitch = (index: number) => {
    setSwitches((current) => {
      const next = [...current];
      next[index] = !next[index];
      const nextValue = DIP_VALUES.reduce(
        (sum, weight, idx) => sum + (next[idx] ? weight : 0),
        0,
      );
      setDecimal(nextValue);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-title text-foreground">{tool.inputs.title}</p>
            <p className="text-sm text-muted-foreground">{tool.inputs.subtitle}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <Label htmlFor="dmx-dip-decimal">{tool.inputs.decimal}</Label>
              <Input
                id="dmx-dip-decimal"
                type="number"
                min={0}
                max={MAX_ADDRESS}
                value={decimal}
                onChange={(event) => updateFromDecimal(Number(event.target.value || 0))}
              />
              <p className="text-xs text-muted-foreground">{tool.inputs.decimalHelp}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.outputs.binary}
              </p>
              <p className="mt-2 font-mono text-lg text-foreground">{binary}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border/40 bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {tool.inputs.switches}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              {DIP_VALUES.map((value, index) => {
                const isOn = switches[index];
                return (
                  <div
                    key={value}
                    className="flex items-center justify-between rounded-md border border-border/40 bg-card px-3 py-2 text-sm text-muted-foreground"
                  >
                    <span>{value}</span>
                    <button
                      type="button"
                      onClick={() => toggleSwitch(index)}
                      aria-pressed={isOn}
                      aria-label={`${tool.inputs.switches} ${value}`}
                      className={[
                        "relative h-10 w-6 rounded-full border border-border/50 bg-background transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isOn ? "border-foreground/60 bg-foreground/10" : "bg-background",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className={[
                          "absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full transition-transform",
                          isOn ? "translate-y-1 bg-foreground" : "-translate-y-3 bg-muted-foreground/60",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-4">
          <p className="text-title text-foreground">{tool.presets.title}</p>
          <div className="flex flex-wrap gap-2">
            {tool.presets.items.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateFromDecimal(preset)}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
