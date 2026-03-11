"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionCard } from "@/components/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShareToolButton } from "@/components/tools/ShareToolButton";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

type FixtureType = "rgb" | "rgbw" | "rgbwwcw";

// --- CCT math (inlined from DmxColorTool logic) ---

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const linearToSrgb = (value: number) =>
  value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

const cctToXy = (kelvin: number) => {
  const temp = clamp(kelvin, 1667, 25000);
  let x = 0;

  if (temp <= 4000) {
    x =
      (-0.2661239 * 1e9) / Math.pow(temp, 3) -
      (0.234358 * 1e6) / Math.pow(temp, 2) +
      (0.8776956 * 1e3) / temp +
      0.17991;
  } else {
    x =
      (-3.0258469 * 1e9) / Math.pow(temp, 3) +
      (2.1070379 * 1e6) / Math.pow(temp, 2) +
      (0.2226347 * 1e3) / temp +
      0.24039;
  }

  let y = 0;
  if (temp <= 2222) {
    y = -1.1063814 * Math.pow(x, 3) - 1.3481102 * Math.pow(x, 2) + 2.1855583 * x - 0.20219683;
  } else if (temp <= 4000) {
    y = -0.9549476 * Math.pow(x, 3) - 1.37418593 * Math.pow(x, 2) + 2.09137015 * x - 0.16748867;
  } else {
    y = 3.081758 * Math.pow(x, 3) - 5.8733867 * Math.pow(x, 2) + 3.75112997 * x - 0.37001483;
  }

  return { x, y };
};

const xyToLinearRgb = (x: number, y: number, Y = 1) => {
  const X = (x * Y) / y;
  const Z = ((1 - x - y) * Y) / y;
  let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
  let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
  let b = X * 0.0557 + Y * -0.204 + Z * 1.057;
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  const max = Math.max(r, g, b);
  if (max > 1) {
    r /= max;
    g /= max;
    b /= max;
  }
  return { r, g, b };
};

const cctToLinearRgb = (kelvin: number) => {
  const { x, y } = cctToXy(kelvin);
  return xyToLinearRgb(x, y);
};

const mixWwCw = (kelvin: number) => {
  const warm = 2700;
  const cool = 6500;
  const mired = 1e6 / clamp(kelvin, 1800, 10000);
  const miredWarm = 1e6 / warm;
  const miredCool = 1e6 / cool;
  const warmWeight = clamp((mired - miredCool) / (miredWarm - miredCool));
  return { warmWeight, coolWeight: 1 - warmWeight };
};

const toDmx = (value: number) => Math.round(clamp(value) * 255);

type DescriptionKey =
  | "candlelight"
  | "lateGolden"
  | "earlyGolden"
  | "tungsten"
  | "warmWhite"
  | "neutralWarm"
  | "neutralWhite"
  | "coolWhite"
  | "daylight"
  | "coolDaylight"
  | "overcastSky";

const getDescriptionKey = (kelvin: number): DescriptionKey => {
  if (kelvin < 1800) return "candlelight";
  if (kelvin < 2200) return "lateGolden";
  if (kelvin < 2700) return "earlyGolden";
  if (kelvin < 3000) return "tungsten";
  if (kelvin < 3500) return "warmWhite";
  if (kelvin < 4000) return "neutralWarm";
  if (kelvin < 5000) return "neutralWhite";
  if (kelvin < 5600) return "coolWhite";
  if (kelvin < 6500) return "daylight";
  if (kelvin < 8000) return "coolDaylight";
  return "overcastSky";
};

const KELVIN_MIN = 1000;
const KELVIN_MAX = 10000;
const KELVIN_STEP = 100;

export function KelvinToDmxTool() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.kelvinToDmx.tool;

  const [kelvin, setKelvin] = useState(() => {
    const raw = searchParams.get("k");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed)
      ? Math.min(KELVIN_MAX, Math.max(KELVIN_MIN, parsed))
      : 3200;
  });

  const [fixtureType, setFixtureType] = useState<FixtureType>(() => {
    const raw = searchParams.get("type");
    const valid: FixtureType[] = ["rgb", "rgbw", "rgbwwcw"];
    return valid.includes(raw as FixtureType) ? (raw as FixtureType) : "rgb";
  });

  const syncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncUrl = (k: number, type: FixtureType) => {
    if (syncRef.current) clearTimeout(syncRef.current);
    syncRef.current = setTimeout(() => {
      const params = new URLSearchParams({ k: String(k), type });
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 500);
  };

  const output = useMemo(() => {
    const linear = cctToLinearRgb(kelvin);
    const rSrgb = clamp(linearToSrgb(linear.r));
    const gSrgb = clamp(linearToSrgb(linear.g));
    const bSrgb = clamp(linearToSrgb(linear.b));

    const rDmx = toDmx(rSrgb);
    const gDmx = toDmx(gSrgb);
    const bDmx = toDmx(bSrgb);

    const rHex = rDmx.toString(16).padStart(2, "0");
    const gHex = gDmx.toString(16).padStart(2, "0");
    const bHex = bDmx.toString(16).padStart(2, "0");
    const hex = `#${rHex}${gHex}${bHex}`.toUpperCase();

    let wDmx = 0;
    let wwDmx = 0;
    let cwDmx = 0;

    // Adjust RGB when using white channels
    let rOut = rSrgb;
    let gOut = gSrgb;
    let bOut = bSrgb;

    if (fixtureType === "rgbw") {
      // For RGBW: extract white as min(r,g,b), subtract from RGB
      const minVal = Math.min(rSrgb, gSrgb, bSrgb);
      wDmx = toDmx(minVal);
      rOut = rSrgb - minVal;
      gOut = gSrgb - minVal;
      bOut = bSrgb - minVal;
    } else if (fixtureType === "rgbwwcw") {
      // For RGBWW/CW: pure CCT mode — use WW/CW only
      const weights = mixWwCw(kelvin);
      wwDmx = toDmx(weights.warmWeight);
      cwDmx = toDmx(weights.coolWeight);
      rOut = 0;
      gOut = 0;
      bOut = 0;
    }

    const rFinalDmx = fixtureType === "rgb" ? rDmx : toDmx(rOut);
    const gFinalDmx = fixtureType === "rgb" ? gDmx : toDmx(gOut);
    const bFinalDmx = fixtureType === "rgb" ? bDmx : toDmx(bOut);

    return {
      hex,
      previewRgb: { r: rDmx, g: gDmx, b: bDmx },
      channels: {
        r: rFinalDmx,
        g: gFinalDmx,
        b: bFinalDmx,
        w: wDmx,
        ww: wwDmx,
        cw: cwDmx,
      },
    };
  }, [kelvin, fixtureType]);

  const descriptionKey = getDescriptionKey(kelvin);
  const description = tool.descriptions[descriptionKey];

  const channelRows = useMemo(() => {
    const rows: Array<{ key: string; label: string; value: number }> = [
      { key: "r", label: tool.channels.r, value: output.channels.r },
      { key: "g", label: tool.channels.g, value: output.channels.g },
      { key: "b", label: tool.channels.b, value: output.channels.b },
    ];
    if (fixtureType === "rgbw") {
      rows.push({ key: "w", label: tool.channels.w, value: output.channels.w });
    }
    if (fixtureType === "rgbwwcw") {
      rows.push({ key: "ww", label: tool.channels.ww, value: output.channels.ww });
      rows.push({ key: "cw", label: tool.channels.cw, value: output.channels.cw });
    }
    return rows;
  }, [fixtureType, output.channels, tool.channels]);

  const swatchStyle = {
    backgroundColor: `rgb(${output.previewRgb.r}, ${output.previewRgb.g}, ${output.previewRgb.b})`,
  };

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kdmx-kelvin">{tool.kelvinLabel}</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={KELVIN_MIN}
                    max={KELVIN_MAX}
                    step={KELVIN_STEP}
                    value={kelvin}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setKelvin(next);
                      syncUrl(next, fixtureType);
                    }}
                    className="w-full"
                  />
                  <Input
                    id="kdmx-kelvin"
                    type="number"
                    min={KELVIN_MIN}
                    max={KELVIN_MAX}
                    step={KELVIN_STEP}
                    value={kelvin}
                    onChange={(event) => {
                      const parsed = parseInt(event.target.value, 10);
                      const next = Number.isFinite(parsed)
                        ? Math.min(KELVIN_MAX, Math.max(KELVIN_MIN, parsed))
                        : kelvin;
                      setKelvin(next);
                      syncUrl(next, fixtureType);
                    }}
                    className="w-28"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{tool.kelvinHelp}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kdmx-fixture">{tool.fixtureType}</Label>
                <Select
                  value={fixtureType}
                  onValueChange={(value) => {
                    const next = value as FixtureType;
                    setFixtureType(next);
                    syncUrl(kelvin, next);
                  }}
                >
                  <SelectTrigger id="kdmx-fixture" className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rgb">{tool.fixtureTypes.rgb}</SelectItem>
                    <SelectItem value="rgbw">{tool.fixtureTypes.rgbw}</SelectItem>
                    <SelectItem value="rgbwwcw">{tool.fixtureTypes.rgbwwcw}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">{tool.swatchLabel}</p>
              <div className="h-24 w-full rounded-lg border border-border/40" style={swatchStyle} />
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {tool.descriptionLabel}
                </p>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-sm text-foreground">{output.hex}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-4">
          <p className="text-title text-foreground">{tool.resultsTitle}</p>
          <div className="overflow-hidden rounded-md border border-border/40">
            <table className="w-full text-left text-sm">
              <thead className="bg-card text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">{tool.channel}</th>
                  <th className="px-3 py-2">{tool.dmxValue}</th>
                </tr>
              </thead>
              <tbody>
                {channelRows.map((row) => (
                  <tr key={row.key} className="border-t border-border/40">
                    <td className="px-3 py-2 text-muted-foreground">{row.label}</td>
                    <td className="px-3 py-2 text-foreground">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <ShareToolButton />
    </div>
  );
}
