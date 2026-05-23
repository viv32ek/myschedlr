// landing-bottom.jsx
// Features grid · Pricing · big CTA · Footer.

// ─── Features grid ─────────────────────────────────────────────────────────

const FEATURES = [
  { t: 'Smart scheduling',    d: 'Auto-suggests slots based on faculty, room and batch availability. Drag to override.' },
  { t: 'One-tap attendance',  d: 'Take attendance in seconds. Parents notified on absence by SMS or email.' },
  { t: 'Test management',     d: 'Build MCQ, subjective or hybrid tests. Auto-grade, rubric-grade or hand-grade.' },
  { t: 'Result analytics',    d: 'Per-student trends, per-batch ranks, per-subject heatmaps. Drill down to the question.' },
  { t: 'Parent reports',      d: 'Weekly digests delivered automatically. Tenant-configurable templates.' },
  { t: 'Integrations & SSO',  d: 'Google Calendar, Zoom, Meet, Microsoft 365. SAML SSO on Pro and Enterprise.' },
];

function FeaturesSection() {
  return (
    <LSection
      id="features"
      align="center"
      eyebrow="Features"
      title="Everything you need to run academic schedules."
      subtitle="From the first batch to the final report card — MySchedlr handles the workflow, not just the calendar."
    >
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
      }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} index={i} {...f} />
        ))}
      </div>
    </LSection>
  );
}

function FeatureCard({ index, t, d }) {
  return (
    <div style={{
      background: SKY.surface,
      border: `1px solid ${SKY.line}`,
      borderRadius: SKY.radiusCard,
      padding: 28,
      boxShadow: SKY.shadow,
      textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 14,
      minHeight: 220,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: SKY.accentSoft, color: SKY.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FeatureGlyph i={index} />
      </div>
      <h4 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.02em' }}>
        {t}
      </h4>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: SKY.inkSoft, fontWeight: 500 }}>{d}</p>
      <div style={{
        position: 'absolute', top: 24, right: 24,
        fontFamily: 'ui-monospace, monospace', fontSize: 11,
        color: SKY.muted, letterSpacing: '0.04em',
      }}>0{index + 1}</div>
    </div>
  );
}

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

// ─── Pricing ───────────────────────────────────────────────────────────────

const TIERS = [
  {
    name: 'Starter',
    price: '$99',
    cadence: '/mo · per tenant',
    blurb: 'For a single school just getting started.',
    bullets: [
      'Up to 200 students',
      'Up to 20 faculty',
      'Unlimited courses & batches',
      'Email support',
      'Standard integrations',
    ],
    cta: 'Start free 30 days',
    kind: 'secondary',
  },
  {
    name: 'Pro',
    price: '$299',
    cadence: '/mo · per tenant',
    blurb: 'For growing schools with multiple campuses or branches.',
    bullets: [
      'Up to 1,000 students',
      'Up to 100 faculty',
      'Custom roles & permissions',
      'SAML SSO',
      'Priority support · 4h SLA',
      'API access',
    ],
    cta: 'Start free 30 days',
    kind: 'primary',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'volume + multi-tenant ops',
    blurb: 'For chains, networks and govt programs running many tenants.',
    bullets: [
      'Unlimited students & faculty',
      'Multi-tenant admin console',
      'Dedicated CSM + onboarding',
      'Custom data residency',
      '99.99% uptime SLA',
      'Bespoke integrations',
    ],
    cta: 'Talk to sales',
    kind: 'secondary',
  },
];

function PricingSection() {
  return (
    <LSection
      id="pricing"
      bg={SKY.surface}
      align="center"
      eyebrow="Pricing"
      title="Simple per-tenant pricing."
      subtitle="Price scales with your school, not with us. No per-seat fees, no add-on traps."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
        {TIERS.map((tier, i) => (
          <TierCard key={i} tier={tier} />
        ))}
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: SKY.muted, margin: 0 }}>
          Need help choosing? <a onClick={() => scrollToId('cta')} style={{ color: SKY.accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>Book a 20-min walkthrough →</a>
        </p>
      </div>
    </LSection>
  );
}

function TierCard({ tier }) {
  const featured = tier.featured;
  return (
    <div style={{
      background: featured ? SKY.ink : SKY.bg,
      color: featured ? '#fff' : SKY.ink,
      border: `1px solid ${featured ? 'transparent' : SKY.line}`,
      borderRadius: SKY.radiusCard,
      padding: 32,
      display: 'flex', flexDirection: 'column', gap: 22,
      position: 'relative',
      boxShadow: featured ? '0 12px 40px rgba(26,23,20,0.18)' : 'none',
      transform: featured ? 'translateY(-12px)' : 'none',
    }}>
      {featured && (
        <span style={{
          position: 'absolute', top: 18, right: 22,
          background: SKY.accent, color: '#fff',
          fontSize: 11, fontWeight: 700,
          padding: '4px 10px', borderRadius: 999,
          letterSpacing: '-0.005em',
        }}>Most popular</span>
      )}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: featured ? 'rgba(255,255,255,0.7)' : SKY.muted, letterSpacing: '-0.005em' }}>{tier.name}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <span style={{
            fontSize: 44, fontWeight: 700,
            color: featured ? '#fff' : SKY.ink,
            letterSpacing: '-0.03em', lineHeight: 1,
          }}>{tier.price}</span>
          <span style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,0.6)' : SKY.muted, fontWeight: 500 }}>{tier.cadence}</span>
        </div>
        <p style={{
          margin: '14px 0 0',
          fontSize: 14, lineHeight: 1.5,
          color: featured ? 'rgba(255,255,255,0.7)' : SKY.inkSoft,
          fontWeight: 500,
        }}>{tier.blurb}</p>
      </div>

      <hr style={{ border: 0, borderTop: `1px solid ${featured ? 'rgba(255,255,255,0.15)' : SKY.line}`, margin: 0 }} />

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {tier.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: featured ? 'rgba(255,255,255,0.92)' : SKY.ink, lineHeight: 1.4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={featured ? SKY.accent : SKY.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}>
              <path d="M3 7l2.5 2.5L11 4" />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <LButton
        kind={featured ? 'primary' : 'secondary'}
        size="md"
        style={featured ? { background: SKY.accent } : {}}
      >{tier.cta}</LButton>
    </div>
  );
}

// ─── Big CTA ───────────────────────────────────────────────────────────────

function BigCTA() {
  return (
    <section id="cta" style={{ padding: '40px 0 96px' }}>
      <LContainer>
        <div style={{
          background: `linear-gradient(135deg, ${SKY.accent} 0%, ${SKY.accentDeep} 100%)`,
          color: '#fff',
          borderRadius: 24,
          padding: '64px 64px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(47,128,237,0.30)',
        }}>
          {/* Decorative monograms */}
          <div aria-hidden style={{
            position: 'absolute', top: -40, right: -40, opacity: 0.10,
            transform: 'rotate(12deg)',
          }}>
            <Monogram size={240} theme={{ ...SKY, accent: '#fff', accentInk: SKY.accent, radiusCard: 32 }} />
          </div>
          <div aria-hidden style={{
            position: 'absolute', bottom: -60, left: '40%', opacity: 0.06,
            transform: 'rotate(-8deg)',
          }}>
            <Monogram size={180} theme={{ ...SKY, accent: '#fff', accentInk: SKY.accent, radiusCard: 24 }} />
          </div>

          <div style={{ position: 'relative', maxWidth: 640 }}>
            <LEyebrow tone="deep">Bring your school online</LEyebrow>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: '#fff',
              textWrap: 'balance',
            }}>
              Your first batch live<br />in seven days.
            </h2>
            <p style={{
              margin: '20px 0 0',
              fontSize: 17, lineHeight: 1.55,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 520, fontWeight: 500,
            }}>
              30-day free trial, no credit card. A dedicated onboarding partner
              gets your tenant, batches and faculty rosters set up while you
              focus on teaching.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <CTAEmailForm />
              <LButton kind="secondaryDark" size="lg">
                Or talk to sales
              </LButton>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 24, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckGlyph /> No credit card
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckGlyph /> 30-day trial
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckGlyph /> Free onboarding
              </span>
            </div>
          </div>
        </div>
      </LContainer>
    </section>
  );
}

function CheckGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l2.5 2.5L11 4" />
    </svg>
  );
}

function CTAEmailForm() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
      style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: SKY.radiusButton,
        padding: 4,
        minWidth: 360,
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
      }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitted}
        placeholder={submitted ? 'You\'re in. We\'ll reach out within 24h.' : 'you@yourschool.edu'}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: '#fff', padding: '12px 14px', fontSize: 15,
          fontFamily: 'inherit', fontWeight: 500,
        }}
      />
      <button
        type="submit"
        disabled={submitted}
        style={{
          background: '#fff', color: SKY.accent,
          border: 'none', cursor: 'pointer',
          padding: '12px 20px',
          borderRadius: SKY.radiusButton - 4,
          fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
          letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap',
        }}>
        {submitted ? 'Sent ✓' : 'Get a demo →'}
      </button>
    </form>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { h: 'Product', links: ['Features', 'Changelog', 'Roadmap', 'API docs'] },
    { h: 'For',     links: ['Schools', 'Faculty', 'Students', 'Parents', 'Coaching centers'] },
    { h: 'Company', links: ['About', 'Customers', 'Careers', 'Press', 'Contact'] },
    { h: 'Legal',   links: ['Terms', 'Privacy', 'Security', 'DPA', 'Status'] },
  ];
  return (
    <footer style={{
      background: SKY.surfaceDeep,
      color: '#fff',
      padding: '72px 0 32px',
    }}>
      <LContainer>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Monogram size={32} theme={SKY} />
              <span style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 20,
                letterSpacing: '-0.025em', color: '#fff',
              }}>myschedlr<span style={{ color: SKY.accent }}>.</span></span>
            </div>
            <p style={{
              margin: '20px 0 0', fontSize: 14, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.6)', maxWidth: 320, fontWeight: 500,
            }}>
              The multi-tenant operating system for education. Bring your
              school online, run it like clockwork, never look at a spreadsheet
              again.
            </p>
            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              {['X', 'in', 'YT', 'gh'].map((s) => (
                <a key={s} style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 11, fontWeight: 700,
                  textDecoration: 'none', cursor: 'pointer',
                  letterSpacing: '-0.02em',
                }}>{s}</a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div style={{
                fontFamily: 'ui-monospace, monospace', fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                marginBottom: 16,
                fontWeight: 600,
              }}>{c.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.links.map((l) => (
                  <li key={l}>
                    <a style={{
                      color: 'rgba(255,255,255,0.8)', fontSize: 14,
                      textDecoration: 'none', cursor: 'pointer',
                      letterSpacing: '-0.005em',
                    }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 12.5, color: 'rgba(255,255,255,0.5)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span>© 2026 MySchedlr Inc. · Built for schools worldwide.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'ui-monospace, monospace' }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.20)' }} />
            All systems operational
          </span>
        </div>
      </LContainer>
    </footer>
  );
}

Object.assign(window, { FeaturesSection, PricingSection, BigCTA, Footer });
