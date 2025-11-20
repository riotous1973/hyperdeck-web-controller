import React from 'react';
import { 
  Play, Square, Circle, Rewind, FastForward, 
  SkipBack, SkipForward, Eye, Repeat
} from 'lucide-react';
import { TransportStatus } from '../types';

interface TransportProps {
  status: TransportStatus;
  isConnected: boolean;
  onPlay: (loop: boolean, single: boolean) => void;
  onStop: () => void;
  onRecord: () => void;
  onShuttle: (speed: number) => void;
  onPreview: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
}

export const Transport: React.FC<TransportProps> = ({ 
  status, isConnected, onPlay, onStop, onRecord, onShuttle, onPreview, onSkipNext, onSkipPrev 
}) => {

  const btnBase = "relative group flex flex-col items-center justify-center rounded-lg p-4 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg border-t border-white/5";
  
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 w-full">
        {/* Previous Clip */}
        <button 
            disabled={!isConnected} 
            onClick={onSkipPrev}
            className={`${btnBase} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
        >
            <SkipBack size={24} />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Prev</span>
        </button>

        {/* Rewind */}
        <button 
            disabled={!isConnected}
            onClick={() => onShuttle(-1600)}
            className={`${btnBase} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ${status === TransportStatus.SHUTTLE ? 'border-amber-500 text-amber-500' : ''}`}
        >
            <Rewind size={24} />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Rew</span>
        </button>

        {/* Stop */}
        <button 
            disabled={!isConnected}
            onClick={onStop}
            className={`${btnBase} col-span-2 sm:col-span-1 ${status === TransportStatus.STOPPED ? 'bg-blue-500 text-white shadow-blue-500/40' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
        >
            <Square size={24} fill="currentColor" />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Stop</span>
        </button>

        {/* Play */}
        <button 
            disabled={!isConnected}
            onClick={() => onPlay(false, false)}
            className={`${btnBase} col-span-2 sm:col-span-1 ${status === TransportStatus.PLAYING ? 'bg-hyper-play text-black shadow-green-500/40' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
        >
            <Play size={24} fill="currentColor" />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Play</span>
        </button>

        {/* Fast Forward */}
        <button 
            disabled={!isConnected}
            onClick={() => onShuttle(1600)}
            className={`${btnBase} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ${status === TransportStatus.SHUTTLE ? 'border-amber-500 text-amber-500' : ''}`}
        >
            <FastForward size={24} />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Fwd</span>
        </button>

        {/* Next Clip */}
        <button 
            disabled={!isConnected}
            onClick={onSkipNext}
            className={`${btnBase} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}
        >
            <SkipForward size={24} />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Next</span>
        </button>

        {/* Record */}
        <button 
            disabled={!isConnected}
            onClick={onRecord}
            className={`${btnBase} bg-zinc-800 text-red-500 hover:bg-zinc-700 ${status === TransportStatus.RECORDING ? 'bg-red-600 text-white shadow-red-600/40 animate-pulse' : ''}`}
        >
            <Circle size={24} fill="currentColor" />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Rec</span>
        </button>

        {/* Preview */}
        <button 
            disabled={!isConnected}
            onClick={onPreview}
            className={`${btnBase} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ${status === TransportStatus.PREVIEW ? 'border-amber-500 text-amber-500' : ''}`}
        >
            <Eye size={24} />
            <span className="text-[10px] mt-1 font-bold uppercase tracking-wide">Prv</span>
        </button>
    </div>
  );
};
