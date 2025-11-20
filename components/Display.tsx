import React from 'react';
import { TransportStatus } from '../types';

interface DisplayProps {
  timecode: string;
  remaining: string;
  clipName: string;
  status: TransportStatus;
  activeSlot: number;
  loop: boolean;
  single: boolean;
  isConnected: boolean;
}

export const Display: React.FC<DisplayProps> = ({ 
  timecode, remaining, clipName, status, activeSlot, loop, single, isConnected 
}) => {

  let statusText = "-- DISCONNECTED --";
  if (isConnected) {
    statusText = status.toUpperCase();
    if (status === TransportStatus.PLAYING) {
        if (loop) statusText = "PLAY LOOP";
        else if (single) statusText = "PLAY SINGLE";
    }
  }

  return (
    <div className="bg-black border border-zinc-700 rounded-lg p-6 mb-6 shadow-2xl relative overflow-hidden">
        {/* Background Mesh/Gradient for realism */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black opacity-80 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            {/* Status Line */}
            <div className="w-full flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
                 <div className="flex gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeSlot === 1 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>SSD 1</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeSlot === 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>SSD 2</span>
                 </div>
                 <div className={`text-sm font-bold tracking-[0.2em] ${status === TransportStatus.RECORDING ? 'text-red-500 animate-pulse' : 'text-hyper-accent'}`}>
                    {statusText}
                 </div>
            </div>

            {/* Timecode Area */}
            <div className="flex flex-col sm:flex-row items-baseline gap-2 sm:gap-8 mb-2">
                {/* Main TC */}
                <div className="text-5xl sm:text-7xl font-mono font-bold text-hyper-accent tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(0,122,255,0.5)]">
                    {isConnected ? timecode : "--:--:--:--"}
                </div>
                {/* Remaining TC */}
                <div className="text-3xl sm:text-4xl font-mono font-bold text-red-600 tracking-tighter tabular-nums opacity-80">
                    {isConnected ? `-${remaining}` : "--:--:--:--"}
                </div>
            </div>

            {/* Clip Name */}
            <div className="w-full text-center mt-4">
                <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Current Clip</div>
                <div className="text-xl font-medium text-white truncate max-w-full px-4">
                    {isConnected ? clipName : "---"}
                </div>
            </div>
        </div>
    </div>
  );
};
