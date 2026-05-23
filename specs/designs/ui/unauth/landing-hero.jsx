// LandingHero — marketing landing page hero for myschedlr. Sized for a
// 1280x760 artboard. Top nav + hero copy + dual CTA + product peek + social
// proof. Student-leaning tone (warmer copy, less enterprise jargon).

function LandingHero({ theme }) {
  return (
    <ThemeFrame theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ─── Top nav ─── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 56px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Monogram size={32} theme={theme} />
            <Wordmark size={20} theme={theme} />
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['For Schools', 'For Faculty', 'For Students', 'Pricing'].map((l) => (
              <a key={l} style={{
                fontSize: 14, fontWeight: 500, color: 'var(--ink-soft)',
                textDecoration: 'none', letterSpacing: '-0.005em',
              }}>{l}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button kind="ghost" size="sm">Sign in</Button>
            <Button kind="primary" size="sm">Get a demo</Button>
          </div>
        </header>

        {/* ─── Hero body ─── */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 56,
          padding: '0 56px 32px',
          alignItems: 'center',
          minHeight: 0,
        }}>

          {/* LEFT: copy block */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px',
              background: 'var(--accent-soft)', color: 'var(--accent)',
              borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)' }} />
              Built for multi-tenant edu orgs
            </div>

            <h1 style={{
              margin: 0,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
              color: 'var(--ink)',
              textWrap: 'balance',
            }}>
              Class is in
              <br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'relative', zIndex: 1 }}>session</span>
                <span style={{
                  position: 'absolute', left: '-4%', right: '-4%', bottom: '6%',
                  height: '36%', background: 'var(--accent-soft)', zIndex: 0,
                  borderRadius: 4,
                }} />
              </span>
              <span style={{ color: 'var(--accent)' }}>.</span>
            </h1>

            <p style={{
              margin: '24px 0 0',
              fontSize: 17,
              lineHeight: 1.55,
              color: 'var(--ink-soft)',
              maxWidth: 460,
              fontWeight: 500,
              textWrap: 'pretty',
            }}>
              Schedule courses, run batches, deliver classes and track every student's
              test result — in one app, per organization, with zero cross-tenant
              spillover.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 32 }}>
              <Button kind="primary">Start free for 30 days →</Button>
              <Button kind="secondary">Watch the 2-min tour</Button>
            </div>

            <div style={{
              marginTop: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              fontSize: 12,
              color: 'var(--muted)',
              fontWeight: 500,
            }}>
              <span style={{
                fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontSize: 10.5,
              }}>Trusted by</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                {['NORTHWIND ACADEMY', 'HARBOR TUTORIAL', 'BRIGHTPATH', 'KAVERI INSTITUTE'].map((n) => (
                  <span key={n} style={{
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: 'var(--muted)',
                    fontSize: 11.5,
                  }}>{n}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: product peek — a stylized "next class" widget overlapping a calendar slice */}
          <div style={{ position: 'relative', height: '100%', minHeight: 420 }}>
            {/* Calendar slice (back layer) */}
            <div style={{
              position: 'absolute', inset: '8% 0 0 8%',
              background: 'var(--surface)',
              borderRadius: 'var(--rc)',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--line)',
              overflow: 'hidden',
              transform: 'rotate(-1.2deg)',
            }}>
              {/* Cal header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid var(--line)',
                background: 'var(--surface)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontFamily: 'ui-monospace, monospace', fontSize: 10,
                    color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase',
                  }}>This week</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Batch 2026-A · Grade 11</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--surface-alt)' }} />
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--surface-alt)' }} />
                </div>
              </div>
              {/* Cal grid: 5 days × time slots */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--line)' }}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d, i) => (
                  <div key={d} style={{ background: 'var(--surface)', padding: '10px 8px', minHeight: 200 }}>
                    <div style={{
                      fontFamily: 'ui-monospace, monospace', fontSize: 9.5,
                      color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: 8,
                    }}>{d} · {18 + i}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <CalChip color={i === 0 ? 'accent' : i === 2 ? 'ink' : 'muted'} h={i === 1 ? 40 : 28}>
                        {['Phys', 'Math', 'Chem', 'Phys', 'Bio'][i]}
                      </CalChip>
                      {i !== 1 && (
                        <CalChip color={i === 3 ? 'accent' : 'muted'} h={26}>
                          {['Hist', '', 'Eng', 'CS', 'PE'][i]}
                        </CalChip>
                      )}
                      {(i === 2 || i === 4) && (
                        <CalChip color="ink" h={22}>Test</CalChip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* "Next class" floating card (front layer) */}
            <div style={{
              position: 'absolute', right: 0, bottom: 0,
              width: '64%',
              background: 'var(--surface)',
              borderRadius: 'var(--rc)',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--line)',
              padding: 18,
              transform: 'rotate(1.4deg)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <span style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 10,
                  color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>Up next · 11:30</span>
                <Pill tone="accent">in 6 min</Pill>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Mechanics — Friction on inclined planes
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12,
                }}>SR</div>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                  Sunita Rao · Room R-214
                </span>
              </div>
              <div style={{
                marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>3 readings · 1 quiz</span>
                <Button kind="primary" size="sm">Join class</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeFrame>
  );
}

function CalChip({ children, color = 'muted', h = 26 }) {
  const palette = {
    accent: { bg: 'var(--accent)', fg: 'var(--accent-ink)' },
    ink: { bg: 'var(--ink)', fg: 'var(--surface)' },
    muted: { bg: 'var(--surface-alt)', fg: 'var(--ink-soft)' },
  }[color];
  if (!children) return <div style={{ height: h }} />;
  return (
    <div style={{
      height: h,
      background: palette.bg,
      color: palette.fg,
      borderRadius: 4,
      padding: '0 6px',
      display: 'flex', alignItems: 'center',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '-0.005em',
    }}>{children}</div>
  );
}

window.LandingHero = LandingHero;
