import React, { useState } from 'react';
import { 
  X, 
  Speaker, 
  BatteryMedium, 
  Wifi, 
  Volume2, 
  Activity, 
  RefreshCw
} from 'lucide-react';
import { SoundboxTelemetry } from '../../types';
import { soundManager } from '../../utils/audio';

interface SoundboxSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: SoundboxTelemetry;
  onUpdateTelemetry: (newTelemetry: Partial<SoundboxTelemetry>) => void;
}

export const SoundboxSettingsModal: React.FC<SoundboxSettingsModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  onUpdateTelemetry
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  if (!isOpen) return null;

  const languages = [
    { code: 'Hindi', label: 'हिंदी (Hindi)', sample: 'Paytm par 100 rupaye prapt hue' },
    { code: 'English', label: 'English', sample: '100 rupees received on Paytm' },
    { code: 'Hinglish', label: 'Hinglish', sample: 'Paytm pe 100 rupaye received' },
    { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', sample: 'Paytm te 100 rupaye prapat hoye' },
    { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)', sample: 'Paytm par 100 rupiya malya' },
    { code: 'Marathi', label: 'मराठी (Marathi)', sample: 'Paytm var 100 rupaye prapt jhale' }
  ];

  const handlePingHardware = () => {
    soundManager.playTestChime();
    setPingSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002970]/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl max-w-lg w-full shadow-paytm-modal border border-[#E2E8F0] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#002970] text-white p-4 flex items-center justify-between border-b border-[#001E53]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-white/10 text-paytm-blue">
              <Speaker size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm leading-tight text-white">{telemetry.model}</h3>
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">Device ID: {telemetry.deviceId} • Firmware v3.4.1</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                <BatteryMedium size={18} />
                <span className="text-sm font-bold">{telemetry.batteryLevel}%</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Battery</p>
              <p className="text-[10px] text-emerald-600 font-medium">Backup: ~18 hrs</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-paytm-blue mb-1">
                <Wifi size={18} />
                <span className="text-xs font-bold font-mono">-68 dBm</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Network</p>
              <p className="text-[10px] text-slate-600 font-medium truncate">{telemetry.carrier}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-paytm-navy mb-1">
                <Activity size={18} />
                <span className="text-sm font-bold font-mono">{telemetry.broadcastsToday}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Broadcasts</p>
              <p className="text-[10px] text-slate-600 font-medium">0 Packet Loss</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Volume2 size={15} className="text-paytm-blue" />
                Hardware Volume
              </span>
              <span className="font-mono font-bold text-paytm-navy">{telemetry.volume}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={telemetry.volume}
              onChange={(e) => onUpdateTelemetry({ volume: Number(e.target.value) })}
              className="w-full accent-paytm-blue cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Quiet (Store Interior)</span>
              <span>Loud (Bustling Market)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Broadcast Language Preference</span>
              <span className="text-[10px] text-paytm-navy font-semibold">Configured on Hardware</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onUpdateTelemetry({ language: lang.code })}
                  className={`text-left p-2.5 rounded-md border text-xs transition-all ${
                    telemetry.language === lang.code
                      ? 'bg-paytm-navy text-white border-paytm-navy font-semibold shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-semibold">{lang.label}</p>
                  <p className={`text-[10px] truncate mt-0.5 ${telemetry.language === lang.code ? 'text-paytm-blue' : 'text-slate-400'}`}>
                    "{lang.sample}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-md border border-blue-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-paytm-navy">Hardware Connection Diagnostics</h4>
                <p className="text-[11px] text-slate-600">Verify device connection with Paytm IoT Gateway.</p>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-paytm-navy font-bold">
                Latency: 14ms
              </span>
            </div>

            <button
              onClick={handlePingHardware}
              disabled={isPinging}
              className="w-full bg-paytm-blue hover:bg-paytm-blueHover text-white font-semibold py-2 rounded-md text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-60"
            >
              <RefreshCw size={14} className={isPinging ? 'animate-spin' : ''} />
              <span>{isPinging ? 'Pinging Soundbox...' : pingSuccess ? 'Hardware Responded: 100% OK' : 'Ping Hardware IoT Gateway'}</span>
            </button>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Paytm Soundbox v3 Hardware OS 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-paytm-navy text-white rounded-md text-xs font-semibold hover:bg-[#001E53] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
