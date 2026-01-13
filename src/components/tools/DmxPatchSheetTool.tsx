"use client";

import { useMemo, useState } from "react";
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

  const fixturePadById = useMemo(() => {
    const map = new Map<string, number>();
    fixtures.forEach((fixture) => {
      map.set(fixture.id, Math.max(2, String(clampInt(fixture.quantity)).length));
    });
    return map;
  }, [fixtures]);

  const labelPages = useMemo(() => {
    const pages: PatchRow[][] = [];
    for (let index = 0; index < patchRows.length; index += 24) {
      pages.push(patchRows.slice(index, index + 24));
    }
    return pages;
  }, [patchRows]);

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
    const header = [
      tool.table.fixture,
      tool.table.index,
      tool.table.universe,
      tool.table.address,
      tool.table.channels,
    ];
    const rows = patchRows.map((row) => [
      row.fixtureLabel,
      row.indexLabel,
      row.universe,
      row.addressLabel,
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

  const buildPatchPrintHtml = (rows: PatchRow[], logoSrc: string) => {
    const title = escapeHtml(tool.print.patchTitle);
    const subtitle = escapeHtml(tool.print.patchSubtitle);
    return `
      <div class="page">
        <img src="${logoSrc}" alt="Y-Link" class="logo logo--patch" />
        <div class="title">${title}</div>
        <div class="subtitle">${subtitle}</div>
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
            ${rows
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
  };

  const buildLabelPrintHtml = (pages: PatchRow[][], logoSrc: string) => {
    const title = escapeHtml(tool.print.labelsTitle);
    const subtitle = escapeHtml(tool.print.labelsSubtitle);
    return pages
      .map(
        (page) => `
          <div class="page">
            <img src="${logoSrc}" alt="Y-Link" class="logo logo--labels" />
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
            <div class="label-grid">
              ${page
                .map(
                  (row) => `
                    <div class="label">
                      <div class="label-name">${escapeHtml(row.fixtureLabel)}</div>
                      <div class="label-address">U${row.universe} / ${escapeHtml(row.addressLabel)}</div>
                    </div>`,
                )
                .join("")}
            </div>
          </div>`,
      )
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
    const pages: PatchRow[][] = [];
    for (let index = 0; index < escapedRows.length; index += 24) {
      pages.push(escapedRows.slice(index, index + 24));
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
            .logo--patch { width: 60mm; }
            .logo--labels { width: 45mm; }
            .title { font-size: 16px; font-weight: 600; margin-bottom: 4mm; }
            .subtitle { font-size: 12px; margin-bottom: 8mm; }
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
              grid-auto-rows: 32mm;
              column-gap: 3mm;
              row-gap: 3mm;
              min-height: calc(8 * 32mm + 7 * 3mm);
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
        <body>
          ${mode === "patch" ? buildPatchPrintHtml(escapedRows, logoSrc) : buildLabelPrintHtml(pages, logoSrc)}
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
          <Button type="button" size="lg" onClick={generatePatch}>
            {tool.actions.generate}
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
                  variant="outline"
                  onClick={() => openPrintView("patch", "print")}
                  disabled={patchRows.length === 0 || isPrinting}
                >
                  {tool.actions.printPatch}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openPrintView("labels", "print")}
                  disabled={patchRows.length === 0 || isPrinting}
                >
                  {tool.actions.printLabels}
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

            {patchRows.length === 0 ? (
              <div className="rounded-lg border border-border/40 bg-background px-4 py-6 text-sm text-muted-foreground">
                {tool.output.empty}
              </div>
            ) : (
              <>
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
                  <p className="text-sm font-semibold text-foreground">{tool.output.labelsTitle}</p>
                  <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                    {patchRows.map((row) => (
                      <div key={`${row.fixtureLabel}-label`}>{`${row.fixtureLabel} -> U${row.universe} / ${row.addressLabel}`}</div>
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
