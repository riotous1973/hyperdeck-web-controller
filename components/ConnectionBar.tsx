import React, { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionBarProps {
  ipAddress: string;
  isConnected: boolean;
  onConnect: (ip: string) => void;
  onDisconnect: () => void;
}

export const ConnectionBar: React.FC<ConnectionBarProps> = ({ ipAddress, isConnected, onConnect, onDisconnect }) => {
  const [ip, setIp] = useState(ipAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConnected) {
      onDisconnect();
    } else {
      onConnect(ip);
    }
  };

  return (
    <div className="bg-hyper-panel border-b border-zinc-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md z-10">
      <div className="flex items-center gap-3">
        <div className="text-zinc-400 font-bold tracking-widest text-sm uppercase">HyperDeck Controller</div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-500 border border-zinc-700">SIMULATION MODE</span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="ip" className="text-zinc-400 text-sm font-medium whitespace-nowrap">IP Address:</label>
        <input
          id="ip"
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          disabled={isConnected}
          className={`bg-zinc-900 border border-zinc-700 text-white px-3 py-1.5 rounded text-sm font-mono w-36 focus:outline-none focus:border-hyper-accent transition-colors ${isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <button
          type="submit"
          className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-bold transition-all ${
            isConnected 
              ? 'bg-zinc-800 text-red-500 border border-red-900 hover:bg-red-900/20' 
              : 'bg-hyper-accent text-white hover:bg-blue-600 shadow-lg shadow-blue-900/20'
          }`}
        >
          {isConnected ? (
            <>
              <WifiOff size={16} /> Disconnect
            </>
          ) : (
            <>
              <Wifi size={16} /> Connect
            </>
          )}
        </button>
      </form>
    </div>
  );
};
