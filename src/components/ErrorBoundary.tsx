import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, CheckCircle2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Production telemetry dispatch: send to APM / Sentry / OpenTelemetry
    if (typeof window !== 'undefined' && (window as any).__PAYTM_APM__) {
      (window as any).__PAYTM_APM__.captureException(error, { extra: errorInfo });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyDiagnostics = () => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      errorName: this.state.error?.name,
      errorMessage: this.state.error?.message,
      componentStack: this.state.errorInfo?.componentStack
    };
    navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-paytm-modal border border-[#E2E8F0] max-w-lg w-full overflow-hidden">
            <div className="bg-[#002970] p-4 text-white flex items-center justify-between border-b border-[#001E53]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">System Recovery Shield</h3>
                  <p className="text-[11px] text-sky-200">Paytm Business Setu • Resilience Boundary</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-red-500/20 text-red-200 border border-red-500/30 px-2 py-0.5 rounded">
                CRITICAL_CATCH
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0F172A]">An unexpected application state was intercepted</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  The dashboard caught an unhandled runtime exception before it could corrupt client session state or ledger buffers.
                </p>
              </div>

              {this.state.error && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-[11px] text-red-700 overflow-x-auto">
                  <p className="font-bold">{this.state.error.name}: {this.state.error.message}</p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-[10px] text-slate-500 mt-2 max-h-28 overflow-y-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack.trim()}
                    </pre>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={this.handleReload}
                  className="bg-[#002970] hover:bg-[#001E53] text-white py-2 px-4 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCw size={14} />
                  <span>Reload Setu Console</span>
                </button>

                <button
                  onClick={this.handleCopyDiagnostics}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  {this.state.copied ? (
                    <>
                      <CheckCircle2 size={14} className="text-[#10B981]" />
                      <span className="text-[#10B981] font-bold">Copied Details</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Diagnostics</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Security &amp; Fault-Tolerance Active</span>
              <span className="font-mono">Code: SEC_BOUNDARY_v2</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
