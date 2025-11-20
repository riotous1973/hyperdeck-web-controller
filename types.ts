export enum TransportStatus {
  STOPPED = 'stopped',
  PLAYING = 'play',
  RECORDING = 'record',
  SHUTTLE = 'shuttle',
  PREVIEW = 'preview'
}

export interface Clip {
  id: string;
  name: string;
  duration: string; // TC string
  framesDuration: number;
  startTc: string;
  framesStart: number;
}

export interface HyperDeckState {
  isConnected: boolean;
  ipAddress: string;
  status: TransportStatus;
  timecode: string;
  remaining: string;
  activeSlot: number;
  currentClipId: string | null;
  videoInput: string;
  fileFormat: string;
  loop: boolean;
  singleClip: boolean;
  speed: number;
  clips: Clip[];
  ftpFiles: string[]; // Simulated FTP file list
  log: string[];
}

export const FORMAT_OPTIONS = [
  "QuickTimeProResHQ", "QuickTimeProRes", "QuickTimeProResLT", 
  "QuickTimeProResProxy", "DNxHD220", "DNxHR_HQX", 
  "H.264High", "H.264Medium", "H.264Low", 
  "H.265High", "H.265Medium", "H.265Low"
];

export const INPUT_OPTIONS = ["SDI", "HDMI", "Component"];
