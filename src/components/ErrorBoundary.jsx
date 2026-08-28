import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[TECHXPT ErrorBoundary Caught Exception]:', error, errorInfo);
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.handleReset();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset
        });
      }

      return (
        <div
          role="alert"
          style={{
            minHeight: this.props.isolate ? '320px' : '100vh',
            width: '100%',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            boxSizing: 'border-box',
            fontFamily: 'var(--font-body)'
          }}
        >
          <div
            style={{
              maxWidth: '680px',
              width: '100%',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Top Glow Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#FF2424',
                boxShadow: '0 0 12px rgba(255, 36, 36, 0.8)'
              }}
            />

            {/* Header Telemetry Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#FF2424',
                    display: 'inline-block'
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#FF2424',
                    textTransform: 'uppercase'
                  }}
                >
                  SYSTEM EXCEPTION CAUGHT
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)'
                }}
              >
                ERR_CODE: {this.state.error?.name || 'RUNTIME_ERROR'}
              </span>
            </div>

            {/* Error Content */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem'
                }}
              >
                Component Execution Interrupted
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                An unhandled runtime anomaly occurred in this application module. The execution state was safely intercepted by the system error boundary.
              </p>
            </div>

            {/* Collapsible Error Diagnostics Box */}
            {this.state.error && (
              <div
                style={{
                  backgroundColor: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.75rem',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={14} color="#FF2424" />
                    <span>DIAGNOSTIC LOG: {this.state.error.message?.slice(0, 50)}...</span>
                  </span>
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {this.state.showDetails && (
                  <div
                    style={{
                      padding: '1rem',
                      borderTop: '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      overflowX: 'auto',
                      maxHeight: '180px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}
                  >
                    <strong>Error:</strong> {this.state.error.toString()}
                    <br /><br />
                    <strong>Component Stack:</strong>
                    {this.state.errorInfo?.componentStack || 'No stack trace available.'}
                  </div>
                )}
              </div>
            )}

            {/* Recovery Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center'
              }}
            >
              <button
                onClick={this.handleReset}
                className="btn-tech-accent"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem'
                }}
              >
                <RefreshCw size={15} />
                <span>RETRY MODULE</span>
              </button>

              <button
                onClick={this.handleReload}
                className="btn-tech-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem'
                }}
              >
                <RefreshCw size={15} />
                <span>RELOAD SYSTEM</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn-tech-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.4rem'
                }}
              >
                <Home size={15} />
                <span>GO TO HOMEPAGE</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
