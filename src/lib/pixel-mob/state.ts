import { kv } from "@vercel/kv";
import { computePosition } from "./animations";
import type { Cue, DeviceRegistration, PhonePosition } from "./types";

const P = "pixelmob";
const TWELVE_HOURS_SEC = 43200;

const k = {
  cue: `${P}:cue`,
  config: `${P}:config`,
  syncVersion: `${P}:sync_version`,
  nextIndex: `${P}:next_index`,
  scenes: `${P}:scenes`,
  device: (id: string) => `${P}:device:${id}`,
  deviceSet: `${P}:device_set`,
};

const DEFAULT_CONFIG = { rows: 14, colsPerSide: 8 };

export async function getShowConfig() {
  return (await kv.get<{ rows: number; colsPerSide: number }>(k.config)) ?? DEFAULT_CONFIG;
}

export async function setShowConfig(config: { rows: number; colsPerSide: number }) {
  await kv.set(k.config, config);
}

export async function getSyncVersion(): Promise<number> {
  return (await kv.get<number>(k.syncVersion)) ?? 1;
}

export async function getCurrentCue(): Promise<Cue | null> {
  return await kv.get<Cue>(k.cue);
}

export async function setCue(cue: Cue): Promise<void> {
  await kv.set(k.cue, cue);
}

export async function clearCue(): Promise<void> {
  await kv.del(k.cue);
}

export async function registerDevice(
  deviceId: string,
  zone?: { side: number; depth: number }
): Promise<DeviceRegistration> {
  const existing = await kv.get<DeviceRegistration>(k.device(deviceId));
  if (existing) {
    existing.lastSeen = Date.now();
    await kv.set(k.device(deviceId), existing, { ex: TWELVE_HOURS_SEC });
    return existing;
  }

  const index = (await kv.incr(k.nextIndex)) - 1;
  const config = await getShowConfig();
  const basePos = computePosition(index, config.rows, config.colsPerSide);

  let position: PhonePosition;
  if (zone) {
    const rng = (i: number) => {
      const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    const depthRanges = [[0, 0.33], [0.33, 0.66], [0.66, 1]];
    const [dMin, dMax] = depthRanges[zone.depth] ?? [0, 1];
    const nz = dMin + rng(index * 7 + 3) * (dMax - dMin);
    const sideOffset = zone.side === 0 ? 0.05 + rng(index * 11) * 0.4 : 0.55 + rng(index * 11) * 0.4;
    position = {
      index,
      nx: sideOffset,
      nz,
      side: zone.side,
      col: basePos.col,
      row: basePos.row,
      seed: basePos.seed,
    };
  } else {
    position = { index, ...basePos };
  }

  const reg: DeviceRegistration = {
    deviceId,
    index,
    position,
    registeredAt: Date.now(),
    lastSeen: Date.now(),
  };

  await kv.set(k.device(deviceId), reg, { ex: TWELVE_HOURS_SEC });
  await kv.sadd(k.deviceSet, deviceId);

  return reg;
}

export async function updateDevicePosition(
  deviceId: string,
  position: Partial<PhonePosition>
): Promise<boolean> {
  const existing = await kv.get<DeviceRegistration>(k.device(deviceId));
  if (!existing) return false;
  existing.position = { ...existing.position, ...position };
  await kv.set(k.device(deviceId), existing, { ex: TWELVE_HOURS_SEC });
  return true;
}

export async function getDeviceCount(): Promise<number> {
  return await kv.scard(k.deviceSet);
}

export async function getAllDevices(): Promise<DeviceRegistration[]> {
  const ids = await kv.smembers(k.deviceSet);
  if (!ids.length) return [];
  const pipeline = kv.pipeline();
  for (const id of ids) pipeline.get(k.device(id as string));
  const results = await pipeline.exec();
  const devices: DeviceRegistration[] = [];
  const expired: string[] = [];
  for (let i = 0; i < ids.length; i++) {
    if (results[i]) devices.push(results[i] as DeviceRegistration);
    else expired.push(ids[i] as string);
  }
  if (expired.length) await kv.srem(k.deviceSet, ...expired);
  return devices;
}

export async function resetSync(): Promise<number> {
  const ids = await kv.smembers(k.deviceSet);
  const pipeline = kv.pipeline();
  for (const id of ids) pipeline.del(k.device(id as string));
  pipeline.del(k.deviceSet);
  pipeline.del(k.cue);
  pipeline.set(k.nextIndex, 0);
  pipeline.incr(k.syncVersion);
  await pipeline.exec();
  return (await getSyncVersion());
}

export async function getScenes() {
  return (await kv.get<unknown[]>(k.scenes)) ?? [];
}

export async function setScenes(scenes: unknown[]) {
  await kv.set(k.scenes, scenes);
}
