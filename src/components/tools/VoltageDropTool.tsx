"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionCard } from "@/components/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShareToolButton } from "@/components/tools/ShareToolButton";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

type Unit = "m" | "ft";
type LengthMode = "oneWay" | "roundTrip";
type Material = "cu" | "al";
type GaugeFormat = "awg" | "mm2";

const FT_TO_M = 0.3048;

// Resistivity: Ω·mm²/m
const RESISTIVITY: Record<Material, number> = {
  cu: 0.01724,
  al: 0.02826,
};

// AWG to mm² (cross-section)
const AWG_TO_MM2: Record<string, number> = {
  "14": 2.08,
  "12": 3.31,
  "10": 5.26,
  "8": 8.37,
  "6": 13.3,
  "4": 21.1,
  "2": 33.6,
};
const AWG_OPTIONS = ["14", "12", "10", "8", "6", "4", "2"];

const MM2_OPTIONS = ["1.5", "2.5", "4.0", "6.0", "10.0", "16.0", "25.0"];

const clampPositive = (value: number, min = 0) => {
  if (!Number.isFinite(value) || value < min) return min;
  return value;
};

export function VoltageDropTool() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.voltageDrop.tool;

  const [voltage, setVoltage] = useState(() => {
    const raw = searchParams.get("v");
    const parsed = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? clampPositive(parsed, 1) : 230;
  });

  const [current, setCurrent] = useState(() => {
    const raw = searchParams.get("a");
    const parsed = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? clampPositive(parsed) : 10;
  });

  const [length, setLength] = useState(() => {
    const raw = searchParams.get("len");
    const parsed = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? clampPositive(parsed) : 20;
  });

  const [unit, setUnit] = useState<Unit>(() => {
    const raw = searchParams.get("unit");
    return raw === "ft" ? "ft" : "m";
  });

  const [lengthMode, setLengthMode] = useState<LengthMode>(() => {
    const raw = searchParams.get("lm");
    return raw === "roundTrip" ? "roundTrip" : "oneWay";
  });

  const [material, setMaterial] = useState<Material>(() => {
    const raw = searchParams.get("mat");
    return raw === "al" ? "al" : "cu";
  });

  const [gaugeFormat, setGaugeFormat] = useState<GaugeFormat>(() => {
    const raw = searchParams.get("gf");
    return raw === "mm2" ? "mm2" : "awg";
  });

  const [awgValue, setAwgValue] = useState(() => {
    const raw = searchParams.get("awg");
    return AWG_OPTIONS.includes(raw ?? "") ? (raw as string) : "12";
  });

  const [mm2Value, setMm2Value] = useState(() => {
    const raw = searchParams.get("mm2");
    return MM2_OPTIONS.includes(raw ?? "") ? (raw as string) : "2.5";
  });

  const syncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncUrl = (
    v: number,
    a: number,
    len: number,
    u: Unit,
    lm: LengthMode,
    mat: Material,
    gf: GaugeFormat,
    awg: string,
    mm2: string,
  ) => {
    if (syncRef.current) clearTimeout(syncRef.current);
    syncRef.current = setTimeout(() => {
      const params = new URLSearchParams({
        v: String(v),
        a: String(a),
        len: String(len),
        unit: u,
        lm,
        mat,
        gf,
        awg,
        mm2,
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);
  };

  const results = useMemo(() => {
    // Length in metres
    const lenM = unit === "ft" ? length * FT_TO_M : length;
    // Conductor length (double for one-way because current travels both ways)
    const conductorLength = lengthMode === "oneWay" ? lenM * 2 : lenM;
    // Cross-section in mm²
    const crossSection =
      gaugeFormat === "awg"
        ? (AWG_TO_MM2[awgValue] ?? 3.31)
        : parseFloat(mm2Value) || 2.5;

    const resistivity = RESISTIVITY[material];
    const drop = (resistivity * conductorLength * current) / crossSection;
    const safeVoltage = Math.max(1, voltage);
    const dropPercent = (drop / safeVoltage) * 100;
    const endVoltage = safeVoltage - drop;

    let statusKey: "ok" | "warning" | "danger";
    if (dropPercent <= 3) {
      statusKey = "ok";
    } else if (dropPercent <= 5) {
      statusKey = "warning";
    } else {
      statusKey = "danger";
    }

    return { drop, dropPercent, endVoltage, statusKey };
  }, [voltage, current, length, unit, lengthMode, material, gaugeFormat, awgValue, mm2Value]);

  const statusColors: Record<string, string> = {
    ok: "border-foreground/20 bg-foreground/5 text-foreground",
    warning: "border-yellow-400/40 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400",
    danger: "border-destructive/40 bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-6">
          <p className="text-title text-foreground">{tool.resultsTitle}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vd-voltage">{tool.supplyVoltage}</Label>
              <Input
                id="vd-voltage"
                type="number"
                min={1}
                value={voltage}
                onChange={(event) => {
                  const next = clampPositive(Number(event.target.value), 1);
                  setVoltage(next);
                  syncUrl(next, current, length, unit, lengthMode, material, gaugeFormat, awgValue, mm2Value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vd-current">{tool.current}</Label>
              <Input
                id="vd-current"
                type="number"
                min={0}
                step={0.1}
                value={current}
                onChange={(event) => {
                  const next = clampPositive(Number(event.target.value));
                  setCurrent(next);
                  syncUrl(voltage, next, length, unit, lengthMode, material, gaugeFormat, awgValue, mm2Value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vd-length">{tool.cableLength}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="vd-length"
                  type="number"
                  min={0}
                  step={0.5}
                  value={length}
                  onChange={(event) => {
                    const next = clampPositive(Number(event.target.value));
                    setLength(next);
                    syncUrl(voltage, current, next, unit, lengthMode, material, gaugeFormat, awgValue, mm2Value);
                  }}
                />
                <Select
                  value={unit}
                  onValueChange={(value) => {
                    const next = value as Unit;
                    setUnit(next);
                    syncUrl(voltage, current, length, next, lengthMode, material, gaugeFormat, awgValue, mm2Value);
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">{tool.units.m}</SelectItem>
                    <SelectItem value="ft">{tool.units.ft}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{tool.lengthMode}</p>
              <RadioGroup
                value={lengthMode}
                onValueChange={(value) => {
                  const next = value as LengthMode;
                  setLengthMode(next);
                  syncUrl(voltage, current, length, unit, next, material, gaugeFormat, awgValue, mm2Value);
                }}
              >
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="oneWay" />
                  {tool.lengthModes.oneWay}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="roundTrip" />
                  {tool.lengthModes.roundTrip}
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{tool.material}</p>
              <RadioGroup
                value={material}
                onValueChange={(value) => {
                  const next = value as Material;
                  setMaterial(next);
                  syncUrl(voltage, current, length, unit, lengthMode, next, gaugeFormat, awgValue, mm2Value);
                }}
              >
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="cu" />
                  {tool.materials.cu}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="al" />
                  {tool.materials.al}
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{tool.gaugeFormat}</p>
                <RadioGroup
                  value={gaugeFormat}
                  onValueChange={(value) => {
                    const next = value as GaugeFormat;
                    setGaugeFormat(next);
                    syncUrl(voltage, current, length, unit, lengthMode, material, next, awgValue, mm2Value);
                  }}
                >
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RadioGroupItem value="awg" />
                    {tool.gaugeFormats.awg}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RadioGroupItem value="mm2" />
                    {tool.gaugeFormats.mm2}
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vd-gauge">{tool.gauge}</Label>
                {gaugeFormat === "awg" ? (
                  <Select
                    value={awgValue}
                    onValueChange={(value) => {
                      setAwgValue(value);
                      syncUrl(voltage, current, length, unit, lengthMode, material, gaugeFormat, value, mm2Value);
                    }}
                  >
                    <SelectTrigger id="vd-gauge">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AWG_OPTIONS.map((awg) => (
                        <SelectItem key={awg} value={awg}>
                          AWG {awg} ({AWG_TO_MM2[awg]} mm²)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={mm2Value}
                    onValueChange={(value) => {
                      setMm2Value(value);
                      syncUrl(voltage, current, length, unit, lengthMode, material, gaugeFormat, awgValue, value);
                    }}
                  >
                    <SelectTrigger id="vd-gauge">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MM2_OPTIONS.map((mm2) => (
                        <SelectItem key={mm2} value={mm2}>
                          {mm2} mm²
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-4">
          <p className="text-title text-foreground">{tool.resultsTitle}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.voltageDrop}
              </p>
              <p className="mt-2 text-lg text-foreground">{results.drop.toFixed(2)} V</p>
            </div>

            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.dropPercent}
              </p>
              <p className="mt-2 text-lg text-foreground">{results.dropPercent.toFixed(2)} %</p>
            </div>

            <div className="rounded-lg border border-border/40 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.endVoltage}
              </p>
              <p className="mt-2 text-lg text-foreground">{results.endVoltage.toFixed(1)} V</p>
            </div>

            <div className={`rounded-lg border p-4 ${statusColors[results.statusKey]}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Status</p>
              <p className="mt-2 text-sm font-semibold">
                {tool.status[results.statusKey]}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <ShareToolButton />
    </div>
  );
}
