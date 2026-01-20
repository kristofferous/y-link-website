"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionCard } from "@/components/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

type FixtureType = "rgb" | "rgbw" | "rgba" | "rgbwa" | "rgbwwcw";
type InputMode = "hexRgb" | "wheel" | "cct";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type ChannelKey = "r" | "g" | "b" | "w" | "ww" | "cw" | "a";

const WHITE_THRESHOLD = 0.08;
const SATURATION_CUTOFF = 0.65;
const WHITE_LIMIT = 0.7;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const clampChannel = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

const srgbToLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

const linearToSrgb = (value: number) =>
  value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

const rgbToHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase();

const parseHex = (value: string): Rgb | null => {
  const cleaned = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$/.test(cleaned) && !/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const hex =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;
  const number = Number.parseInt(hex, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
};

const rgbToHue = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  if (max === r) return ((g - b) / delta) * 60 + (g < b ? 360 : 0);
  if (max === g) return ((b - r) / delta) * 60 + 120;
  return ((r - g) / delta) * 60 + 240;
};

const rgbToSaturation = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
};

const cctToXy = (kelvin: number) => {
  const temp = clamp(kelvin, 1667, 25000);
  let x = 0;
  let y = 0;

  if (temp <= 4000) {
    x =
      -0.2661239 * 1e9 / Math.pow(temp, 3) -
      0.234358 * 1e6 / Math.pow(temp, 2) +
      0.8776956 * 1e3 / temp +
      0.17991;
  } else {
    x =
      -3.0258469 * 1e9 / Math.pow(temp, 3) +
      2.1070379 * 1e6 / Math.pow(temp, 2) +
      0.2226347 * 1e3 / temp +
      0.24039;
  }

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

const estimateCct = (r: number, g: number, b: number) => {
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  const sum = x + y + z;
  if (sum === 0) return 6500;
  const cx = x / sum;
  const cy = y / sum;
  const n = (cx - 0.332) / (0.1858 - cy);
  const cct = 449 * Math.pow(n, 3) + 3525 * Math.pow(n, 2) + 6823.3 * n + 5520.33;
  return clamp(cct, 2000, 9000);
};

const toDmx8 = (value: number) => Math.round(clamp(value) * 255);
const toDmx16 = (value: number) => Math.round(clamp(value) * 65535);

const toCoarseFine = (value16: number) => ({
  coarse: Math.floor(value16 / 256),
  fine: value16 % 256,
});

export function DmxColorTool() {
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.dmxColor.tool;

  const [fixtureType, setFixtureType] = useState<FixtureType>("rgbw");
  const [inputMode, setInputMode] = useState<InputMode>("hexRgb");
  const [hexInput, setHexInput] = useState("#FF7A66");
  const [rgb, setRgb] = useState<Rgb>({ r: 255, g: 122, b: 102 });
  const [cctInput, setCctInput] = useState("");
  const [cctIntensity, setCctIntensity] = useState(100);
  const [optimizeWhites, setOptimizeWhites] = useState(true);
  const [limitWhite, setLimitWhite] = useState(true);
  const [rgbOnly, setRgbOnly] = useState(false);
  const [outputMode, setOutputMode] = useState<"coarse" | "fine">("fine");

  const supportsWhite = fixtureType === "rgbw" || fixtureType === "rgbwa";
  const supportsWwCw = fixtureType === "rgbwwcw";
  const supportsAmber = fixtureType === "rgba" || fixtureType === "rgbwa";

  useEffect(() => {
    if (inputMode === "cct" && rgbOnly) {
      setRgbOnly(false);
    }
  }, [inputMode, rgbOnly]);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const parsed = parseHex(value);
    if (parsed) {
      setRgb(parsed);
      setHexInput(rgbToHex(parsed));
    }
  };

  const updateChannel = (channel: keyof Rgb, value: number) => {
    const next = { ...rgb, [channel]: clampChannel(value) };
    setRgb(next);
    setHexInput(rgbToHex(next));
  };

  const updateFromPicker = useCallback((value: number[]) => {
    const [r, g, b] = value;
    const next = {
      r: clampChannel(r),
      g: clampChannel(g),
      b: clampChannel(b),
    };
    setRgb(next);
    setHexInput(rgbToHex(next));
  }, []);

  const output = useMemo(() => {
    const intensity = clamp(cctIntensity / 100);
    const cctInputValue = cctInput.trim() ? Number(cctInput) : 3200;
    const clampedCct = Number.isFinite(cctInputValue) ? clamp(cctInputValue, 1800, 10000) : 3200;
    const cctLinear = cctToLinearRgb(clampedCct);

    const baseLinear =
      inputMode === "cct"
        ? {
            r: cctLinear.r * intensity,
            g: cctLinear.g * intensity,
            b: cctLinear.b * intensity,
          }
        : {
            r: srgbToLinear(clamp(rgb.r / 255)),
            g: srgbToLinear(clamp(rgb.g / 255)),
            b: srgbToLinear(clamp(rgb.b / 255)),
          };

    const baseSrgb =
      inputMode === "cct"
        ? {
            r: clamp(linearToSrgb(baseLinear.r)),
            g: clamp(linearToSrgb(baseLinear.g)),
            b: clamp(linearToSrgb(baseLinear.b)),
          }
        : {
            r: clamp(rgb.r / 255),
            g: clamp(rgb.g / 255),
            b: clamp(rgb.b / 255),
          };

    const linear = baseLinear;

    const maxLinear = Math.max(linear.r, linear.g, linear.b);
    const minLinear = Math.min(linear.r, linear.g, linear.b);
    const neutral = minLinear;
    const saturation = maxLinear === 0 ? 0 : (maxLinear - minLinear) / maxLinear;
    const canOptimize = optimizeWhites && !rgbOnly && inputMode !== "cct";
    const shouldUseWhite = canOptimize && neutral > WHITE_THRESHOLD && saturation < SATURATION_CUTOFF;
    const whiteScale = limitWhite ? WHITE_LIMIT : 1;

    let outR = linear.r;
    let outG = linear.g;
    let outB = linear.b;
    let outW = 0;
    let outWw = 0;
    let outCw = 0;
    let outA = 0;
    let cctValue: number | null = null;
    let cctMode = false;

    if (inputMode === "cct" && supportsWwCw) {
      cctValue = clampedCct;
      cctMode = !rgbOnly;
    }

    if (supportsWwCw && cctMode && cctValue) {
      const scaledIntensity = intensity * whiteScale;
      outR = 0;
      outG = 0;
      outB = 0;
      const weights = mixWwCw(cctValue);
      outWw = scaledIntensity * weights.warmWeight;
      outCw = scaledIntensity * weights.coolWeight;
    } else {
      if (supportsWwCw && shouldUseWhite) {
        const baseCct = estimateCct(linear.r, linear.g, linear.b);
        const neutralScaled = neutral * whiteScale;
        outR = Math.max(0, outR - neutralScaled);
        outG = Math.max(0, outG - neutralScaled);
        outB = Math.max(0, outB - neutralScaled);
        const weights = mixWwCw(baseCct);
        outWw = neutralScaled * weights.warmWeight;
        outCw = neutralScaled * weights.coolWeight;
      }

      if (supportsWhite && shouldUseWhite) {
        const neutralScaled = neutral * whiteScale;
        outW = neutralScaled;
        outR = Math.max(0, outR - neutralScaled);
        outG = Math.max(0, outG - neutralScaled);
        outB = Math.max(0, outB - neutralScaled);
      }

      if (supportsAmber && canOptimize) {
        const hue = rgbToHue(baseSrgb.r, baseSrgb.g, baseSrgb.b);
        const saturationRgb = rgbToSaturation(baseSrgb.r, baseSrgb.g, baseSrgb.b);
        if (hue >= 20 && hue <= 60 && saturationRgb > 0.2) {
          const amberFactor = 1 - Math.abs(hue - 40) / 20;
          const amberAmount = Math.min(outR, outG) * amberFactor * 0.6;
          outA = amberAmount;
          outR = Math.max(0, outR - amberAmount * 0.5);
          outG = Math.max(0, outG - amberAmount * 0.5);
        }
      }
    }

    const channels = {
      r: clamp(linearToSrgb(outR)),
      g: clamp(linearToSrgb(outG)),
      b: clamp(linearToSrgb(outB)),
      w: clamp(linearToSrgb(outW)),
      ww: clamp(linearToSrgb(outWw)),
      cw: clamp(linearToSrgb(outCw)),
      a: clamp(linearToSrgb(outA)),
    };

    return {
      channels,
      cctMode,
      cctInputActive: inputMode === "cct",
      cctUsesWhite: supportsWwCw,
    };
  }, [
    rgb,
    cctInput,
    cctIntensity,
    fixtureType,
    inputMode,
    optimizeWhites,
    limitWhite,
    rgbOnly,
    supportsWhite,
    supportsWwCw,
    supportsAmber,
  ]);

  const channelList = useMemo(() => {
    const labels = tool.channels;
    const list: Array<{ key: ChannelKey; label: string }> = [];
    const push = (key: ChannelKey, label: string) => list.push({ key, label });
    push("r", labels.red);
    push("g", labels.green);
    push("b", labels.blue);
    if (supportsWhite) push("w", labels.white);
    if (supportsWwCw) {
      push("ww", labels.warmWhite);
      push("cw", labels.coolWhite);
    }
    if (supportsAmber) push("a", labels.amber);
    return list;
  }, [tool.channels, supportsWhite, supportsWwCw, supportsAmber]);

  const previewRgb =
    inputMode === "cct"
      ? (() => {
          const cctValue = cctInput.trim() ? Number(cctInput) : 3200;
          const clampedCct = Number.isFinite(cctValue) ? clamp(cctValue, 1800, 10000) : 3200;
          const linearRgb = cctToLinearRgb(clampedCct);
          const intensity = clamp(cctIntensity / 100);
          return {
            r: clampChannel(linearToSrgb(linearRgb.r * intensity) * 255),
            g: clampChannel(linearToSrgb(linearRgb.g * intensity) * 255),
            b: clampChannel(linearToSrgb(linearRgb.b * intensity) * 255),
          };
        })()
      : rgb;
  const previewHex = rgbToHex(previewRgb);
  const swatchStyle = {
    backgroundColor: `rgb(${previewRgb.r}, ${previewRgb.g}, ${previewRgb.b})`,
  };

  const showOptimization = (supportsWhite || supportsWwCw || supportsAmber) && inputMode !== "cct";
  const optimizationDisabled = rgbOnly;
  const showLimitWhite = supportsWhite || supportsWwCw;
  const whiteLimitDisabled = optimizationDisabled;
  const showRgbOnly = (supportsWhite || supportsWwCw || supportsAmber) && inputMode !== "cct";

  return (
    <SectionCard>
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-title text-foreground">{tool.inputs.title}</p>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{tool.inputs.modeLabel}</p>
              <RadioGroup value={inputMode} onValueChange={(value) => setInputMode(value as InputMode)}>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="hexRgb" />
                  {tool.inputs.modes.hexRgb}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="wheel" />
                  {tool.inputs.modes.wheel}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="cct" />
                  {tool.inputs.modes.cct}
                </label>
              </RadioGroup>
            </div>
            {inputMode === "hexRgb" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dmx-color-hex">{tool.inputs.hexLabel}</Label>
                  <Input
                    id="dmx-color-hex"
                    value={hexInput}
                    onChange={(event) => handleHexChange(event.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">{tool.inputs.rgbLabel}</p>
                  {(["r", "g", "b"] as const).map((channel) => (
                    <div key={channel} className="space-y-2">
                      <Label htmlFor={`dmx-color-${channel}`}>{tool.inputs[channel]}</Label>
                      <div className="flex items-center gap-3">
                        <input
                          id={`dmx-color-${channel}`}
                          type="range"
                          min={0}
                          max={255}
                          value={rgb[channel]}
                          onChange={(event) => updateChannel(channel, Number(event.target.value))}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          min={0}
                          max={255}
                          value={rgb[channel]}
                          onChange={(event) => updateChannel(channel, Number(event.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
            {inputMode === "wheel" ? (
              <div className="space-y-3">
                <Label htmlFor="dmx-color-wheel">{tool.inputs.colorWheelLabel}</Label>
                <div className="space-y-4 rounded-lg border border-border/40 bg-background p-4">
                  <ColorPicker defaultValue={hexInput} onChange={updateFromPicker}>
                    <ColorPickerSelection className="aspect-square w-full" />
                    <div className="space-y-3">
                      <ColorPickerHue />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <ColorPickerOutput />
                      <ColorPickerFormat className="flex-1" />
                      <ColorPickerEyeDropper />
                    </div>
                  </ColorPicker>
                </div>
                <p className="text-xs text-muted-foreground">{tool.inputs.colorWheelHelp}</p>
              </div>
            ) : null}
            {inputMode === "cct" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dmx-color-cct">{tool.inputs.cctLabel}</Label>
                  <Input
                    id="dmx-color-cct"
                    type="number"
                    min={1800}
                    max={10000}
                    value={cctInput}
                    onChange={(event) => setCctInput(event.target.value)}
                    placeholder="e.g. 3200"
                  />
                  <p className="text-xs text-muted-foreground">{tool.inputs.cctHelp}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dmx-color-cct-intensity">{tool.inputs.cctIntensity}</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="dmx-color-cct-intensity"
                      type="range"
                      min={0}
                      max={100}
                      value={cctIntensity}
                      onChange={(event) => setCctIntensity(Number(event.target.value))}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={cctIntensity}
                      onChange={(event) => setCctIntensity(Number(event.target.value))}
                      className="w-24"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.inputs.cctIntensityHelp}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <p className="text-title text-foreground">{tool.options.title}</p>
            <div className="space-y-2">
              <Label htmlFor="dmx-color-fixture">{tool.options.fixtureType}</Label>
              <Select value={fixtureType} onValueChange={(value) => setFixtureType(value as FixtureType)}>
                <SelectTrigger id="dmx-color-fixture" className="w-full">
                  <SelectValue placeholder={tool.options.fixturePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rgb">{tool.options.fixtures.rgb}</SelectItem>
                  <SelectItem value="rgbw">{tool.options.fixtures.rgbw}</SelectItem>
                  <SelectItem value="rgba">{tool.options.fixtures.rgba}</SelectItem>
                  <SelectItem value="rgbwa">{tool.options.fixtures.rgbwa}</SelectItem>
                  <SelectItem value="rgbwwcw">{tool.options.fixtures.rgbwwcw}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showOptimization || showRgbOnly ? (
              <div className="rounded-lg border border-border/40 bg-background p-4">
                {showOptimization ? (
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{tool.options.optimizeWhites}</p>
                      <p className="text-xs text-muted-foreground">{tool.options.optimizeWhitesHelp}</p>
                    </div>
                    <Switch
                      checked={optimizeWhites}
                      onCheckedChange={setOptimizeWhites}
                      disabled={optimizationDisabled}
                    />
                  </div>
                ) : null}
                {showLimitWhite ? (
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{tool.options.limitWhite}</p>
                      <p className="text-xs text-muted-foreground">{tool.options.limitWhiteHelp}</p>
                    </div>
                    <Switch checked={limitWhite} onCheckedChange={setLimitWhite} disabled={whiteLimitDisabled} />
                  </div>
                ) : null}
                {showRgbOnly ? (
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{tool.options.rgbOnly}</p>
                      <p className="text-xs text-muted-foreground">{tool.options.rgbOnlyHelp}</p>
                    </div>
                    <Switch checked={rgbOnly} onCheckedChange={setRgbOnly} />
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{tool.options.outputMode}</p>
              <RadioGroup value={outputMode} onValueChange={(value) => setOutputMode(value as "coarse" | "fine")}>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="coarse" />
                  {tool.options.outputModes.coarse}
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RadioGroupItem value="fine" />
                  {tool.options.outputModes.fine}
                </label>
              </RadioGroup>
            </div>
            <div className="rounded-lg border border-border/40 bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tool.options.previewLabel}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md border border-border/40" style={swatchStyle} />
                <div className="text-sm text-muted-foreground">
                  {tool.options.previewValue}: <span className="text-foreground">{previewHex}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {output.cctInputActive ? (
          <p className="text-xs text-muted-foreground">
            {output.cctUsesWhite ? tool.notices.cctOverride : tool.notices.cctRgbBlend}
          </p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{tool.outputs.title8}</p>
            <div className="mt-3 overflow-hidden rounded-md border border-border/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">{tool.outputs.channelLabel}</th>
                    <th className="px-3 py-2">{tool.outputs.value8Label}</th>
                  </tr>
                </thead>
                <tbody>
                  {channelList.map((channel) => {
                    const value8 = toDmx8(output.channels[channel.key]);
                    return (
                      <tr key={channel.key} className="border-t border-border/40">
                        <td className="px-3 py-2 text-muted-foreground">{channel.label}</td>
                        <td className="px-3 py-2 text-foreground">{value8}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-border/40 bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{tool.outputs.title16}</p>
            <div className="mt-3 overflow-hidden rounded-md border border-border/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">{tool.outputs.channelLabel}</th>
                    <th className="px-3 py-2">{tool.outputs.value16Label}</th>
                    <th className="px-3 py-2">{tool.outputs.coarseLabel}</th>
                    {outputMode === "fine" ? <th className="px-3 py-2">{tool.outputs.fineLabel}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {channelList.map((channel) => {
                    const value16 = toDmx16(output.channels[channel.key]);
                    const { coarse, fine } = toCoarseFine(value16);
                    return (
                      <tr key={channel.key} className="border-t border-border/40">
                        <td className="px-3 py-2 text-muted-foreground">{channel.label}</td>
                        <td className="px-3 py-2 text-foreground">{value16}</td>
                        <td className="px-3 py-2 text-foreground">{coarse}</td>
                        {outputMode === "fine" ? <td className="px-3 py-2 text-foreground">{fine}</td> : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
