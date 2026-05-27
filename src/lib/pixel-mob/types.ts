export type PhonePosition = {
  index: number;
  nx: number;
  nz: number;
  side: number;
  col: number;
  row: number;
  seed: number;
};

export type AnimationParams = {
  speed: number;
  width: number;
  palette: string;
};

export type Cue = {
  id: string;
  animation: string;
  params: AnimationParams;
  startAt: number;
  duration: number;
};

export type ShowState = {
  currentCue: Cue | null;
  deviceCount: number;
  showConfig: { rows: number; colsPerSide: number };
  syncVersion: number;
};

export type DeviceRegistration = {
  deviceId: string;
  index: number;
  position: PhonePosition;
  registeredAt: number;
  lastSeen: number;
};
