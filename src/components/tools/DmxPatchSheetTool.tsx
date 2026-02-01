"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionCard } from "@/components/SectionCard";
import { useTranslations } from "@/lib/i18n/TranslationProvider";

type FixtureRow = {
  id: string;
  name: string;
  channelCount: number;
  quantity: number;
};

type PatchRow = {
  fixtureLabel: string;
  fixtureName: string;
  indexLabel: string;
  universe: number;
  address: number;
  addressLabel: string;
  channels: number;
};

type Settings = {
  startUniverse: number;
  startAddress: number;
  channelsPerUniverse: number;
};

type PrintMode = "patch" | "labels";
type PrintIntent = "print" | "pdf";

type ImportedPatchRow = {
  name: string;
  channels: number;
  universe: number;
  address: number;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fixture-${Math.random().toString(16).slice(2)}`;
};

const clampInt = (value: number, min = 1) => {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.floor(value));
};

const padNumber = (value: number, width: number) => String(value).padStart(width, "0");

const escapeCsv = (value: string | number) => {
  const text = String(value);
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/\"/g, "\"\"")}"`;
  }
  return text;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export function DmxPatchSheetTool() {
  const { dictionary } = useTranslations();
  const tool = dictionary.tools.dmxPatch.tool;
  const searchParams = useSearchParams();
  const importAppliedRef = useRef(false);

  const [settings, setSettings] = useState<Settings>({
    startUniverse: 1,
    startAddress: 1,
    channelsPerUniverse: 512,
  });

  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    {
      id: createId(),
      name: tool.defaults.sampleName,
      channelCount: 13,
      quantity: 2,
    },
  ]);

  const [duplicateCount, setDuplicateCount] = useState(1);
  const [patchRows, setPatchRows] = useState<PatchRow[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [csvOrder, setCsvOrder] = useState<"fixture" | "universe">("fixture");
  const [exportGrouping, setExportGrouping] = useState<"continuous" | "universe">("continuous");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const fixturePadById = useMemo(() => {
    const map = new Map<string, number>();
    fixtures.forEach((fixture) => {
      map.set(fixture.id, Math.max(2, String(clampInt(fixture.quantity)).length));
    });
    return map;
  }, [fixtures]);

  useEffect(() => {
    if (importAppliedRef.current) return;
    const importParam = searchParams.get("import");
    if (!importParam) return;

    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(importParam)))) as ImportedPatchRow[];
      if (!Array.isArray(decoded) || decoded.length === 0) return;

      const entries = decoded
        .filter((row) => row && typeof row.name === "string")
        .map((row) => ({
          name: row.name.trim() || tool.defaults.fallbackName,
          channels: clampInt(Number(row.channels || 1)),
          universe: clampInt(Number(row.universe || 1)),
          address: clampInt(Number(row.address || 1)),
        }))
        .filter((row) => row.channels > 0);

      if (entries.length === 0) return;

      const grouped = new Map<string, { name: string; channels: number; count: number }>();
      entries.forEach((entry) => {
        const key = `${entry.name}__${entry.channels}`;
        const current = grouped.get(key);
        if (current) {
          current.count += 1;
        } else {
          grouped.set(key, { name: entry.name, channels: entry.channels, count: 1 });
        }
      });

      const nextFixtures: FixtureRow[] = Array.from(grouped.values()).map((entry) => ({
        id: createId(),
        name: entry.name,
        channelCount: entry.channels,
        quantity: entry.count,
      }));

      const nameCounts = new Map<string, number>();
      const nameTotals = new Map<string, number>();
      entries.forEach((entry) => {
        nameTotals.set(entry.name, (nameTotals.get(entry.name) ?? 0) + 1);
      });
      const nextRows = entries
        .sort((a, b) => (a.universe - b.universe) || (a.address - b.address))
        .map((entry) => {
          const nextCount = (nameCounts.get(entry.name) ?? 0) + 1;
          nameCounts.set(entry.name, nextCount);
          const padWidth = Math.max(2, String(nameTotals.get(entry.name) ?? nextCount).length);
          const indexLabel = padNumber(nextCount, padWidth);
          return {
            fixtureLabel: `${entry.name} ${indexLabel}`,
            fixtureName: entry.name,
            indexLabel,
            universe: entry.universe,
            address: entry.address,
            addressLabel: padNumber(entry.address, 3),
            channels: entry.channels,
          };
        });

      setSettings({ startUniverse: 1, startAddress: 1, channelsPerUniverse: 512 });
      setFixtures(nextFixtures.length > 0 ? nextFixtures : fixtures);
      setPatchRows(nextRows);
      setWarnings([]);
      importAppliedRef.current = true;
    } catch {
      // Ignore import errors.
    }
  }, [fixtures, searchParams, tool.defaults.fallbackName]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    const channelsPerUniverse = clampInt(settings.channelsPerUniverse, 1);
    const startAddress = clampInt(settings.startAddress);

    if (startAddress > channelsPerUniverse) {
      errors.push(tool.validation.startAddressTooHigh);
    }

    fixtures.forEach((fixture) => {
      if (clampInt(fixture.channelCount) > channelsPerUniverse) {
        errors.push(
          tool.validation.fixtureTooLarge
            .replace("{name}", fixture.name.trim() || tool.defaults.fallbackName)
            .replace("{channels}", String(channelsPerUniverse)),
        );
      }
      if (fixture.name.trim().length === 0) {
        errors.push(tool.validation.missingName);
      }
    });

    return Array.from(new Set(errors));
  }, [fixtures, settings, tool]);

  const updateFixture = (id: string, patch: Partial<FixtureRow>) => {
    setFixtures((current) => current.map((fixture) => (fixture.id === id ? { ...fixture, ...patch } : fixture)));
  };

  const addFixture = () => {
    setFixtures((current) => [
      ...current,
      {
        id: createId(),
        name: tool.defaults.newName,
        channelCount: 1,
        quantity: 1,
      },
    ]);
  };

  const duplicateFixture = (fixture: FixtureRow) => {
    const count = clampInt(duplicateCount);
    const copies = Array.from({ length: count }, () => ({
      ...fixture,
      id: createId(),
    }));
    setFixtures((current) => [...current, ...copies]);
  };

  const removeFixture = (id: string) => {
    setFixtures((current) => current.filter((fixture) => fixture.id !== id));
  };

  const generatePatch = () => {
    const nextWarnings: string[] = [];
    const sanitizedSettings = {
      startUniverse: clampInt(settings.startUniverse),
      startAddress: clampInt(settings.startAddress),
      channelsPerUniverse: clampInt(settings.channelsPerUniverse, 1),
    };

    if (sanitizedSettings.startAddress > sanitizedSettings.channelsPerUniverse) {
      nextWarnings.push(tool.warnings.startAddressTooHigh);
      sanitizedSettings.startAddress = 1;
    }

    let universe = sanitizedSettings.startUniverse;
    let address = sanitizedSettings.startAddress;
    const rows: PatchRow[] = [];

    fixtures.forEach((fixture) => {
      const channels = clampInt(fixture.channelCount);
      const quantity = clampInt(fixture.quantity);
      const padWidth = fixturePadById.get(fixture.id) ?? 2;
      const baseName = fixture.name.trim() || tool.defaults.fallbackName;

      if (channels > sanitizedSettings.channelsPerUniverse) {
        nextWarnings.push(
          tool.warnings.fixtureTooLarge
            .replace("{name}", baseName)
            .replace("{channels}", String(sanitizedSettings.channelsPerUniverse)),
        );
      }

      for (let index = 1; index <= quantity; index += 1) {
        if (address + channels - 1 > sanitizedSettings.channelsPerUniverse) {
          universe += 1;
          address = 1;
        }

        const indexLabel = padNumber(index, padWidth);
        const addressLabel = padNumber(address, 3);
        const fixtureLabel = `${baseName} ${indexLabel}`;

        rows.push({
          fixtureLabel,
          fixtureName: baseName,
          indexLabel,
          universe,
          address,
          addressLabel,
          channels,
        });

        address += channels;
      }
    });

    setWarnings(nextWarnings);
    setPatchRows(rows);
  };

  const downloadCsv = () => {
    if (patchRows.length === 0) return;
    const fixtureFirstHeader = [
      tool.table.fixture,
      tool.table.index,
      tool.table.universe,
      tool.table.address,
      tool.table.channels,
    ];
    const universeFirstHeader = [
      tool.table.universe,
      tool.table.address,
      tool.table.fixture,
      tool.table.index,
      tool.table.channels,
    ];
    const header = csvOrder === "fixture" ? fixtureFirstHeader : universeFirstHeader;
    const rows =
      csvOrder === "fixture"
        ? patchRows.map((row) => [
            row.fixtureLabel,
            row.indexLabel,
            row.universe,
            row.addressLabel,
            row.channels,
          ])
        : patchRows.map((row) => [
            row.universe,
            row.addressLabel,
            row.fixtureLabel,
            row.indexLabel,
            row.channels,
          ]);
    const csv = `\uFEFF${[header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = tool.actions.csvName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyLabelList = async () => {
    if (patchRows.length === 0) return;
    const text = patchRows
      .map((row) => `${row.fixtureLabel} -> U${row.universe} / ${row.addressLabel}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const buildPatchPrintHtml = (
    pages: Array<{ universe?: number; rows: PatchRow[] }>,
    logoSrc: string,
  ) => {
    const title = escapeHtml(tool.print.patchTitle);
    const subtitle = escapeHtml(tool.print.patchSubtitle);
    return pages
      .map((page) => {
        const universeLabel =
          typeof page.universe === "number"
            ? escapeHtml(tool.print.universeLabel.replace("{universe}", String(page.universe)))
            : "";
        return `
          <div class="page">
            <img src="${logoSrc}" alt="Y-Link" class="logo logo--patch" />
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
            ${universeLabel ? `<div class="universe">${universeLabel}</div>` : ""}
            <table>
              <thead>
                <tr>
                  <th>${escapeHtml(tool.table.fixture)}</th>
                  <th>${escapeHtml(tool.table.index)}</th>
                  <th>${escapeHtml(tool.table.universe)}</th>
                  <th>${escapeHtml(tool.table.address)}</th>
                  <th>${escapeHtml(tool.table.channels)}</th>
                </tr>
              </thead>
              <tbody>
                ${page.rows
                  .map(
                    (row) => `
                      <tr>
                        <td>${escapeHtml(row.fixtureLabel)}</td>
                        <td>${escapeHtml(row.indexLabel)}</td>
                        <td>${row.universe}</td>
                        <td>${escapeHtml(row.addressLabel)}</td>
                        <td>${row.channels}</td>
                      </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`;
      })
      .join("");
  };

  const buildLabelPrintHtml = (pages: Array<{ universe?: number; rows: PatchRow[] }>, logoSrc: string) => {
    const title = escapeHtml(tool.print.labelsTitle);
    const subtitle = escapeHtml(tool.print.labelsSubtitle);
    return pages
      .map((page) => {
        const universeLabel =
          typeof page.universe === "number"
            ? escapeHtml(tool.print.universeLabel.replace("{universe}", String(page.universe)))
            : "";
        return `
          <div class="page">
            <img src="${logoSrc}" alt="Y-Link" class="logo logo--labels" />
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
            ${universeLabel ? `<div class="universe">${universeLabel}</div>` : ""}
            <div class="label-grid">
              ${page.rows
                .map(
                  (row) => `
                    <div class="label">
                      <div class="label-name">${escapeHtml(row.fixtureLabel)}</div>
                      <div class="label-address">U${row.universe} / ${escapeHtml(row.addressLabel)}</div>
                    </div>`,
                )
                .join("")}
            </div>
          </div>`;
      })
      .join("");
  };

  const openPrintView = (mode: PrintMode, intent: PrintIntent) => {
    if (patchRows.length === 0) return;
    if (isPrinting) return;
    setIsPrinting(true);
    const dateStamp = new Date().toISOString().slice(0, 10);
    const docTitle =
      mode === "patch" ? `dmx-patch-sheet_${dateStamp}` : `dmx-labels_${dateStamp}`;
    const origin = window.location.origin;
    const logoSrc = `${origin}/Y-Link-Logo.png`;
    const escapedRows = patchRows.map((row) => ({
      fixtureLabel: row.fixtureLabel,
      indexLabel: row.indexLabel,
      universe: row.universe,
      addressLabel: row.addressLabel,
      channels: row.channels,
    }));
    const rowsByUniverse = escapedRows.reduce<Map<number, PatchRow[]>>((map, row) => {
      const group = map.get(row.universe) ?? [];
      group.push(row);
      map.set(row.universe, group);
      return map;
    }, new Map());
    const patchPages =
      exportGrouping === "universe"
        ? Array.from(rowsByUniverse.entries()).map(([universe, rows]) => ({ universe, rows }))
        : [{ rows: escapedRows }];
    const labelPagesByUniverse: Array<{ universe?: number; rows: PatchRow[] }> = [];
    if (exportGrouping === "universe") {
      rowsByUniverse.forEach((rows, universe) => {
        for (let index = 0; index < rows.length; index += 24) {
          labelPagesByUniverse.push({ universe, rows: rows.slice(index, index + 24) });
        }
      });
    } else {
      for (let index = 0; index < escapedRows.length; index += 24) {
        labelPagesByUniverse.push({ rows: escapedRows.slice(index, index + 24) });
      }
    }

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex" />
          <title>${escapeHtml(docTitle)}</title>
          <style>
            @page { size: A4; margin: 10mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #000;
              background: #fff;
            }
            .page { page-break-after: always; }
            .page:last-child { page-break-after: auto; }
            .logo { height: auto; margin-bottom: 6mm; }
            .logo--patch { width: 30mm; }
            .logo--labels { width: 25mm; }
            .title { font-size: 16px; font-weight: 600; margin-bottom: 4mm; }
            .subtitle { font-size: 12px; margin-bottom: 8mm; }
            .universe { font-size: 12px; font-weight: 600; margin-bottom: 6mm; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            thead { display: table-header-group; }
            th, td { border: 1px solid #111; padding: 4px 6px; text-align: left; }
            th:nth-child(4),
            td:nth-child(4) {
              font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            }
            .label-grid {
              display: grid;
              grid-template-columns: repeat(3, 61mm);
              grid-auto-rows: 28mm;
              column-gap: 3mm;
              row-gap: 3mm;
              min-height: calc(8 * 28mm + 7 * 3mm);
            }
            body.mode-labels .logo { margin-bottom: 3mm; }
            body.mode-labels .title { font-size: 12px; margin-bottom: 2mm; }
            body.mode-labels .subtitle { font-size: 10px; margin-bottom: 4mm; }
            body.mode-labels .universe { font-size: 10px; margin-bottom: 3mm; }
            body.mode-labels .label-grid {
              grid-template-columns: repeat(3, 61mm);
              grid-auto-rows: 28mm;
              min-height: calc(8 * 28mm + 7 * 3mm);
            }
            .label {
              border: 1px solid #111;
              padding: 4mm;
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 2mm;
            }
            .label-name { font-size: 12px; font-weight: 600; }
            .label-address { font-size: 11px; }
          </style>
        </head>
        <body class="mode-${mode}">
          ${
            mode === "patch"
              ? buildPatchPrintHtml(patchPages, logoSrc)
              : buildLabelPrintHtml(labelPagesByUniverse, logoSrc)
          }
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) {
      setIsPrinting(false);
      alert(tool.print.popupBlocked);
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    const logo = printWindow.document.querySelector("img");
    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
      window.setTimeout(() => {
        try {
          printWindow.close();
        } catch {
          // Ignore close errors on restrictive browsers.
        }
        setIsPrinting(false);
      }, 1000);
    };
    if (logo) {
      logo.addEventListener("load", triggerPrint, { once: true });
      logo.addEventListener("error", triggerPrint, { once: true });
    } else {
      triggerPrint();
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-10 print-hide">
        <SectionCard>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-title text-foreground">{tool.settings.title}</p>
              <p className="text-sm text-muted-foreground">{tool.settings.subtitle}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start-universe">{tool.settings.startUniverse}</Label>
                <Input
                  id="start-universe"
                  type="number"
                  min={1}
                  value={settings.startUniverse}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      startUniverse: clampInt(Number(event.target.value || 1)),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-address">{tool.settings.startAddress}</Label>
                <Input
                  id="start-address"
                  type="number"
                  min={1}
                  value={settings.startAddress}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      startAddress: clampInt(Number(event.target.value || 1)),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channels-per-universe">{tool.settings.channelsPerUniverse}</Label>
                <Input
                  id="channels-per-universe"
                  type="number"
                  min={1}
                  value={settings.channelsPerUniverse}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      channelsPerUniverse: clampInt(Number(event.target.value || 1)),
                    }))
                  }
                />
              </div>
            </div>
            {validationErrors.length > 0 ? (
              <div className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
                {validationErrors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-title text-foreground">{tool.fixtures.title}</p>
                <p className="text-sm text-muted-foreground">{tool.fixtures.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-1 text-right">
                  <Label htmlFor="duplicate-count" className="text-xs text-muted-foreground">
                    {tool.fixtures.duplicateCount}
                  </Label>
                  <Input
                    id="duplicate-count"
                    type="number"
                    min={1}
                    value={duplicateCount}
                    onChange={(event) => setDuplicateCount(clampInt(Number(event.target.value || 1)))}
                    className="h-8 w-24 text-sm"
                  />
                </div>
                <Button type="button" variant="outline" onClick={addFixture}>
                  {tool.fixtures.add}
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tool.fixtures.name}</TableHead>
                  <TableHead>{tool.fixtures.channels}</TableHead>
                  <TableHead>{tool.fixtures.quantity}</TableHead>
                  <TableHead className="text-right">{tool.fixtures.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixtures.map((fixture) => (
                  <TableRow key={fixture.id}>
                    <TableCell>
                      <Input
                        value={fixture.name}
                        onChange={(event) => updateFixture(fixture.id, { name: event.target.value })}
                        placeholder={tool.defaults.placeholderName}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={fixture.channelCount}
                        onChange={(event) =>
                          updateFixture(fixture.id, { channelCount: clampInt(Number(event.target.value || 1)) })
                        }
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={fixture.quantity}
                        onChange={(event) =>
                          updateFixture(fixture.id, { quantity: clampInt(Number(event.target.value || 1)) })
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => duplicateFixture(fixture)}>
                          {tool.fixtures.duplicate}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFixture(fixture.id)}
                          disabled={fixtures.length === 1}
                        >
                          {tool.fixtures.remove}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="button" size="lg" onClick={generatePatch} disabled={validationErrors.length > 0}>
            {tool.actions.generate}
          </Button>
          <Button type="button" variant="outline" onClick={() => {
            setSettings({ startUniverse: 1, startAddress: 1, channelsPerUniverse: 512 });
            setFixtures([
              {
                id: createId(),
                name: tool.defaults.sampleName,
                channelCount: 13,
                quantity: 2,
              },
            ]);
            setPatchRows([]);
            setWarnings([]);
          }}>
            {tool.actions.reset}
          </Button>
          {warnings.length > 0 ? (
            <div className="rounded-lg border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground">
              {warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}
        </div>

        <SectionCard>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-title text-foreground">{tool.output.title}</p>
                <p className="text-sm text-muted-foreground">{tool.output.subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" onClick={downloadCsv} disabled={patchRows.length === 0}>
                  {tool.actions.downloadCsv}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => openPrintView("patch", "pdf")}
                  disabled={patchRows.length === 0 || isPrinting}
                >
                  {tool.actions.exportPatchPdf}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => openPrintView("labels", "pdf")}
                  disabled={patchRows.length === 0 || isPrinting}
                >
                  {tool.actions.exportLabelsPdf}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{tool.output.csvOrderLabel}</span>
              <Button
                type="button"
                variant={csvOrder === "fixture" ? "default" : "outline"}
                size="sm"
                onClick={() => setCsvOrder("fixture")}
              >
                {tool.output.csvOrderFixture}
              </Button>
              <Button
                type="button"
                variant={csvOrder === "universe" ? "default" : "outline"}
                size="sm"
                onClick={() => setCsvOrder("universe")}
              >
                {tool.output.csvOrderUniverse}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{tool.output.exportGroupingLabel}</span>
              <Button
                type="button"
                variant={exportGrouping === "continuous" ? "default" : "outline"}
                size="sm"
                onClick={() => setExportGrouping("continuous")}
              >
                {tool.output.exportGroupingContinuous}
              </Button>
              <Button
                type="button"
                variant={exportGrouping === "universe" ? "default" : "outline"}
                size="sm"
                onClick={() => setExportGrouping("universe")}
              >
                {tool.output.exportGroupingUniverse}
              </Button>
            </div>

            {patchRows.length === 0 ? (
              <div className="rounded-lg border border-border/40 bg-background px-4 py-6 text-sm text-muted-foreground">
                {tool.output.empty}
              </div>
            ) : (
              <>
                {patchRows.length > 0 && patchRows[patchRows.length - 1].universe > 4 ? (
                  <div className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground">
                    {tool.output.largeRigWarning.replace(
                      "{count}",
                      String(patchRows[patchRows.length - 1].universe),
                    )}
                  </div>
                ) : null}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{tool.table.fixture}</TableHead>
                      <TableHead>{tool.table.index}</TableHead>
                      <TableHead>{tool.table.universe}</TableHead>
                      <TableHead>{tool.table.address}</TableHead>
                      <TableHead>{tool.table.channels}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patchRows.map((row) => (
                      <TableRow key={`${row.fixtureLabel}-${row.universe}-${row.address}`}>
                        <TableCell>{row.fixtureLabel}</TableCell>
                        <TableCell>{row.indexLabel}</TableCell>
                        <TableCell>{row.universe}</TableCell>
                        <TableCell>{row.addressLabel}</TableCell>
                        <TableCell>{row.channels}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="rounded-lg border border-border/40 bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{tool.output.labelsTitle}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyLabelList}
                      disabled={patchRows.length === 0}
                    >
                      {copyStatus === "copied"
                        ? tool.actions.copyLabelsSuccess
                        : copyStatus === "error"
                          ? tool.actions.copyLabelsError
                          : tool.actions.copyLabels}
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                  {patchRows.map((row) => (
                    <div
                      key={`${row.fixtureLabel}-${row.universe}-${row.address}-label`}
                    >{`${row.fixtureLabel} -> U${row.universe} / ${row.addressLabel}`}</div>
                  ))}
                </div>
              </div>
              </>
            )}
          </div>
        </SectionCard>
      </div>

    </div>
  );
}
