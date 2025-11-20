import React, { useState } from 'react';
import { ConnectionBar } from './components/ConnectionBar';
import { Display } from './components/Display';
import { Transport } from './components/Transport';
import { useHyperDeck } from './hooks/useHyperDeck';
import { Clip, FORMAT_OPTIONS, INPUT_OPTIONS, TransportStatus } from './types';
import { Folder, Settings, Terminal, PlayCircle, HardDrive, Trash2, Edit } from 'lucide-react';

const App: React.FC = () => {
  const { state, actions } = useHyperDeck();
  const [activeTab, setActiveTab] = useState<'home' | 'config' | 'ftp' | 'terminal'>('home');
  const [recName, setRecName] = useState("");

  const currentClip = state.clips.find(c => c.id === state.currentClipId);

  const handlePlayLoop = () => actions.play(true, true);
  const handlePlaySingle = () => actions.play(false, true);

  return (
    <div className="min-h-screen bg-hyper-bg flex flex-col font-sans select-none">
      {/* Top Bar */}
      <ConnectionBar 
        ipAddress={state.ipAddress} 
        isConnected={state.isConnected}
        onConnect={actions.connect}
        onDisconnect={actions.disconnect}
      />

      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full p-4 gap-4">
        
        {/* Main Status Display */}
        <Display 
          timecode={state.timecode}
          remaining={state.remaining}
          clipName={currentClip?.name || "---"}
          status={state.status}
          activeSlot={state.activeSlot}
          loop={state.loop}
          single={state.singleClip}
          isConnected={state.isConnected}
        />

        {/* Tabs Navigation */}
        <div className="flex border-b border-zinc-700 mb-2">
          {[
            { id: 'home', label: 'Home', icon: PlayCircle },
            { id: 'config', label: 'Config', icon: Settings },
            { id: 'ftp', label: 'Files / FTP', icon: Folder },
            { id: 'terminal', label: 'Console', icon: Terminal },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-hyper-accent text-hyper-accent bg-zinc-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
            
            {/* --- HOME TAB --- */}
            {activeTab === 'home' && (
              <div className="flex flex-col gap-6">
                <Transport 
                  status={state.status}
                  isConnected={state.isConnected}
                  onPlay={actions.play}
                  onStop={actions.stop}
                  onRecord={actions.record}
                  onShuttle={actions.shuttle}
                  onPreview={actions.preview}
                  onSkipNext={actions.nextClip}
                  onSkipPrev={actions.prevClip}
                />

                {/* Specialized Playback Controls */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-hyper-panel p-4 rounded-lg border border-zinc-800">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Recording</h3>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Clip Name" 
                          value={recName}
                          onChange={(e) => setRecName(e.target.value)}
                          disabled={!state.isConnected}
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:border-hyper-accent outline-none"
                        />
                        <button 
                          disabled={!state.isConnected}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 rounded border border-zinc-700"
                        >
                          SET NAME
                        </button>
                      </div>
                   </div>
                   <div className="bg-hyper-panel p-4 rounded-lg border border-zinc-800">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Playback Modes</h3>
                      <div className="flex gap-2">
                        <button 
                          disabled={!state.isConnected}
                          onClick={handlePlayLoop}
                          className={`flex-1 py-2 rounded text-sm font-bold border ${state.loop && state.status === TransportStatus.PLAYING ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}
                        >
                          PLAY LOOP
                        </button>
                        <button 
                          disabled={!state.isConnected}
                          onClick={handlePlaySingle}
                          className={`flex-1 py-2 rounded text-sm font-bold border ${state.singleClip && !state.loop && state.status === TransportStatus.PLAYING ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}
                        >
                          PLAY SINGLE
                        </button>
                      </div>
                   </div>
                </div>

                {/* Clip List */}
                <div className="bg-hyper-panel rounded-lg border border-zinc-800 overflow-hidden">
                  <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase">Clip List (Slot {state.activeSlot})</h3>
                    <span className="text-xs text-zinc-600">{state.clips.length} Clips</span>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-950 text-zinc-500 font-medium text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2 w-12 text-center">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2 w-32 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {state.clips.map(clip => (
                        <tr 
                          key={clip.id} 
                          onClick={() => state.isConnected && actions.gotoClip(clip.id)}
                          className={`cursor-pointer hover:bg-zinc-800 transition-colors ${state.currentClipId === clip.id ? 'bg-blue-900/20 text-blue-400' : 'text-zinc-300'}`}
                        >
                          <td className="px-4 py-3 text-center font-mono text-zinc-500">{clip.id}</td>
                          <td className="px-4 py-3 font-medium">{clip.name}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{clip.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- CONFIG TAB --- */}
            {activeTab === 'config' && (
              <div className="flex flex-col gap-6">
                <div className="bg-hyper-panel p-6 rounded-lg border border-zinc-800">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Settings size={20} /> System Configuration
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Video Input</label>
                      <select 
                        disabled={!state.isConnected}
                        value={state.videoInput}
                        onChange={(e) => actions.setConfig('videoInput', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded focus:border-hyper-accent outline-none"
                      >
                        {INPUT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">File Format</label>
                      <select 
                        disabled={!state.isConnected}
                        value={state.fileFormat}
                        onChange={(e) => actions.setConfig('fileFormat', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded focus:border-hyper-accent outline-none"
                      >
                        {FORMAT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4">Active Slot Selection</h3>
                    <div className="flex gap-4">
                      {[1, 2, 3].map(slot => (
                         <button
                            key={slot}
                            disabled={!state.isConnected}
                            onClick={() => actions.selectSlot(slot)}
                            className={`flex-1 py-4 rounded flex flex-col items-center gap-2 border transition-all ${state.activeSlot === slot ? 'bg-red-900/20 border-red-600 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                         >
                            <HardDrive size={24} />
                            <span className="font-bold">SLOT {slot}</span>
                         </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-hyper-panel p-6 rounded-lg border border-zinc-800 opacity-80">
                   <h2 className="text-lg font-bold text-white mb-4">NAS Configuration</h2>
                   <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded text-yellow-200 text-sm mb-4">
                      SMB/CIFS mounting simulation. Real mounting requires backend proxy.
                   </div>
                   <div className="grid gap-4">
                      <input disabled className="bg-zinc-900 border border-zinc-700 rounded p-2 w-full text-zinc-500" placeholder="smb://server/share" />
                      <div className="grid grid-cols-2 gap-4">
                        <input disabled className="bg-zinc-900 border border-zinc-700 rounded p-2 w-full text-zinc-500" placeholder="Username" />
                        <input disabled type="password" className="bg-zinc-900 border border-zinc-700 rounded p-2 w-full text-zinc-500" placeholder="Password" />
                      </div>
                      <button disabled className="bg-zinc-800 text-zinc-500 font-bold py-2 rounded">Mount Share</button>
                   </div>
                </div>
              </div>
            )}

             {/* --- FTP TAB --- */}
             {activeTab === 'ftp' && (
              <div className="flex flex-col h-full">
                <div className="bg-hyper-panel rounded-lg border border-zinc-800 flex-1 flex flex-col overflow-hidden">
                  <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <HardDrive size={16} className="text-zinc-500" />
                       <span className="font-bold text-white">SSD {state.activeSlot}</span>
                       <span className="text-zinc-600">/</span>
                    </div>
                    <button onClick={() => actions.selectSlot(state.activeSlot)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-bold transition-colors">
                       REFRESH
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 p-2">
                     <table className="w-full text-left text-sm">
                        <thead className="text-zinc-500 font-medium text-xs uppercase border-b border-zinc-800">
                           <tr>
                              <th className="px-4 py-2">Filename</th>
                              <th className="px-4 py-2 text-right w-32">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                           {state.ftpFiles.map((file, idx) => (
                              <tr key={idx} className="hover:bg-zinc-800/50 group transition-colors">
                                 <td className="px-4 py-3 text-zinc-300 font-mono">{file}</td>
                                 <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                          const newName = prompt("Rename file:", file);
                                          if(newName && newName !== file) actions.renameFile(file, newName);
                                      }}
                                      className="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded" title="Rename"
                                    >
                                       <Edit size={16} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                          if(confirm(`Delete ${file}?`)) actions.deleteFile(file);
                                      }}
                                      className="p-1.5 text-red-400 hover:bg-red-900/30 rounded" title="Delete"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                           {state.ftpFiles.length === 0 && (
                              <tr>
                                 <td colSpan={2} className="px-4 py-8 text-center text-zinc-600 italic">No files found in root</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
                </div>
              </div>
            )}

            {/* --- TERMINAL TAB --- */}
            {activeTab === 'terminal' && (
               <div className="bg-black rounded-lg border border-zinc-800 h-full flex flex-col font-mono text-sm p-4 shadow-inner">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-1">
                     {state.log.map((line, i) => (
                        <div key={i} className="text-zinc-400 break-words">
                           <span className="text-zinc-600 mr-2">&gt;</span>
                           {line}
                        </div>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input 
                        type="text" 
                        placeholder="Enter raw command..." 
                        className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded focus:border-hyper-accent outline-none"
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && state.isConnected) {
                              // Simulate echo
                              const target = e.target as HTMLInputElement;
                              if(target.value) {
                                 actions.setConfig('raw', target.value);
                                 target.value = '';
                              }
                           }
                        }}
                     />
                     <button className="bg-zinc-800 text-white px-4 py-2 rounded font-bold border border-zinc-700 hover:bg-zinc-700">Send</button>
                  </div>
               </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default App;
