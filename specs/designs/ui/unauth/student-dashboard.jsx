// StudentDashboard — a slice of the in-app student experience, sized for a
// 1280x800 artboard. Sidebar + top bar + today's classes + upcoming tests +
// progress stats. Shows the theme working as product UI, not just brand.

function StudentDashboard({ theme }) {
  return (
    <ThemeFrame theme={theme}>
      <div style={{ display: 'grid', gridTemplateColumns: '232px 1fr', height: '100%' }}>

        {/* ─── Sidebar ─── */}
        <aside style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--line)',
          padding: '22px 18px',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
            <Monogram size={28} theme={theme} />
            <Wordmark size={17} theme={theme} />
          </div>

          {/* tenant switcher */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--rb)',
            padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 'var(--rc)',
              background: 'var(--ink)', color: 'var(--surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>NA</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>TENANT</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Northwind Academy</div>
            </div>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: 'var(--muted)' }}>
              <path d="M2 4l3 3 3-3" />
            </svg>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <NavItem icon="●" active>My day</NavItem>
            <NavItem icon="▢">Batches</NavItem>
            <NavItem icon="◷">Schedule</NavItem>
            <NavItem icon="✓">Tests &amp; results</NavItem>
            <NavItem icon="◆">Library</NavItem>
            <NavItem icon="◐">Profile</NavItem>
          </nav>

          <div style={{ marginTop: 'auto', padding: '12px', background: 'var(--accent-soft)', borderRadius: 'var(--rc)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>Streak · 12 days</div>
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < 12 ? 'var(--accent)' : 'var(--line)',
                }} />
              ))}
            </div>
          </div>
        </aside>

        {/* ─── Main column ─── */}
        <main style={{ padding: '22px 32px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 10.5,
                color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>Tuesday · May 19</div>
              <h1 style={{
                margin: '4px 0 0',
                fontSize: 28, fontWeight: 700, color: 'var(--ink)',
                letterSpacing: '-0.025em',
              }}>Hey Anika — 3 classes today.</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--rb)',
                padding: '8px 12px',
                fontSize: 13, color: 'var(--muted)',
                display: 'flex', alignItems: 'center', gap: 8,
                minWidth: 200,
              }}>
                <span>⌕</span>
                <span>Search batches, tests…</span>
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 10,
                  padding: '2px 5px',
                  background: 'var(--surface-alt)',
                  borderRadius: 4,
                }}>⌘K</span>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 18,
                background: 'var(--accent)', color: 'var(--accent-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13,
              }}>AK</div>
            </div>
          </div>

          {/* stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Stat label="Avg score" value="84%" delta="+6" trend="up" />
            <Stat label="Attendance" value="96%" delta="+2" trend="up" />
            <Stat label="Tests due" value="2" delta="this week" trend="flat" />
            <Stat label="Class rank" value="#7" delta="↑ 3" trend="up" />
          </div>

          {/* two-col: today's classes + upcoming tests */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>

            {/* Today's classes */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--rc)',
              boxShadow: 'var(--shadow)',
              padding: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.015em' }}>Today's classes</h2>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>3 of 3 scheduled</span>
              </div>
              <ClassRow time="09:00" status="done" subject="Mathematics" topic="Trig identities · Pt. 2" room="R-118" teacher="V. Menon" />
              <ClassRow time="11:30" status="next" subject="Physics" topic="Friction on inclined planes" room="R-214" teacher="S. Rao" />
              <ClassRow time="14:00" status="upcoming" subject="English Lit" topic="Things Fall Apart · Ch. 7-9" room="R-302" teacher="P. D'Souza" />
            </div>

            {/* Upcoming tests */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--rc)',
              boxShadow: 'var(--shadow)',
              padding: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.015em' }}>Upcoming tests</h2>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>This week</span>
              </div>
              <TestRow when="Thu" subject="Chemistry" title="Periodic table — Unit 4" weight="20%" />
              <TestRow when="Fri" subject="History" title="Mughal era timeline" weight="15%" />

              <div style={{
                marginTop: 'auto',
                padding: '12px 14px',
                background: 'var(--bg)',
                borderRadius: 'var(--rc)',
                border: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Last result</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>Biology — Cell biology</div>
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 700, color: 'var(--accent)',
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
                }}>92<span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>/100</span></div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </ThemeFrame>
  );
}

function NavItem({ children, icon, active }) {
  return (
    <a style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 10px',
      borderRadius: 'var(--rb)',
      background: active ? 'var(--surface-alt)' : 'transparent',
      color: active ? 'var(--ink)' : 'var(--ink-soft)',
      fontSize: 13.5,
      fontWeight: active ? 600 : 500,
      cursor: 'pointer',
      textDecoration: 'none',
      position: 'relative',
    }}>
      {active && <span style={{
        position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)',
        width: 3, height: 18, background: 'var(--accent)', borderRadius: '0 2px 2px 0',
      }} />}
      <span style={{
        width: 18, display: 'inline-flex', justifyContent: 'center',
        color: active ? 'var(--accent)' : 'var(--muted)',
        fontSize: 13,
      }}>{icon}</span>
      {children}
    </a>
  );
}

function Stat({ label, value, delta, trend }) {
  const trendColor = trend === 'up' ? 'var(--accent)' : 'var(--muted)';
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--rc)',
      padding: '12px 14px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{
          fontSize: 26, fontWeight: 700, color: 'var(--ink)',
          letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
        }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: trendColor }}>{delta}</span>
      </div>
    </div>
  );
}

function ClassRow({ time, status, subject, topic, room, teacher }) {
  const tone = {
    done: { dot: 'var(--muted)', label: 'Done', labelBg: 'var(--surface-alt)', labelFg: 'var(--muted)' },
    next: { dot: 'var(--accent)', label: 'Up next', labelBg: 'var(--accent-soft)', labelFg: 'var(--accent)' },
    upcoming: { dot: 'var(--line)', label: '14:00', labelBg: 'transparent', labelFg: 'var(--muted)' },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      paddingBottom: 14,
      borderBottom: '1px solid var(--line)',
      opacity: status === 'done' ? 0.65 : 1,
    }}>
      <div style={{
        width: 56,
        fontSize: 16, fontWeight: 700, color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
        textDecoration: status === 'done' ? 'line-through' : 'none',
        textDecorationColor: 'var(--muted)',
      }}>{time}</div>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: tone.dot, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{subject}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>· {teacher}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{topic}</div>
      </div>
      <div style={{
        fontSize: 11, fontFamily: 'ui-monospace, monospace',
        color: 'var(--muted)', letterSpacing: '0.06em',
      }}>{room}</div>
      <span style={{
        padding: '4px 8px',
        background: tone.labelBg,
        color: tone.labelFg,
        fontSize: 11, fontWeight: 600,
        borderRadius: 999,
        border: status === 'upcoming' ? '1px solid var(--line)' : 'none',
      }}>{tone.label}</span>
    </div>
  );
}

function TestRow({ when, subject, title, weight }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      paddingBottom: 12,
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--rc)',
        background: 'var(--surface-alt)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 9.5, fontWeight: 600, color: 'var(--muted)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>{when}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{subject}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{title}</div>
      </div>
      <span style={{
        fontSize: 11, fontFamily: 'ui-monospace, monospace',
        color: 'var(--accent)', fontWeight: 600,
        letterSpacing: '0.04em',
      }}>{weight}</span>
    </div>
  );
}

window.StudentDashboard = StudentDashboard;
