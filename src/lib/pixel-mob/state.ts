import type { Cue, DeviceRegistration, PhonePosition } from "./types";
import { computePosition } from "./animations";

type ServerState = {
  currentCue: Cue | null;
  devices: Map<string, DeviceRegistration>;
  showConfig: { rows: number; colsPerSide: number };
  syncVersion: number;
  nextIndex: number;
};

const g = globalThis as unknown as { _pixelMob?: ServerState };

export function getState(): ServerState {
  if (!g._pixelMob) {
    g._pixelMob = {
      currentCue: null,
      devices: new Map(),
      showConfig: { rows: 14, colsPerSide: 8 },
      syncVersion: 1,
      nextIndex: 0,
    };
  }
  return g._pixelMob;
}

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

function pruneStale(state: ServerState) {
  const cutoff = Date.now() - TWELVE_HOURS;
  for (const [id, dev] of state.devices) {
    if (dev.registeredAt < cutoff) state.devices.delete(id);
  }
}

export function registerDevice(deviceId: string): DeviceRegistration {
  const state = getState();
  pruneStale(state);

  const existing = state.devices.get(deviceId);
  if (existing && Date.now() - existing.registeredAt < TWELVE_HOURS) {
    existing.lastSeen = Date.now();
    return existing;
  }

  const index = state.nextIndex++;
  const { rows, colsPerSide } = state.showConfig;
  const pos = computePosition(index, rows, colsPerSide);
  const position: PhonePosition = { index, ...pos };

  const reg: DeviceRegistration = {
    deviceId,
    index,
    position,
    registeredAt: Date.now(),
    lastSeen: Date.now(),
  };
  state.devices.set(deviceId, reg);
  return reg;
}

export function touchDevice(deviceId: string) {
  const state = getState();
  const dev = state.devices.get(deviceId);
  if (dev) dev.lastSeen = Date.now();
}

export function setCue(cue: Cue) {
  const state = getState();
  state.currentCue = cue;
}

export function clearCue() {
  const state = getState();
  state.currentCue = null;
}

export function resetSync() {
  const state = getState();
  state.syncVersion++;
  state.devices.clear();
  state.nextIndex = 0;
  state.currentCue = null;
}

export function getDeviceCount(): number {
  const state = getState();
  pruneStale(state);
  return state.devices.size;
}

export function getAllDevices(): DeviceRegistration[] {
  const state = getState();
  pruneStale(state);
  return Array.from(state.devices.values());
}
