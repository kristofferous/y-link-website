"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionCard } from "@/components/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShareToolButton } from "@/components/tools/ShareToolButton";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

type Mode = "forward" | "reverse";
type AngleType = "full" | "half";
type Unit = "m" | "ft";

const FT_TO_M = 0.3048;

const clampPositive = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
};

const clampAngle = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(179, Math.max(0, value));
};

export function BeamAngleTool() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.beamAngle.tool;

  const [mode, setMode] = useState<Mode>(() => {
    const raw = searchParams.get("mode");
    return raw === "reverse" ? "reverse" : "forward";
  });

  const [angleType, setAngleType] = useState<AngleType>(() => {
    const raw = searchParams.get("at");
    return raw === "half" ? "half" : "full";
  });

  const [unit, setUnit] = useState<Unit>(() => {
    const raw = searchParams.get("unit");
    return raw === "ft" ? "ft" : "m";
  });

  const [beamAngle, setBeamAngle] = useState(() => {
    const raw = searchParams.get("angle");
    const parsed = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? clampAngle(parsed) : 25;
  });

  const [throwDistance, setThrowDistance] = useState(() => {
    const raw = searchParams.get("dist");
    const parsed = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? clampPositive(parsed) : 5;
  });

  const [targetDiameter, setTargetDiameter] = useState(() => {
    const raw = searchParams.get("target");
    const parsed = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? clampPositive(parsed) : 2;
  });

  const syncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncUrl = (
    nextMode: Mode,
    nextAt: AngleType,
    nextUnit: Unit,
    nextAngle: number,
    nextDist: number,
    nextTarget: number,
  ) => {
    if (syncRef.current) clearTimeout(syncRef.current);
    syncRef.current = setTimeout(() => {
      const params = new URLSearchParams({
        mode: nextMode,
        at: nextAt,
        unit: nextUnit,
        angle: String(nextAngle),
        dist: String(nextDist),
        target: String(nextTarget),
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);
  };

  const results = useMemo(() => {
    // Convert to metres for calculation
    const distM = unit === "ft" ? throwDistance * FT_TO_M : throwDistance;
    const targetM = unit === "ft" ? targetDiameter * FT_TO_M : targetDiameter;

    // Full angle in degrees for calculation
    const fullAngleDeg = angleType === "half" ? beamAngle * 2 : beamAngle;
    const fullAngleRad = (fullAngleDeg / 2) * (Math.PI / 180);

    if (mode === "forward") {
      const diamM = 2 * distM * Math.tan(fullAngleRad);
      const areaM2 = Math.PI * Math.pow(diamM / 2, 2);
      const diam = unit === "ft" ? diamM / FT_TO_M : diamM;
      const area = unit === "ft" ? areaM2 / (FT_TO_M * FT_TO_M) : areaM2;
      return { mode: "forward" as const, diam, area };
    } else {
      // reverse: find min full angle
      if (distM <= 0 || targetM <= 0) {
        return { mode: "reverse" as const, minAngleDeg: 0 };
      }
      const minAngleRad = Math.atan(targetM / (2 * distM));
      const minAngleDeg = minAngleRad * (180 / Math.PI) * 2;
      return { mode: "reverse" as const, minAngleDeg };
    }
  }, [mode, angleType, unit, beamAngle, throwDistance, targetDiameter]);

  const unitLabel = unit === "m" ? "m" : "ft";
  const areaUnit = unit === "m" ? "m²" : "ft²";

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-6">
          <p className="text-title text-foreground">{tool.modeLabel}</p>
          <RadioGroup
            value={mode}
            onValueChange={(value) => {
              const next = value as Mode;
              setMode(next);
              syncUrl(next, angleType, unit, beamAngle, throwDistance, targetDiameter);
            }}
          >
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <RadioGroupItem value="forward" />
              {tool.modes.forward}
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <RadioGroupItem value="reverse" />
              {tool.modes.reverse}
            </label>
          </RadioGroup>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{tool.angleType}</p>
              <RadioGroup
                value={angleType}
                onValueChange={(value) => {
                  const next = value as AngleType;
                  setAngleType(next);
                  syncUrl(mode, next, unit, beamAngle, throwDistance, targetDiameter);
                }}
              >
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="full" />
                  {tool.angleTypes.full}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="half" />
                  {tool.angleTypes.half}
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{tool.unit}</p>
              <RadioGroup
                value={unit}
                onValueChange={(value) => {
                  const next = value as Unit;
                  setUnit(next);
                  syncUrl(mode, angleType, next, beamAngle, throwDistance, targetDiameter);
                }}
              >
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="m" />
                  {tool.units.m}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="ft" />
                  {tool.units.ft}
                </label>
              </RadioGroup>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mode === "forward" ? (
              <div className="space-y-2">
                <Label htmlFor="ba-angle">{tool.beamAngle}</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={179}
                    step={0.5}
                    value={beamAngle}
                    onChange={(event) => {
                      const next = clampAngle(Number(event.target.value));
                      setBeamAngle(next);
                      syncUrl(mode, angleType, unit, next, throwDistance, targetDiameter);
                    }}
                    className="w-full"
                  />
                  <Input
                    id="ba-angle"
                    type="number"
                    min={0}
                    max={179}
                    step={0.5}
                    value={beamAngle}
                    onChange={(event) => {
                      const next = clampAngle(Number(event.target.value));
                      setBeamAngle(next);
                      syncUrl(mode, angleType, unit, next, throwDistance, targetDiameter);
                    }}
                    className="w-24"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{tool.beamAngleHelp}</p>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="ba-dist">{tool.throwDistance} ({unitLabel})</Label>
              <Input
                id="ba-dist"
                type="number"
                min={0}
                step={0.1}
                value={throwDistance}
                onChange={(event) => {
                  const next = clampPositive(Number(event.target.value));
                  setThrowDistance(next);
                  syncUrl(mode, angleType, unit, beamAngle, next, targetDiameter);
                }}
              />
              <p className="text-xs text-muted-foreground">{tool.throwDistanceHelp}</p>
            </div>

            {mode === "reverse" ? (
              <div className="space-y-2">
                <Label htmlFor="ba-target">{tool.targetDiameter} ({unitLabel})</Label>
                <Input
                  id="ba-target"
                  type="number"
                  min={0}
                  step={0.1}
                  value={targetDiameter}
                  onChange={(event) => {
                    const next = clampPositive(Number(event.target.value));
                    setTargetDiameter(next);
                    syncUrl(mode, angleType, unit, beamAngle, throwDistance, next);
                  }}
                />
                <p className="text-xs text-muted-foreground">{tool.targetDiameterHelp}</p>
              </div>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-4">
          <p className="text-title text-foreground">{tool.resultsTitle}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.mode === "forward" ? (
              <>
                <div className="rounded-lg border border-border/40 bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {tool.beamDiameter}
                  </p>
                  <p className="mt-2 text-lg text-foreground">
                    {results.diam.toFixed(2)} {unitLabel}
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {tool.coverageArea}
                  </p>
                  <p className="mt-2 text-lg text-foreground">
                    {results.area.toFixed(2)} {areaUnit}
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-border/40 bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {tool.minAngle}
                </p>
                <p className="mt-2 text-lg text-foreground">
                  {results.minAngleDeg.toFixed(1)}°
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <ShareToolButton />
    </div>
  );
}
