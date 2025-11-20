/**
 * Helper to parse HH:MM:SS:FF string to total frames
 * Assumes 25fps for simplicity in this simulation, 
 * as the original python code had complex drop-frame logic.
 */
export const timecodeToFrames = (tc: string, fps: number = 25): number => {
  if (!tc || tc === "--:--:--:--") return 0;
  const parts = tc.replace(';', ':').split(':');
  if (parts.length !== 4) return 0;

  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const s = parseInt(parts[2], 10);
  const f = parseInt(parts[3], 10);

  return (h * 3600 + m * 60 + s) * fps + f;
};

/**
 * Helper to convert total frames back to HH:MM:SS:FF string
 */
export const framesToTimecode = (frames: number, fps: number = 25): string => {
  if (frames < 0) frames = 0;
  
  const f = Math.floor(frames % fps);
  const totalSeconds = Math.floor(frames / fps);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
};

export const calculateRemaining = (
  currentTc: string, 
  startTc: string, 
  durationTc: string
): string => {
  const current = timecodeToFrames(currentTc);
  const start = timecodeToFrames(startTc);
  const duration = timecodeToFrames(durationTc);
  
  const elapsed = current - start;
  const remaining = duration - elapsed;
  
  return framesToTimecode(remaining);
};
