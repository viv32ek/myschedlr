// landing-top.jsx
// Top of the landing page: sticky nav, hero, trust strip, three-roles section.

// ─── TopNav ────────────────────────────────────────────────────────────────
function TopNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(251,245,234,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
      borderBottom: scrolled ? `1px solid ${SKY.line}` : '1px solid transparent',
      transition: 'background .2s, border-color .2s',
    }}>
      <LContainer>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0',
        }}>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
             style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Monogram size={32} theme={SKY} />
            <Wordmark size={20} theme={SKY} />
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              ['Product', 'roles'],
              ['Features', 'features'],
              ['How it works', 'tenant'],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }}
                 style={{
                   fontSize: 14, fontWeight: 500, color: SKY.inkSoft,
                   textDecoration: 'none', letterSpacing: '-0.005em', cursor: 'pointer',
                 }}>{label}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LButton kind="ghost" size="sm" href="MySchedlr Sign In.html">Sign in</LButton>
            <LButton kind="primary" size="sm" href="MySchedlr Sign In.html?screen=signUp">Get a demo</LButton>
          </div>
        </div>
      </LContainer>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="top" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Soft sky gradient halo behind hero */}
      <div aria-hidden style={{
        position: 'absolute', top: -200, right: -160, width: 720, height: 720,
        background: 'radial-gradient(closest-side, rgba(47,128,237,0.18), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <LContainer>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
          padding: '64px 0 96px', alignItems: 'center',
        }}>
          {/* LEFT: copy */}
          <div>
            <LEyebrow>Built for multi-tenant edu orgs</LEyebrow>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(48px, 6vw, 84px)',
              fontWeight: 700, lineHeight: 0.96,
              letterSpacing: '-0.038em',
              color: SKY.ink,
              textWrap: 'balance',
            }}>
              Class is in
              <br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'relative', zIndex: 1 }}>session</span>
                <span aria-hidden style={{
                  position: 'absolute', left: '-3%', right: '-3%', bottom: '7%',
                  height: '34%', background: SKY.accentSoft, borderRadius: 4, zIndex: 0,
                }} />
              </span>
              <span style={{ color: SKY.accent }}>.</span>
            </h1>
            <p style={{
              margin: '28px 0 0',
              fontSize: 19, lineHeight: 1.55,
              color: SKY.inkSoft, maxWidth: 500, fontWeight: 500,
              textWrap: 'pretty',
            }}>
              Schedule courses, run batches, deliver classes and track every
              student's results — in one app, per organization, with{' '}
              <span style={{ color: SKY.ink, fontWeight: 600 }}>zero cross-tenant spillover</span>.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36, alignItems: 'center' }}>
              <LButton kind="primary" size="lg" href="MySchedlr Sign In.html?screen=signUp">
                Start free for 30 days
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </LButton>
              <LButton kind="secondary" size="lg">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2v10l9-5z" /></svg>
                Watch 2-min tour
              </LButton>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 36 }}>
              <div style={{ display: 'flex' }}>
                {['#ffb27d', '#7dd3fc', '#fbcfe8', '#a7f3d0'].map((c, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: 15,
                    background: c, border: `2px solid ${SKY.bg}`,
                    marginLeft: i ? -8 : 0,
                  }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: SKY.ink, letterSpacing: '-0.005em' }}>
                  Trusted by 84+ schools across India &amp; SEA
                </div>
                <div style={{ fontSize: 12.5, color: SKY.muted, marginTop: 1 }}>
                  Northwind Academy · Harbor Tutorial · Kaveri Institute · Brightpath
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: product peek */}
          <HeroProductPeek />
        </div>
      </LContainer>
    </section>
  );
}

function HeroProductPeek() {
  return (
    <div style={{ position: 'relative', height: 520 }}>
      {/* Back: calendar slice */}
      <div style={{
        position: 'absolute', top: 0, left: 32, right: 0, bottom: 80,
        background: SKY.surface,
        borderRadius: SKY.radiusCard,
        boxShadow: SKY.shadowLg,
        border: `1px solid ${SKY.line}`,
        overflow: 'hidden',
        transform: 'rotate(-1.2deg)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${SKY.line}`,
        }}>
          <div>
            <LCardLabel>This week</LCardLabel>
            <div style={{ fontSize: 15, fontWeight: 600, color: SKY.ink, marginTop: 2 }}>
              Batch 2026-A · Grade 11
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: SKY.surfaceAlt }} />
            <div style={{ width: 24, height: 24, borderRadius: 6, background: SKY.surfaceAlt }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: SKY.line }}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d, i) => (
            <div key={d} style={{ background: SKY.surface, padding: '12px 8px', minHeight: 220 }}>
              <LCardLabel>{d} · {18 + i}</LCardLabel>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <HeroChip color={i === 0 ? 'accent' : i === 2 ? 'ink' : 'muted'} h={i === 1 ? 44 : 30}>
                  {['Phys', 'Math', 'Chem', 'Phys', 'Bio'][i]}
                </HeroChip>
                {i !== 1 && (
                  <HeroChip color={i === 3 ? 'accent' : 'muted'} h={26}>
                    {['Hist', '', 'Eng', 'CS', 'PE'][i]}
                  </HeroChip>
                )}
                {(i === 2 || i === 4) && <HeroChip color="ink" h={22}>Test</HeroChip>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Front: next class card */}
      <div style={{
        position: 'absolute', right: -16, bottom: 0, width: '64%',
        background: SKY.surface,
        borderRadius: SKY.radiusCard,
        boxShadow: SKY.shadowLg,
        border: `1px solid ${SKY.line}`,
        padding: 22,
        transform: 'rotate(1.4deg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <LCardLabel>Up next · 11:30</LCardLabel>
          <LPill tone="accent">in 6 min</LPill>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Mechanics — Friction on inclined planes
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 16,
            background: SKY.accentSoft, color: SKY.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 12,
          }}>SR</div>
          <span style={{ fontSize: 13, color: SKY.inkSoft, fontWeight: 500 }}>
            Sunita Rao · Room R-214
          </span>
        </div>
        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: `1px solid ${SKY.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12.5, color: SKY.muted }}>3 readings · 1 quiz</span>
          <LButton kind="primary" size="sm">Join class</LButton>
        </div>
      </div>
    </div>
  );
}

function HeroChip({ children, color = 'muted', h = 26 }) {
  const palette = {
    accent: { bg: SKY.accent, fg: '#fff' },
    ink: { bg: SKY.ink, fg: SKY.surface },
    muted: { bg: SKY.surfaceAlt, fg: SKY.inkSoft },
  }[color];
  if (!children) return <div style={{ height: h }} />;
  return (
    <div style={{
      height: h, background: palette.bg, color: palette.fg,
      borderRadius: 6, padding: '0 8px',
      display: 'flex', alignItems: 'center',
      fontSize: 11, fontWeight: 600, letterSpacing: '-0.005em',
    }}>{children}</div>
  );
}

// ─── TrustBar ──────────────────────────────────────────────────────────────
function TrustBar() {
  const stats = [
    ['12,000+', 'classes scheduled / week'],
    ['4,200',   'faculty delivering'],
    ['84',      'schools onboarded'],
    ['99.98%',  'uptime · last 90d'],
  ];
  return (
    <section style={{ borderTop: `1px solid ${SKY.line}`, borderBottom: `1px solid ${SKY.line}`, background: SKY.surface }}>
      <LContainer>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '36px 0', gap: 32,
        }}>
          {stats.map(([n, l], i) => (
            <div key={i} style={{
              borderLeft: i ? `1px solid ${SKY.line}` : 'none',
              paddingLeft: i ? 32 : 0,
            }}>
              <div style={{
                fontSize: 36, fontWeight: 700, color: SKY.ink,
                letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>{n}</div>
              <div style={{ fontSize: 13, color: SKY.muted, marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </LContainer>
    </section>
  );
}

Object.assign(window, { TopNav, Hero, TrustBar });
