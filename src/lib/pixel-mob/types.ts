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

export type SavedScene = {
  name: string;
  preset: string;
  speed: number;
  width: number;
  palette: string;
  id: number;
};

export type Cue = {
  id: string;
  animation: string;
  params: AnimationParams;
  startAt: number;
  duration: number;
  type?: "play" | "blink_register";
};
