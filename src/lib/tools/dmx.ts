export const CHANNELS_PER_UNIVERSE = 512;

export type PlacementRange = {
  id: string;
  start: number;
  end: number;
};

export type OverlapRange = {
  aId: string;
  bId: string;
  start: number;
  end: number;
};

export const clampInt = (value: number, min = 1) => {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.floor(value));
};

export const nextFreeAddress = (
  occupied: boolean[],
  channelsNeeded: number,
  startAddress = 1,
) => {
  const startIndex = clampInt(startAddress);
  const required = clampInt(channelsNeeded);
  const maxStart = occupied.length - required + 1;
  if (required <= 0 || maxStart < 1) return null;

  for (let address = startIndex; address <= maxStart; address += 1) {
    let available = true;
    for (let offset = 0; offset < required; offset += 1) {
      if (occupied[address + offset - 1]) {
        available = false;
        break;
      }
    }
    if (available) return address;
  }

  return null;
};

export const checkOverlap = (ranges: PlacementRange[]): OverlapRange[] => {
  const overlaps: OverlapRange[] = [];
  for (let i = 0; i < ranges.length; i += 1) {
    for (let j = i + 1; j < ranges.length; j += 1) {
      const a = ranges[i];
      const b = ranges[j];
      const start = Math.max(a.start, b.start);
      const end = Math.min(a.end, b.end);
      if (start <= end) {
        overlaps.push({ aId: a.id, bId: b.id, start, end });
      }
    }
  }
  return overlaps;
};
