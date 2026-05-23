import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─── Design tokens ───────────────────────────────────────────────────────────
const SKY = {
  bg: '#fbf5ea',
  surface: '#ffffff',
  surfaceAlt: '#f1ebdc',
  surfaceDeep: '#0e1320',
  ink: '#1a1714',
  inkSoft: '#3d3833',
  muted: '#7a7066',
  accent: '#2f80ed',
  accentDeep: '#1f5fc3',
  accentSoft: '#d8e7fb',
  accentInk: '#ffffff',
  line: 'rgba(26,23,20,0.10)',
  lineStrong: 'rgba(26,23,20,0.18)',
  radiusCard: 12,
  radiusButton: 14,
  shadow: '0 1px 2px rgba(26,23,20,0.05), 0 10px 30px rgba(47,128,237,0.07)',
  shadowLg: '0 4px 12px rgba(26,23,20,0.08), 0 32px 60px rgba(47,128,237,0.10)',
};

// ─── Brand mark ──────────────────────────────────────────────────────────────
function Monogram({ size = 32, accent, accentInk, radiusCard }) {
  const r = Math.min(size * 0.18, (radiusCard ?? SKY.radiusCard) + 4);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="MySchedlr">
      <rect x="0" y="0" width="32" height="32" rx={r} fill={accent ?? SKY.accent} />
      <rect x="11" y="7" width="3.4" height="18" rx="0.6" fill={accentInk ?? SKY.accentInk} opacity="0.92" />
      <rect x="19" y="7" width="3.4" height="11" rx="0.6" fill={accentInk ?? SKY.accentInk} opacity="0.92" />
    </svg>
  );
}

function Wordmark({ size = 22, color, accentColor }) {
  return (
    <span style={{
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-0.025em',
      color: color ?? SKY.ink,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'baseline',
    }}>
      myschedlr<span style={{ color: accentColor ?? SKY.accent }}>.</span>
    </span>
  );
}

// ─── Layout primitives ───────────────────────────────────────────────────────
function LContainer({ children, style }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}

function LSection({ id, children, bg, ink, eyebrow, title, subtitle, align = 'left', dense = false, style }) {
  return (
    <section id={id} style={{ background: bg || 'transparent', color: ink || 'inherit', padding: dense ? '72px 0' : '120px 0', ...style }}>
      <LContainer>
        {(eyebrow || title || subtitle) && (
          <div style={{
            marginBottom: 56,
            textAlign: align,
            maxWidth: align === 'center' ? 680 : 'none',
            marginLeft: align === 'center' ? 'auto' : 0,
            marginRight: align === 'center' ? 'auto' : 0,
          }}>
            {eyebrow && <LEyebrow ink={ink}>{eyebrow}</LEyebrow>}
            {title && (
              <h2 style={{
                margin: '0',
                fontSize: 'clamp(34px, 4vw, 52px)',
                fontWeight: 700,
                letterSpacing: '-0.028em',
                lineHeight: 1.05,
                textWrap: 'balance',
                color: ink || SKY.ink,
              }}>{title}</h2>
            )}
            {subtitle && (
              <p style={{
                margin: '16px 0 0',
                fontSize: 18,
                lineHeight: 1.5,
                color: ink ? 'rgba(255,255,255,0.7)' : SKY.muted,
                maxWidth: 620,
                marginLeft: align === 'center' ? 'auto' : 0,
                marginRight: align === 'center' ? 'auto' : 0,
                textWrap: 'pretty',
                fontWeight: 500,
              }}>{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </LContainer>
    </section>
  );
}

function LEyebrow({ children, tone = 'accent', ink }) {
  const onDark = ink === '#fff';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px',
      background: onDark ? 'rgba(255,255,255,0.08)' : SKY.accentSoft,
      color: onDark ? 'rgba(255,255,255,0.85)' : SKY.accent,
      borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      letterSpacing: '-0.005em',
      marginBottom: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: onDark ? '#fff' : SKY.accent }} />
      {children}
    </div>
  );
}

function LButton({ children, kind = 'primary', size = 'md', onClick, href, to, style, disabled }) {
  const sizes = {
    sm: { p: '8px 14px', fs: 13, gap: 6 },
    md: { p: '12px 20px', fs: 15, gap: 8 },
    lg: { p: '16px 28px', fs: 16, gap: 10 },
  }[size];
  const base = {
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: sizes.fs,
    letterSpacing: '-0.01em',
    padding: sizes.p,
    borderRadius: SKY.radiusButton,
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizes.gap,
    lineHeight: 1,
    textDecoration: 'none',
    transition: 'transform .08s, background .12s, box-shadow .12s',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };
  const kinds = {
    primary: { background: SKY.accent, color: '#fff', boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 4px 16px rgba(47,128,237,0.28)' },
    primaryDark: { background: SKY.ink, color: '#fff' },
    secondary: { background: SKY.surface, color: SKY.ink, boxShadow: `inset 0 0 0 1px ${SKY.lineStrong}` },
    secondaryDark: { background: 'rgba(255,255,255,0.08)', color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' },
    ghost: { background: 'transparent', color: SKY.inkSoft },
  }[kind];
  const merged = { ...base, ...kinds };
  if (to) return <Link to={to} style={merged}>{children}</Link>;
  if (href) return <a href={href} style={merged}>{children}</a>;
  return <button onClick={onClick} disabled={disabled} style={merged}>{children}</button>;
}

function LPill({ children, tone = 'accent' }) {
  const tones = {
    accent: { bg: SKY.accentSoft, fg: SKY.accent, dotC: SKY.accent },
    surface: { bg: SKY.surface, fg: SKY.ink, dotC: SKY.accent, border: `1px solid ${SKY.line}` },
    deep: { bg: 'rgba(255,255,255,0.10)', fg: '#fff', dotC: '#fff' },
  }[tone];
  return (
    <span style={{
      background: tones.bg, color: tones.fg,
      border: tones.border || 'none',
      fontSize: 12, fontWeight: 600,
      padding: '6px 12px', borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      letterSpacing: '-0.005em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: tones.dotC }} />
      {children}
    </span>
  );
}

function LCardLabel({ children, color }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10.5, fontWeight: 600,
      color: color || SKY.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
    }}>{children}</div>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

// ─── TopNav ──────────────────────────────────────────────────────────────────
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Monogram size={32} />
            <Wordmark size={20} />
          </button>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[['Product', 'roles'], ['Features', 'features'], ['How it works', 'tenant']].map(([label, id]) => (
              <button key={id}
                onClick={() => scrollToId(id)}
                style={{ fontSize: 14, fontWeight: 500, color: SKY.inkSoft, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.005em', padding: 0, fontFamily: 'inherit' }}
              >{label}</button>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LButton kind="ghost" size="sm" to="/login">Sign in</LButton>
            <LButton kind="primary" size="sm" to="/signup">Get a demo</LButton>
          </div>
        </div>
      </LContainer>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
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

function HeroProductPeek() {
  return (
    <div style={{ position: 'relative', height: 520 }}>
      <div style={{
        position: 'absolute', top: 0, left: 32, right: 0, bottom: 80,
        background: SKY.surface,
        borderRadius: SKY.radiusCard,
        boxShadow: SKY.shadowLg,
        border: `1px solid ${SKY.line}`,
        overflow: 'hidden',
        transform: 'rotate(-1.2deg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${SKY.line}` }}>
          <div>
            <LCardLabel>This week</LCardLabel>
            <div style={{ fontSize: 15, fontWeight: 600, color: SKY.ink, marginTop: 2 }}>Batch 2026-A · Grade 11</div>
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
                {i !== 1 && <HeroChip color={i === 3 ? 'accent' : 'muted'} h={26}>{['Hist', '', 'Eng', 'CS', 'PE'][i]}</HeroChip>}
                {(i === 2 || i === 4) && <HeroChip color="ink" h={22}>Test</HeroChip>}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <div style={{ width: 32, height: 32, borderRadius: 16, background: SKY.accentSoft, color: SKY.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>SR</div>
          <span style={{ fontSize: 13, color: SKY.inkSoft, fontWeight: 500 }}>Sunita Rao · Room R-214</span>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${SKY.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12.5, color: SKY.muted }}>3 readings · 1 quiz</span>
          <LButton kind="primary" size="sm">Join class</LButton>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" style={{ position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', top: -200, right: -160, width: 720, height: 720,
        background: 'radial-gradient(closest-side, rgba(47,128,237,0.18), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <LContainer>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, padding: '64px 0 96px', alignItems: 'center' }}>
          <div>
            <LEyebrow>Built for multi-tenant edu orgs</LEyebrow>
            <h1 style={{ margin: 0, fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 700, lineHeight: 0.96, letterSpacing: '-0.038em', color: SKY.ink, textWrap: 'balance' }}>
              Class is in
              <br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'relative', zIndex: 1 }}>session</span>
                <span aria-hidden style={{ position: 'absolute', left: '-3%', right: '-3%', bottom: '7%', height: '34%', background: SKY.accentSoft, borderRadius: 4, zIndex: 0 }} />
              </span>
              <span style={{ color: SKY.accent }}>.</span>
            </h1>
            <p style={{ margin: '28px 0 0', fontSize: 19, lineHeight: 1.55, color: SKY.inkSoft, maxWidth: 500, fontWeight: 500, textWrap: 'pretty' }}>
              Schedule courses, run batches, deliver classes and track every student's results — in one app, per organization, with{' '}
              <span style={{ color: SKY.ink, fontWeight: 600 }}>zero cross-tenant spillover</span>.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36, alignItems: 'center' }}>
              <LButton kind="primary" size="lg" to="/signup">
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
                  <div key={i} style={{ width: 30, height: 30, borderRadius: 15, background: c, border: `2px solid ${SKY.bg}`, marginLeft: i ? -8 : 0 }} />
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
          <HeroProductPeek />
        </div>
      </LContainer>
    </section>
  );
}

// ─── TrustBar ────────────────────────────────────────────────────────────────
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '36px 0', gap: 32 }}>
          {stats.map(([n, l], i) => (
            <div key={i} style={{ borderLeft: i ? `1px solid ${SKY.line}` : 'none', paddingLeft: i ? 32 : 0 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 13, color: SKY.muted, marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </LContainer>
    </section>
  );
}

// ─── Roles section ───────────────────────────────────────────────────────────
const ROLES = {
  admin: {
    label: 'Admin',
    eyebrow: 'For school operators',
    title: 'Shape the school. Once.',
    blurb: 'Stand up courses, batches, faculty rosters and academic calendars from a single console. Multi-tenant by default — onboard a sister-school in an afternoon.',
    bullets: [
      'Bulk-import students, faculty and classrooms from CSV',
      'Define course → batch → section hierarchies once, clone yearly',
      'Tenant-scoped role permissions with audit log',
      'Real-time occupancy, attendance and revenue dashboards',
    ],
  },
  faculty: {
    label: 'Faculty',
    eyebrow: 'For teachers',
    title: 'Spend the hour teaching, not chasing.',
    blurb: 'See your day, take attendance in one tap, push readings to a batch, and grade tests with auto-keys. Every result writes back to the parent tenant.',
    bullets: [
      'Today-view: classes, materials and pending grading in one screen',
      'One-tap attendance with parent SMS auto-send',
      'Schedule make-up classes with conflict detection',
      'Auto-graded MCQs + rubric-graded subjective tests',
    ],
  },
  student: {
    label: 'Student',
    eyebrow: 'For learners',
    title: "Know what's next. Always.",
    blurb: 'Your batch, your schedule, your tests and your scores — in one place. Streak tracking and weekly digests keep students moving without nagging.',
    bullets: [
      'Live class joins, materials and notes per batch',
      'Test schedule with reminders 24h, 1h and 5m before',
      'Score trends per subject and rank in batch',
      'Weekly digest to parents — opt-in per tenant',
    ],
  },
};

function MiniWindow({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: SKY.surfaceAlt, borderBottom: `1px solid ${SKY.line}` }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: 5, background: '#ff6058' }} />
          <span style={{ width: 9, height: 9, borderRadius: 5, background: '#ffbd2e' }} />
          <span style={{ width: 9, height: 9, borderRadius: 5, background: '#28c941' }} />
        </div>
        <span style={{ marginLeft: 12, fontSize: 12, color: SKY.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function AdminPeek() {
  return (
    <MiniWindow title="northwind.myschedlr.app/admin">
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <LCardLabel>Tenant · Northwind Academy</LCardLabel>
            <div style={{ fontSize: 18, fontWeight: 700, color: SKY.ink, marginTop: 4, letterSpacing: '-0.02em' }}>Operations</div>
          </div>
          <LPill tone="accent">Live</LPill>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[['Batches', '24'], ['Faculty', '38'], ['Students', '612'], ['Rooms', '18']].map(([l, n]) => (
            <div key={l} style={{ background: SKY.bg, borderRadius: 8, padding: '10px 12px', border: `1px solid ${SKY.line}` }}>
              <div style={{ fontSize: 9.5, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: SKY.ink, marginTop: 2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: SKY.bg, borderRadius: 8, border: `1px solid ${SKY.line}`, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: SKY.ink }}>Today · room occupancy</span>
            <span style={{ fontSize: 10, color: SKY.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>09:00 → 17:00</span>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gap: 4, flex: 1, minHeight: 0 }}>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 9.5, color: SKY.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>R-{200 + row}</span>
                <div style={{ position: 'relative', height: '60%', background: SKY.surface, borderRadius: 4, border: `1px solid ${SKY.line}` }}>
                  {[[8, 24], [38, 18], [62, 14]].slice(0, row % 4 + 1).map(([l, w], i) => (
                    <div key={i} style={{ position: 'absolute', left: l + '%', width: w + '%', top: 2, bottom: 2, background: i === 0 ? SKY.accent : i === 1 ? SKY.ink : SKY.muted, borderRadius: 3 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MiniWindow>
  );
}

function FacultyPeek() {
  return (
    <MiniWindow title="northwind.myschedlr.app/teach">
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <LCardLabel>Tue · May 19 · Mr. Rao</LCardLabel>
          <div style={{ fontSize: 18, fontWeight: 700, color: SKY.ink, marginTop: 4, letterSpacing: '-0.02em' }}>My day · 4 classes</div>
        </div>
        {[
          { t: '09:00', s: 'Mathematics · 9-B', loc: 'R-118', state: 'done' },
          { t: '11:30', s: 'Physics · 11-A',    loc: 'R-214', state: 'live' },
          { t: '14:00', s: 'Physics · 11-B',    loc: 'R-214', state: 'next' },
          { t: '15:30', s: 'Make-up · 12-A',    loc: 'R-220', state: 'next' },
        ].map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            background: c.state === 'live' ? SKY.accentSoft : SKY.bg,
            border: `1px solid ${c.state === 'live' ? SKY.accent : SKY.line}`,
            borderRadius: 8,
            opacity: c.state === 'done' ? 0.55 : 1,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: SKY.ink, width: 42, fontVariantNumeric: 'tabular-nums', textDecoration: c.state === 'done' ? 'line-through' : 'none' }}>{c.t}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: SKY.ink }}>{c.s}</div>
              <div style={{ fontSize: 10.5, color: SKY.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 1 }}>{c.loc}</div>
            </div>
            {c.state === 'live' && <LPill tone="accent">Live now</LPill>}
            {c.state === 'next' && <span style={{ fontSize: 11, color: SKY.muted, fontWeight: 600 }}>upcoming</span>}
            {c.state === 'done' && <span style={{ fontSize: 11, color: SKY.muted, fontWeight: 600 }}>27 / 28 ✓</span>}
          </div>
        ))}
      </div>
    </MiniWindow>
  );
}

function StudentPeek() {
  return (
    <MiniWindow title="northwind.myschedlr.app">
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <LCardLabel>Hey Anika · 3 classes today</LCardLabel>
            <div style={{ fontSize: 18, fontWeight: 700, color: SKY.ink, marginTop: 4, letterSpacing: '-0.02em' }}>Up next · in 6 min</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: SKY.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>AK</div>
        </div>
        <div style={{ background: SKY.bg, borderRadius: 10, padding: 14, border: `1px solid ${SKY.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: SKY.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>11:30 · R-214</span>
            <LPill tone="accent">in 6 min</LPill>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.015em' }}>Mechanics — Friction</div>
          <div style={{ fontSize: 11.5, color: SKY.muted, marginTop: 4 }}>Sunita Rao · 3 readings · 1 quiz</div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, minHeight: 0 }}>
          <div style={{ background: SKY.bg, borderRadius: 8, padding: 12, border: `1px solid ${SKY.line}` }}>
            <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontWeight: 600 }}>Avg score</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: SKY.ink, marginTop: 2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>84<span style={{ fontSize: 12, color: SKY.muted, fontWeight: 500 }}>%</span></div>
            <div style={{ fontSize: 10.5, color: SKY.accent, fontWeight: 600, marginTop: 2 }}>↑ 6 vs last test</div>
          </div>
          <div style={{ background: SKY.bg, borderRadius: 8, padding: 12, border: `1px solid ${SKY.line}` }}>
            <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontWeight: 600 }}>Streak</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: SKY.ink, marginTop: 2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>12<span style={{ fontSize: 12, color: SKY.muted, fontWeight: 500 }}>d</span></div>
            <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < 12 ? SKY.accent : SKY.line }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MiniWindow>
  );
}

function RolesSection() {
  const [active, setActive] = useState('student');
  const r = ROLES[active];
  return (
    <LSection id="roles" bg={SKY.bg} align="center" eyebrow="Product" title="Three roles. One school OS." subtitle="Each tenant runs MySchedlr their way — admins shape the structure, faculty deliver the classes, students track the work. Every action stays inside the tenant boundary.">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div role="tablist" style={{ display: 'inline-flex', background: SKY.surface, border: `1px solid ${SKY.line}`, borderRadius: 999, padding: 4, gap: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          {Object.entries(ROLES).map(([key, role]) => {
            const on = active === key;
            return (
              <button key={key} role="tab" aria-selected={on}
                onClick={() => setActive(key)}
                style={{ border: 'none', cursor: 'pointer', padding: '10px 22px', borderRadius: 999, background: on ? SKY.accent : 'transparent', color: on ? '#fff' : SKY.inkSoft, fontFamily: 'inherit', fontWeight: 600, fontSize: 14, letterSpacing: '-0.005em', transition: 'background .15s, color .15s' }}
              >{role.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.1fr', gap: 56, alignItems: 'center', textAlign: 'left' }}>
        <div>
          <LCardLabel color={SKY.accent}>{r.eyebrow}</LCardLabel>
          <h3 style={{ margin: '12px 0 16px', fontSize: 36, fontWeight: 700, letterSpacing: '-0.028em', lineHeight: 1.1, color: SKY.ink, textWrap: 'balance' }}>{r.title}</h3>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: SKY.inkSoft, fontWeight: 500, textWrap: 'pretty' }}>{r.blurb}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {r.bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 10, background: SKY.accentSoft, color: SKY.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l2.5 2.5L9 3" /></svg>
                </span>
                <span style={{ fontSize: 15, color: SKY.ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28 }}>
            <LButton kind="secondary" size="md">
              See {r.label.toLowerCase()} demo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" /></svg>
            </LButton>
          </div>
        </div>

        <div style={{ background: SKY.surface, borderRadius: SKY.radiusCard, boxShadow: SKY.shadowLg, border: `1px solid ${SKY.line}`, overflow: 'hidden', aspectRatio: '4/3' }}>
          {active === 'admin' && <AdminPeek />}
          {active === 'faculty' && <FacultyPeek />}
          {active === 'student' && <StudentPeek />}
        </div>
      </div>
    </LSection>
  );
}

// ─── Features section ────────────────────────────────────────────────────────
const FEATURES = [
  { t: 'Smart scheduling',    d: 'Auto-suggests slots based on faculty, room and batch availability. Drag to override.' },
  { t: 'One-tap attendance',  d: 'Take attendance in seconds. Parents notified on absence by SMS or email.' },
  { t: 'Test management',     d: 'Build MCQ, subjective or hybrid tests. Auto-grade, rubric-grade or hand-grade.' },
  { t: 'Result analytics',    d: 'Per-student trends, per-batch ranks, per-subject heatmaps. Drill down to the question.' },
  { t: 'Parent reports',      d: 'Weekly digests delivered automatically. Tenant-configurable templates.' },
  { t: 'Integrations & SSO',  d: 'Google Calendar, Zoom, Meet, Microsoft 365. SAML SSO on Pro and Enterprise.' },
];

function FeatureGlyph({ i }) {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
      {i === 0 && (<><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 3v3M13 3v3" /><circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" /></>)}
      {i === 1 && (<><path d="M3 11l3 3 5-7" /><path d="M11 11l3 3 4-7" /></>)}
      {i === 2 && (<><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M6 8h8M6 11h8M6 14h4" /></>)}
      {i === 3 && (<><path d="M3 16V8M8 16V5M13 16v-6M18 16V3" /><path d="M2 17h17" /></>)}
      {i === 4 && (<><path d="M3 5h14v9H5l-2 2z" /><path d="M7 9h6M7 11h4" /></>)}
      {i === 5 && (<><rect x="2" y="6" width="8" height="8" rx="1.5" /><rect x="10" y="6" width="8" height="8" rx="1.5" /><path d="M10 10h0" /></>)}
    </svg>
  );
}

function FeaturesSection() {
  return (
    <LSection id="features" align="center" eyebrow="Features" title="Everything you need to run academic schedules." subtitle="From the first batch to the final report card — MySchedlr handles the workflow, not just the calendar.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ background: SKY.surface, border: `1px solid ${SKY.line}`, borderRadius: SKY.radiusCard, padding: 28, boxShadow: SKY.shadow, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 220, position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: SKY.accentSoft, color: SKY.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FeatureGlyph i={i} />
            </div>
            <h4 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.02em' }}>{f.t}</h4>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: SKY.inkSoft, fontWeight: 500 }}>{f.d}</p>
            <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, color: SKY.muted, letterSpacing: '0.04em' }}>0{i + 1}</div>
          </div>
        ))}
      </div>
    </LSection>
  );
}

// ─── Multi-tenant section ────────────────────────────────────────────────────
function TenantDiagram() {
  const tenants = [
    { name: 'Northwind Academy', color: '#3b82f6', sub: 'northwind', students: 612,  faculty: 38 },
    { name: 'Harbor Tutorial',   color: '#f97316', sub: 'harbor',    students: 184,  faculty: 12 },
    { name: 'Kaveri Institute',  color: '#10b981', sub: 'kaveri',    students: 1042, faculty: 67 },
  ];
  return (
    <div style={{ position: 'relative', padding: '32px 16px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative', zIndex: 2 }}>
        {tenants.map((t, i) => (
          <div key={i} style={{ background: '#fff', color: SKY.ink, borderRadius: SKY.radiusCard, padding: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.35)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <LPill tone="accent">isolated</LPill>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.01em' }}>{t.name}</div>
            <div style={{ fontSize: 11.5, color: SKY.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 2 }}>{t.sub}.myschedlr.app</div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${SKY.line}`, display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Students</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: SKY.ink, fontVariantNumeric: 'tabular-nums' }}>{t.students.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Faculty</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: SKY.ink, fontVariantNumeric: 'tabular-nums' }}>{t.faculty}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: 6, background: t.color, border: '2px solid ' + SKY.surfaceDeep }} />
          </div>
        ))}
      </div>

      <svg width="100%" height="180" viewBox="0 0 600 180" style={{ marginTop: -8, display: 'block' }} preserveAspectRatio="none">
        <path d="M100,0 C100,40 300,60 300,100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
        <path d="M300,0 L300,100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
        <path d="M500,0 C500,40 300,60 300,100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
      </svg>

      <div style={{ margin: '-72px auto 0', background: SKY.accent, color: '#fff', padding: '18px 28px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 40px rgba(47,128,237,0.4)', position: 'relative', zIndex: 2, left: '50%', transform: 'translateX(-50%)' }}>
        <Monogram size={28} accent="#fff" accentInk={SKY.accent} radiusCard={6} />
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.015em' }}>myschedlr platform</span>
        <span style={{ fontSize: 11, fontFamily: '"JetBrains Mono", ui-monospace, monospace', background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: 6, letterSpacing: '0.04em' }}>shared infra</span>
      </div>
    </div>
  );
}

function MultiTenantSection() {
  return (
    <LSection id="tenant" bg={SKY.surfaceDeep} ink="#fff" align="center" eyebrow="Architecture" title="Multi-tenant by design. Zero spillover." subtitle="Every school runs in a fully isolated tenant. Same product, same updates, completely separate data — guaranteed at the database, cache and audit-log layer.">
      <TenantDiagram />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 64, textAlign: 'left' }}>
        {[
          { t: 'Tenant-scoped subdomain', d: 'Each org gets their own URL — northwind.myschedlr.app — branded with their logo, colors and policies.' },
          { t: 'Hard data isolation',     d: 'Row-level security at the database layer. Cross-tenant queries return zero rows by construction, not by convention.' },
          { t: 'Per-tenant admin controls', d: "Roles, permissions, retention policies and SSO live inside each tenant. Org admins never see another school's settings." },
        ].map((f, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: SKY.radiusCard, padding: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: SKY.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {i === 0 && <><path d="M3 5h12M3 9h12M3 13h6" /><circle cx="13" cy="13" r="2.5" /></>}
                {i === 1 && <><rect x="3" y="4" width="12" height="11" rx="1.5" /><path d="M3 8h12M8 4v11" /></>}
                {i === 2 && <><circle cx="9" cy="6" r="2.5" /><path d="M3 15c0-3 3-5 6-5s6 2 6 5" /></>}
              </svg>
            </div>
            <h4 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.015em' }}>{f.t}</h4>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)' }}>{f.d}</p>
          </div>
        ))}
      </div>
    </LSection>
  );
}

// ─── Big CTA ─────────────────────────────────────────────────────────────────
function CTAEmailForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
      style={{ display: 'flex', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: SKY.radiusButton, padding: 4, minWidth: 360, alignItems: 'center', backdropFilter: 'blur(8px)' }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitted}
        placeholder={submitted ? "You're in. We'll reach out within 24h." : 'you@yourschool.edu'}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', padding: '12px 14px', fontSize: 15, fontFamily: 'inherit', fontWeight: 500 }}
      />
      <button type="submit" disabled={submitted} style={{ background: '#fff', color: SKY.accent, border: 'none', cursor: submitted ? 'default' : 'pointer', padding: '12px 20px', borderRadius: SKY.radiusButton - 4, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
        {submitted ? 'Sent ✓' : 'Get a demo →'}
      </button>
    </form>
  );
}

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l2.5 2.5L11 4" />
    </svg>
  );
}

function BigCTA() {
  return (
    <section id="cta" style={{ padding: '40px 0 96px' }}>
      <LContainer>
        <div style={{ background: `linear-gradient(135deg, ${SKY.accent} 0%, ${SKY.accentDeep} 100%)`, color: '#fff', borderRadius: 24, padding: '64px 64px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(47,128,237,0.30)' }}>
          <div aria-hidden style={{ position: 'absolute', top: -40, right: -40, opacity: 0.10, transform: 'rotate(12deg)' }}>
            <Monogram size={240} accent="#fff" accentInk={SKY.accent} radiusCard={32} />
          </div>
          <div aria-hidden style={{ position: 'absolute', bottom: -60, left: '40%', opacity: 0.06, transform: 'rotate(-8deg)' }}>
            <Monogram size={180} accent="#fff" accentInk={SKY.accent} radiusCard={24} />
          </div>

          <div style={{ position: 'relative', maxWidth: 640 }}>
            <LEyebrow ink="#fff">Bring your school online</LEyebrow>
            <h2 style={{ margin: 0, fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#fff', textWrap: 'balance' }}>
              Your first batch live<br />in seven days.
            </h2>
            <p style={{ margin: '20px 0 0', fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)', maxWidth: 520, fontWeight: 500 }}>
              30-day free trial, no credit card. A dedicated onboarding partner gets your tenant, batches and faculty rosters set up while you focus on teaching.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <CTAEmailForm />
              <LButton kind="secondaryDark" size="lg">Or talk to sales</LButton>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 24, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              {['No credit card', '30-day trial', 'Free onboarding'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><CheckGlyph />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </LContainer>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { h: 'Product', links: ['Features', 'Changelog', 'Roadmap', 'API docs'] },
    { h: 'For',     links: ['Schools', 'Faculty', 'Students', 'Parents', 'Coaching centers'] },
    { h: 'Company', links: ['About', 'Customers', 'Careers', 'Press', 'Contact'] },
    { h: 'Legal',   links: ['Terms', 'Privacy', 'Security', 'DPA', 'Status'] },
  ];
  return (
    <footer style={{ background: SKY.surfaceDeep, color: '#fff', padding: '72px 0 32px' }}>
      <LContainer>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Monogram size={32} />
              <Wordmark size={20} color="#fff" accentColor={SKY.accent} />
            </div>
            <p style={{ margin: '20px 0 0', fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', maxWidth: 320, fontWeight: 500 }}>
              The multi-tenant operating system for education. Bring your school online, run it like clockwork, never look at a spreadsheet again.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              {['X', 'in', 'YT', 'gh'].map((s) => (
                <a key={s} style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, textDecoration: 'none', cursor: 'pointer', letterSpacing: '-0.02em' }}>{s}</a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600 }}>{c.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.links.map((l) => (
                  <li key={l}><a style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecoration: 'none', cursor: 'pointer', letterSpacing: '-0.005em' }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, color: 'rgba(255,255,255,0.5)', flexWrap: 'wrap', gap: 12 }}>
          <span>© 2026 MySchedlr Inc. · Built for schools worldwide.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.20)' }} />
            All systems operational
          </span>
        </div>
      </LContainer>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ background: SKY.bg, fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif', fontFeatureSettings: '"ss01", "cv11"', minHeight: '100vh' }}>
      <TopNav />
      <Hero />
      <TrustBar />
      <RolesSection />
      <FeaturesSection />
      <MultiTenantSection />
      <BigCTA />
      <Footer />
    </div>
  );
}
