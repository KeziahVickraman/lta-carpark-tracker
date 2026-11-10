import React, { useState } from 'react';
import { ApiConfig, DataSourceMode } from '../services/carparkService';
import { Server, Database, CheckCircle, AlertCircle, Copy, Check, Play, Activity, KeyRound, ExternalLink, Code } from 'lucide-react';

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
    status: 'idle' | 'testing' | 'success' | 'warning' | 'error';
    message: string;
    latency?: number;
    details?: string;
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

  const testHealthEndpoint = async () => {
    setTestResult({ status: 'testing', message: 'Testing /api/health endpoint...' });
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const latency = Math.round(performance.now() - start);

      if (res.ok && data.status === 'ok') {
        const keyConfigured = data.environment?.lta_key_configured;
        setTestResult({
          status: keyConfigured ? 'success' : 'warning',
          message: keyConfigured
            ? `Health check passed! LTA AccountKey is configured. Uptime: ${data.uptime}s.`
            : `Health check passed! Gateway is live, but LTA_DATAMALL_ACCOUNT_KEY is not yet set in .env.`,
          latency,
          details: JSON.stringify(data, null, 2)
        });
      } else {
        throw new Error(data.error || 'Health check failed');
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: `Health check failed: ${err.message}`,
        latency: Math.round(performance.now() - start)
      });
    }
  };

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing', message: 'Pinging endpoint...' });
    const start = performance.now();

    try {
      if (sourceMode === 'simulated') {
        await new Promise(r => setTimeout(r, 120));
        setTestResult({
          status: 'success',
          message: 'Simulated data engine is nominal. 18 Singapore carparks active.',
          latency: Math.round(performance.now() - start)
        });
      } else if (sourceMode === 'lta') {
        const res = await fetch('/api/carparkavailability?skip=0');
        const json = await res.json();
        const latency = Math.round(performance.now() - start);

        if (res.status === 503 || !json.success) {
          setTestResult({
            status: 'warning',
            message: json.error || 'LTA AccountKey not yet configured in environment variables.',
            details: json.instruction || 'Set LTA_DATAMALL_ACCOUNT_KEY in your .env file.',
            latency
          });
        } else {
          setTestResult({
            status: 'success',
            message: `Connected to LTA DataMall v2 via /api/carparkavailability! Retrieved ${json.total_records || json.data?.length} live carpark lots.`,
            latency,
            details: JSON.stringify(json.data?.[0] || json, null, 2)
          });
        }
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
        message: `Connection failed: ${err.message || 'Network / CORS error.'}`,
        latency: Math.round(performance.now() - start)
      });
    }
  };

  const sampleEnvConfig = `# .env file:
LTA_DATAMALL_ACCOUNT_KEY="YOUR_KEY_HERE"

# Test endpoints:
# Health check:
GET /api/health

# Live LTA Carpark lots (HDB + LTA + URA):
GET /api/carparkavailability?all=true`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleEnvConfig);
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
                Serverless Backend & LTA DataMall Gateway
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected via <code>/api/carparkavailability.ts</code> and <code>/api/health.ts</code>
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
              Select Active Data Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: LTA DataMall Serverless */}
              <div
                onClick={() => setSourceMode('lta')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'lta'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LTA DataMall (/api)</span>
                  </span>
                  {sourceMode === 'lta' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Live carparks (HDB + LTA + URA) via <code>/api/carparkavailability</code> using your AccountKey.
                </p>
              </div>

              {/* Option 2: Simulated */}
              <div
                onClick={() => setSourceMode('simulated')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'simulated'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Simulated Singapore Flux</span>
                  {sourceMode === 'simulated' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Authentic SG carparks with real-time fluctuations. Perfect when developing without an API key.
                </p>
              </div>

              {/* Option 3: Data.gov.sg Direct */}
              <div
                onClick={() => setSourceMode('datagov')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'datagov'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Data.gov.sg Direct API</span>
                  {sourceMode === 'datagov' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Open public government endpoint for HDB carparks (no API key required).
                </p>
              </div>

              {/* Option 4: Custom Endpoint */}
              <div
                onClick={() => setSourceMode('custom')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  sourceMode === 'custom'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Custom URL / Microservice</span>
                  {sourceMode === 'custom' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Point to any custom URL, Express backend, or cloud function.
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
                placeholder="/api/carparkavailability or http://localhost:4000/api/carparks"
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Environment Variable Setup Note */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200">
            <div className="flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs">LTA DataMall API Key Ready</div>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">
                  Keys are never hardcoded. Set <code>LTA_DATAMALL_ACCOUNT_KEY</code> in your <code>.env</code> file. When set, <code>/api/carparkavailability</code> forwards your key via the <code>AccountKey</code> header directly to LTA’s <code>CarParkAvailabilityv2</code> service.
                </p>
              </div>
            </div>
          </div>

          {/* Testing buttons */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white text-xs">
                  Serverless Endpoints Test
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verify <code>/api/health</code> and active carpark availability response.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={testHealthEndpoint}
                  disabled={testResult.status === 'testing'}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Check Health</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testResult.status === 'testing'}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{testResult.status === 'testing' ? 'Testing...' : 'Test Source'}</span>
                </button>
              </div>
            </div>

            {testResult.status !== 'idle' && (
              <div
                className={`p-3 rounded-lg border text-xs flex flex-col gap-1.5 ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : testResult.status === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : testResult.status === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {testResult.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : testResult.status === 'warning' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  ) : testResult.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  ) : (
                    <Server className="w-4 h-4 shrink-0 text-blue-600 mt-0.5 animate-pulse" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{testResult.message}</div>
                    {testResult.details && (
                      <div className="text-[11px] opacity-90 mt-1 font-mono">{testResult.details}</div>
                    )}
                    {testResult.latency !== undefined && (
                      <div className="text-[10px] opacity-75 mt-1 font-mono">
                        Latency: {testResult.latency}ms
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Code Reference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Quick Serverless Endpoints Reference</span>
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Config'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-40 border border-slate-800">
              {sampleEnvConfig}
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
