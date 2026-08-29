import React from 'react';

export default function MaintenanceScreen({ message, eta }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'clamp(1.5rem, 5vw, 3.5rem)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Architectural Grid Lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Top Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 900,
          letterSpacing: '0.06em'
        }}>
          TECH<span style={{ color: '#FF2424' }}>XPT</span>
        </div>
        <div style={{
          border: '1px solid rgba(255, 36, 36, 0.4)',
          backgroundColor: 'rgba(255, 36, 36, 0.1)',
          color: '#FF2424',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '0.35rem 0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          ● SYSTEM UPGRADE IN PROGRESS
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '750px',
        position: 'relative',
        zIndex: 10,
        margin: 'auto 0'
      }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 800,
          color: '#FF2424',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#FF2424', display: 'inline-block' }} />
          01 // SCHEDULED MAINTENANCE
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.75rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          textTransform: 'uppercase'
        }}>
          ENGINEERING <br />
          <span style={{ color: '#FF2424' }}>THE NEXT LEVEL.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#A3A3A3',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          fontWeight: 500
        }}>
          {message || 'TECHXPT is currently undergoing scheduled infrastructure upgrades. All digital platforms will return online shortly.'}
        </p>

        {/* ETA & Status Info Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          backgroundColor: '#121212',
          border: '1px solid #262626',
          padding: '1.5rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.25rem'
            }}>
              ESTIMATED TIME TO RETURN
            </div>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#FFFFFF'
            }}>
              {eta || '1 Hour'}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.25rem'
            }}>
              DIRECT INQUIRIES
            </div>
            <div>
              <a
                href="mailto:contact@techxpt.com"
                style={{
                  color: '#FF2424',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                contact@techxpt.com &rarr;
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#737373',
        borderTop: '1px solid #1E1E1E',
        paddingTop: '1.25rem',
        position: 'relative',
        zIndex: 10,
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>&copy; {new Date().getFullYear()} TECHXPT DIGITAL SYSTEMS. ALL RIGHTS RESERVED.</div>
        <div>
          <a
            href="https://api.noteground.in/admin.php"
            style={{
              color: '#737373',
              textDecoration: 'none',
              fontSize: '0.72rem',
              letterSpacing: '0.04em'
            }}
          >
            ADMIN ACCESS &rarr;
          </a>
        </div>
      </footer>
    </div>
  );
}
