import React, { useState } from 'react';
import { ApiConfig, DataSourceMode } from '../services/carparkService';
import { Server, Database, CheckCircle, AlertCircle, Copy, Check, Play, ExternalLink, Code } from 'lucide-react';

interface ApiIntegrationModalProps {
  config: ApiConfig;
  onSaveConfig: (config: ApiConfig) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ApiIntegrationModal: React.FC<ApiIntegrationModalProps> = ({
  config,
  onSaveConfig,
  onClose,
  isOpen
}) => {
  const [sourceMode, setSourceMode] = useState<DataSourceMode>(config.sourceMode);
  const [customEndpoint, setCustomEndpoint] = useState<string>(config.customEndpointUrl);
  const [refreshInterval, setRefreshInterval] = useState<number>(config.autoRefreshIntervalSec);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
    latency?: number;
  }>({ status: 'idle', message: '' });

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      sourceMode,
      customEndpointUrl: customEndpoint,
      autoRefreshIntervalSec: refreshInterval
    });
    onClose();
  };

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing', message: 'Pinging endpoint...' });
    const start = performance.now();

    try {
      if (sourceMode === 'simulated') {
        await new Promise(r => setTimeout(r, 150));
        setTestResult({
          status: 'success',
          message: 'Simulated data engine is nominal. 18 carparks ready.',
          latency: Math.round(performance.now() - start)
        });
      } else if (sourceMode === 'datagov') {
        const res = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const count = json.items?.[0]?.carpark_data?.length || 0;
        setTestResult({
          status: 'success',
          message: `Connected to Data.gov.sg! Received real-time availability for ${count} Singapore carparks.`,
          latency: Math.round(performance.now() - start)
        });
      } else {
        const res = await fetch(customEndpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status} returned from ${customEndpoint}`);
        const data = await res.json();
        setTestResult({
          status: 'success',
          message: `Successfully connected to custom backend! Received ${Array.isArray(data) ? data.length : 1} records.`,
          latency: Math.round(performance.now() - start)
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: `Connection failed: ${err.message || 'Network / CORS error. Ensure CORS headers are enabled.'}`,
        latency: Math.round(performance.now() - start)
      });
    }
  };

  const sampleExpressSnippet = `// Example Express proxy for Singapore Carpark Data
// Run in your backend server:
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// 1. Data.gov.sg HDB Carpark Availability
app.get('/api/carparks/datagov', async (req, res) => {
  try {
    const response = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LTA DataMall Carpark Availability
app.get('/api/carparks/lta', async (req, res) => {
  try {
    const response = await fetch(
      'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
      {
        headers: {
          AccountKey: process.env.LTA_DATAMALL_KEY || '',
          accept: 'application/json'
        }
      }
    );
    const data = await response.json();
    res.json(data.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log('Carpark backend ready on :4000'));`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleExpressSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 transition-all">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Backend Connection Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your data source or plug in your backend API endpoint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Source Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
              Select Data Source Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Simulated */}
              <div
                onClick={() => setSourceMode('simulated')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'simulated'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Simulated Flux</span>
                  {sourceMode === 'simulated' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Authentic SG carparks with micro-fluctuations every 30s. Perfect for frontend development.
                </p>
              </div>

              {/* Option 2: Data.gov.sg */}
              <div
                onClick={() => setSourceMode('datagov')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'datagov'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Data.gov.sg API</span>
                  {sourceMode === 'datagov' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Direct official open API from Singapore Gov with real HDB lot sensor counts.
                </p>
              </div>

              {/* Option 3: Custom Backend */}
              <div
                onClick={() => setSourceMode('custom')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'custom'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Custom Backend</span>
                  {sourceMode === 'custom' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Point to your local or deployed Express / FastAPI / NestJS backend service.
                </p>
              </div>
            </div>
          </div>

          {/* Custom Endpoint Input (visible if custom) */}
          {sourceMode === 'custom' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                Custom API Endpoint URL
              </label>
              <input
                type="text"
                value={customEndpoint}
                onChange={e => setCustomEndpoint(e.target.value)}
                placeholder="http://localhost:4000/api/carparks or /api/carparks"
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Endpoint should return an array matching the <code>CarparkItem[]</code> format or Data.gov.sg items array.
              </p>
            </div>
          )}

          {/* Auto Refresh Cadence */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
              Auto-Refresh Cadence
            </label>
            <div className="flex items-center gap-3">
              {[15, 30, 45, 60, 120].map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setRefreshInterval(sec)}
                  className={`px-3 py-1.5 rounded-lg border font-mono tabular-nums text-xs transition-colors ${
                    refreshInterval === sec
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {sec}s
                </button>
              ))}
              <span className="text-slate-400 text-xs">Polling interval</span>
            </div>
          </div>

          {/* Test Connection Button & Status */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white text-xs">
                  Connectivity Test
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verify latency and response payload from the active target.
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult.status === 'testing'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{testResult.status === 'testing' ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {testResult.status !== 'idle' && (
              <div
                className={`mt-3 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : testResult.status === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                }`}
              >
                {testResult.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : testResult.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                ) : (
                  <Server className="w-4 h-4 shrink-0 text-blue-600 mt-0.5 animate-pulse" />
                )}
                <div className="flex-1">
                  <div>{testResult.message}</div>
                  {testResult.latency !== undefined && (
                    <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                      Roundtrip latency: {testResult.latency}ms
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Code Reference for the User's Backend */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Backend Express Proxy Recipe</span>
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
              {sampleExpressSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
