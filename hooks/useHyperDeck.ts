import { useState, useEffect, useCallback, useRef } from 'react';
import { TransportStatus, Clip, HyperDeckState } from '../types';
import { timecodeToFrames, framesToTimecode, calculateRemaining } from '../utils/timecode';

const MOCK_CLIPS: Clip[] = [
  { id: "1", name: "CAM_A_Reel_001.mov", duration: "00:10:00:00", framesDuration: 15000, startTc: "01:00:00:00", framesStart: 90000 },
  { id: "2", name: "CAM_A_Reel_002.mov", duration: "00:05:30:12", framesDuration: 8262, startTc: "01:10:00:00", framesStart: 105000 },
  { id: "3", name: "Interview_Full_Take1.mov", duration: "00:15:00:00", framesDuration: 22500, startTc: "02:00:00:00", framesStart: 180000 },
  { id: "4", name: "B-Roll_City_Night.mp4", duration: "00:02:15:05", framesDuration: 3380, startTc: "00:00:00:00", framesStart: 0 },
];

const MOCK_FTP_FILES = [
    "CAM_A_Reel_001.mov",
    "CAM_A_Reel_002.mov",
    "Interview_Full_Take1.mov",
    "B-Roll_City_Night.mp4",
    "Config_Backup_2023.xml",
    "Test_Pattern.mxf"
];

export const useHyperDeck = () => {
  const [state, setState] = useState<HyperDeckState>({
    isConnected: false,
    ipAddress: "192.168.0.70",
    status: TransportStatus.STOPPED,
    timecode: "00:00:00:00",
    remaining: "--:--:--:--",
    activeSlot: 1,
    currentClipId: "1",
    videoInput: "SDI",
    fileFormat: "QuickTimeProResHQ",
    loop: false,
    singleClip: false,
    speed: 0,
    clips: MOCK_CLIPS,
    ftpFiles: MOCK_FTP_FILES,
    log: ["System ready. Click Connect to simulate connection."]
  });

  const intervalRef = useRef<number | null>(null);

  const addLog = (msg: string) => {
    setState(prev => ({ ...prev, log: [...prev.log.slice(-49), `[${new Date().toLocaleTimeString()}] ${msg}`] }));
  };

  // Connect simulation
  const connect = (ip: string) => {
    setState(prev => ({ ...prev, ipAddress: ip }));
    addLog(`Connecting to ${ip}...`);
    setTimeout(() => {
      setState(prev => ({ ...prev, isConnected: true }));
      addLog(`Connected to ${ip}`);
      addLog(`Protocol version: 1.11`);
      addLog(`Model: HyperDeck Studio HD Plus`);
    }, 800);
  };

  const disconnect = () => {
    stopPlayback();
    setState(prev => ({ ...prev, isConnected: false }));
    addLog("Disconnected.");
  };

  // Transport Simulation Loop
  const startPlaybackTicker = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (!prev.isConnected || prev.status === TransportStatus.STOPPED) return prev;

        // Determine speed multiplier (approximate for simulation)
        const multiplier = prev.status === TransportStatus.SHUTTLE ? prev.speed / 100 : 1;
        const currentFrames = timecodeToFrames(prev.timecode);
        const newFrames = currentFrames + (1 * multiplier); // Base 1 frame per tick, simplistic
        
        const newTc = framesToTimecode(newFrames);
        
        // Find current clip for remaining calculation
        const currentClip = prev.clips.find(c => c.id === prev.currentClipId);
        let newRemaining = "--:--:--:--";
        
        if (currentClip) {
           // Simple check for clip end
           const relativeFrames = newFrames - currentClip.framesStart;
           if (relativeFrames >= currentClip.framesDuration) {
             // Clip Ended
             if (prev.loop && prev.singleClip) {
                // Loop logic: Reset to start
                return {
                    ...prev,
                    timecode: currentClip.startTc,
                    remaining: currentClip.duration
                }
             } else if (prev.singleClip) {
                 // Single clip logic: Stop
                 if(intervalRef.current) clearInterval(intervalRef.current);
                 return {
                     ...prev,
                     status: TransportStatus.STOPPED,
                     timecode: currentClip.startTc // Or end? usually stays at end
                 }
             }
           }
           
           newRemaining = calculateRemaining(newTc, currentClip.startTc, currentClip.duration);
        }

        return {
          ...prev,
          timecode: newTc,
          remaining: newRemaining
        };
      });
    }, 40); // ~25fps
  }, []);

  const stopPlayback = () => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
  };

  // Commands
  const play = (loop: boolean = false, single: boolean = false) => {
    stopPlayback();
    setState(prev => ({
      ...prev,
      status: TransportStatus.PLAYING,
      loop,
      singleClip: single,
      speed: 100
    }));
    addLog(`CMD: play: loop: ${loop} single clip: ${single}`);
    startPlaybackTicker();
  };

  const stop = () => {
    stopPlayback();
    setState(prev => ({ ...prev, status: TransportStatus.STOPPED, speed: 0 }));
    addLog("CMD: stop");
  };

  const record = () => {
    stopPlayback();
    setState(prev => ({ ...prev, status: TransportStatus.RECORDING }));
    addLog("CMD: record");
    // In a real simulation, we would increment TC based on input TC, 
    // but here we just start ticking locally
    startPlaybackTicker();
  };

  const shuttle = (speed: number) => {
     stopPlayback();
     setState(prev => ({ ...prev, status: TransportStatus.SHUTTLE, speed }));
     addLog(`CMD: shuttle: speed: ${speed}`);
     startPlaybackTicker();
  };

  const preview = () => {
      setState(prev => ({ ...prev, status: TransportStatus.PREVIEW }));
      addLog("CMD: preview: enable: true");
  };

  const gotoClip = (clipId: string) => {
    const clip = state.clips.find(c => c.id === clipId);
    if (clip) {
        setState(prev => ({
            ...prev,
            currentClipId: clipId,
            timecode: clip.startTc,
            remaining: clip.duration
        }));
        addLog(`CMD: goto: clip id: ${clipId}`);
    }
  };

  const nextClip = () => {
      const idx = state.clips.findIndex(c => c.id === state.currentClipId);
      if (idx < state.clips.length - 1) {
          gotoClip(state.clips[idx + 1].id);
      }
  };

  const prevClip = () => {
      const idx = state.clips.findIndex(c => c.id === state.currentClipId);
      if (idx > 0) {
          gotoClip(state.clips[idx - 1].id);
      }
  };

  const selectSlot = (slotId: number) => {
      setState(prev => ({ ...prev, activeSlot: slotId }));
      addLog(`CMD: slot select: slot id: ${slotId}`);
      // Simulate simulated delay for file list refresh
      addLog(`Refreshed FTP list for Slot ${slotId}`);
  };

  const deleteFile = (filename: string) => {
      setState(prev => ({
          ...prev,
          ftpFiles: prev.ftpFiles.filter(f => f !== filename)
      }));
      addLog(`CMD: delete: ${filename} (via FTP)`);
  };

  const renameFile = (oldName: string, newName: string) => {
    setState(prev => ({
        ...prev,
        ftpFiles: prev.ftpFiles.map(f => f === oldName ? newName : f)
    }));
    addLog(`CMD: rename: ${oldName} to ${newName} (via FTP)`);
  };

  return {
    state,
    actions: {
      connect,
      disconnect,
      play,
      stop,
      record,
      shuttle,
      preview,
      gotoClip,
      nextClip,
      prevClip,
      selectSlot,
      deleteFile,
      renameFile,
      setConfig: (key: string, val: string) => {
          setState(prev => ({ ...prev, [key]: val }));
          addLog(`CMD: configuration: ${key}: ${val}`);
      }
    }
  };
};
