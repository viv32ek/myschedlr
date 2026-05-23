// auth-shared.jsx
// Auth shell + form primitives. Split layout (brand left, form right) shared
// across SignIn / SignUp / ForgotPassword / VerifyAccount.

// ─── Shell ─────────────────────────────────────────────────────────────────

function AuthShell({ children, topRight }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '0.95fr 1.05fr',
      background: SKY.surface,
      fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
      color: SKY.ink,
    }}>
      <AuthBrandPanel />
      <AuthFormPanel topRight={topRight}>{children}</AuthFormPanel>
    </div>
  );
}

function AuthBrandPanel() {
  return (
    <aside style={{
      background: SKY.bg,
      padding: '48px 56px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      borderRight: `1px solid ${SKY.line}`,
    }}>
      {/* Soft halos */}
      <div aria-hidden style={{
        position: 'absolute', top: -160, left: -160, width: 560, height: 560,
        background: 'radial-gradient(closest-side, rgba(47,128,237,0.20), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -180, right: -100, width: 480, height: 480,
        background: 'radial-gradient(closest-side, rgba(47,128,237,0.10), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <a href="MySchedlr Landing.html" style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        textDecoration: 'none', position: 'relative', zIndex: 2,
        alignSelf: 'flex-start',
      }}>
        <Monogram size={32} theme={SKY} />
        <Wordmark size={20} theme={SKY} />
      </a>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', zIndex: 2, maxWidth: 460, gap: 36,
      }}>
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: SKY.accentSoft, color: SKY.accent,
            borderRadius: 999, fontSize: 12, fontWeight: 600,
            letterSpacing: '-0.005em',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: SKY.accent }} />
            Multi-tenant edu OS
          </span>
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(40px, 4.4vw, 56px)',
            fontWeight: 700,
            letterSpacing: '-0.035em', lineHeight: 1.02,
            color: SKY.ink, textWrap: 'balance',
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
          </h2>
          <p style={{
            margin: '20px 0 0',
            fontSize: 16, lineHeight: 1.55, color: SKY.inkSoft, fontWeight: 500,
            maxWidth: 420, textWrap: 'pretty',
          }}>
            Schedule courses, run batches, deliver classes, and track every
            student's results — in one app, per organization.
          </p>
        </div>

        <BrandPeek />
      </div>

      <div style={{
        position: 'relative', zIndex: 2, fontSize: 12, color: SKY.muted,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.20)' }} />
          84 schools · 12,000 classes / week
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}>
          © 2026 myschedlr
        </span>
      </div>
    </aside>
  );
}

// Small stylized "next class" peek for the brand panel.
function BrandPeek() {
  return (
    <div style={{
      background: SKY.surface,
      borderRadius: SKY.radiusCard,
      boxShadow: SKY.shadow,
      border: `1px solid ${SKY.line}`,
      padding: 18,
      maxWidth: 360,
      transform: 'rotate(-1deg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10.5,
          color: SKY.muted, letterSpacing: '0.14em', textTransform: 'uppercase',
          fontWeight: 600,
        }}>Up next · 11:30</span>
        <LPill tone="accent">in 6 min</LPill>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
        Mechanics — Friction
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 13,
          background: SKY.accentSoft, color: SKY.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 11,
        }}>SR</div>
        <span style={{ fontSize: 12.5, color: SKY.inkSoft, fontWeight: 500 }}>
          Sunita Rao · Room R-214
        </span>
      </div>
    </div>
  );
}

function AuthFormPanel({ children, topRight }) {
  return (
    <main style={{
      padding: '48px 56px',
      display: 'flex', flexDirection: 'column',
      background: SKY.surface,
      position: 'relative',
      minHeight: '100vh',
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 32 }}>
        {topRight}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {children}
        </div>
      </div>
      <div style={{
        textAlign: 'center', fontSize: 12, color: SKY.muted,
        paddingTop: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <div>
          Unable to sign in?{' '}
          <a
            href="mailto:support@myschedlr.app"
            style={{ color: SKY.accent, fontWeight: 600, textDecoration: 'none' }}>
            Contact support
          </a>
        </div>
        <div>
          By continuing you agree to our{' '}
          <a style={{ color: SKY.inkSoft, fontWeight: 500 }}>Terms</a> &amp;{' '}
          <a style={{ color: SKY.inkSoft, fontWeight: 500 }}>Privacy policy</a>.
        </div>
      </div>
    </main>
  );
}

// ─── Form primitives ──────────────────────────────────────────────────────

function FormField({
  label, type = 'text', value, onChange, placeholder,
  prefix, suffix, autoFocus, error, help, action,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const id = React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <label htmlFor={id} style={{
          fontSize: 13, fontWeight: 600, color: SKY.ink, letterSpacing: '-0.005em',
        }}>{label}</label>
        {action}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: SKY.surface,
        border: `1px solid ${error ? '#dc2626' : focused ? SKY.accent : SKY.lineStrong}`,
        borderRadius: 10,
        boxShadow: focused && !error
          ? `0 0 0 3px ${SKY.accentSoft}`
          : error ? '0 0 0 3px rgba(220,38,38,0.12)' : 'none',
        transition: 'box-shadow .12s, border-color .12s',
      }}>
        {prefix && (
          <span style={{
            paddingLeft: 14, color: SKY.muted, fontSize: 14,
            fontFamily: 'ui-monospace, monospace', letterSpacing: '0.02em',
            display: 'inline-flex', alignItems: 'center',
          }}>{prefix}</span>
        )}
        <input
          id={id}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, minWidth: 0,
            border: 'none', outline: 'none', background: 'transparent',
            padding: '12px 14px', fontSize: 15,
            fontFamily: 'inherit', color: SKY.ink,
            fontWeight: 500,
          }}
          {...rest}
        />
        {suffix && (
          <span style={{ paddingRight: 12, color: SKY.muted, display: 'inline-flex', alignItems: 'center' }}>
            {suffix}
          </span>
        )}
      </div>
      {(error || help) && (
        <span style={{
          fontSize: 12, color: error ? '#dc2626' : SKY.muted, marginTop: 2,
          fontWeight: 500,
        }}>{error || help}</span>
      )}
    </div>
  );
}

// PasswordField — adds show/hide toggle. Wraps FormField so look matches.
function PasswordField(props) {
  const [show, setShow] = React.useState(false);
  return (
    <FormField
      {...props}
      type={show ? 'text' : 'password'}
      suffix={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: SKY.muted, padding: '4px 6px',
            display: 'inline-flex', alignItems: 'center',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
          }}>
          {show ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
}

// ─── TenantSelect ─────────────────────────────────────────────────────────
// Searchable dropdown for picking a school tenant. Replaces the freeform
// subdomain input — students rarely type their tenant subdomain correctly,
// and the list doubles as social proof. Closes on outside-click / Escape.

const TENANTS = [
  { sub: 'northwind',  name: 'Northwind Academy',  city: 'Bengaluru',   count: 612,  recent: true  },
  { sub: 'harbor',     name: 'Harbor Tutorial',    city: 'Mumbai',      count: 184                 },
  { sub: 'kaveri',     name: 'Kaveri Institute',   city: 'Chennai',     count: 1042                },
  { sub: 'brightpath', name: 'Brightpath',         city: 'Pune',        count: 280                 },
  { sub: 'aurora',     name: 'Aurora Schools',     city: 'Hyderabad',   count: 720                 },
  { sub: 'meridian',   name: 'Meridian Coaching',  city: 'Delhi',       count: 450                 },
  { sub: 'sahyadri',   name: 'Sahyadri Schools',   city: 'Pune',        count: 920                 },
  { sub: 'kingscross', name: 'Kingscross Academy', city: 'Kolkata',     count: 340                 },
  { sub: 'lotus',      name: 'Lotus Public School',city: 'Jaipur',      count: 560                 },
];

function TenantSelect({ value, onChange, label = 'School', help, autoFocus }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const wrapRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const id = React.useId();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TENANTS;
    return TENANTS.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.sub.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = TENANTS.find((t) => t.sub === value);

  // Outside-click + Escape close. Focus search input when opened.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    setTimeout(() => searchRef.current?.focus(), 0);
    setActiveIdx(0);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (t) => { onChange?.(t.sub); setOpen(false); setQuery(''); };

  const onSearchKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIdx]) pick(filtered[activeIdx]); }
  };

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      <label htmlFor={id} style={{
        fontSize: 13, fontWeight: 600, color: SKY.ink, letterSpacing: '-0.005em',
      }}>{label}</label>
      <button
        id={id}
        type="button"
        autoFocus={autoFocus}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: SKY.surface,
          border: `1px solid ${open ? SKY.accent : SKY.lineStrong}`,
          borderRadius: 10,
          padding: '10px 14px',
          fontFamily: 'inherit', cursor: 'pointer',
          textAlign: 'left',
          boxShadow: open ? `0 0 0 3px ${SKY.accentSoft}` : 'none',
          transition: 'box-shadow .12s, border-color .12s',
        }}>
        {selected ? (
          <>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: SKY.accentSoft, color: SKY.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}>{selected.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: SKY.ink, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selected.name}
              </div>
              <div style={{ fontSize: 12, color: SKY.muted, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
                {selected.sub}.myschedlr.app
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, color: SKY.muted, fontSize: 14, fontWeight: 500, padding: '4px 0' }}>
            Select your school
          </div>
        )}
        <ChevronGlyph open={open} />
      </button>

      {open && (
        <div role="listbox" style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
          background: SKY.surface,
          border: `1px solid ${SKY.lineStrong}`,
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(26,23,20,0.14), 0 2px 6px rgba(26,23,20,0.06)',
          zIndex: 50,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            borderBottom: `1px solid ${SKY.line}`,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={SKY.muted} strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6" cy="6" r="4" />
              <path d="M9.5 9.5L12 12" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
              onKeyDown={onSearchKey}
              placeholder="Search by name, subdomain or city…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 14, fontFamily: 'inherit', color: SKY.ink,
                fontWeight: 500,
              }}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: SKY.muted, padding: 0, fontSize: 14,
              }}>×</button>
            )}
          </div>
          <div style={{ maxHeight: 280, overflow: 'auto', padding: '4px 0' }}>
            {filtered.length === 0 && (
              <div style={{
                padding: '20px 16px', textAlign: 'center',
                fontSize: 13, color: SKY.muted, fontWeight: 500,
              }}>
                No matching schools. Ask your admin for the right subdomain.
              </div>
            )}
            {filtered.map((t, i) => {
              const active = i === activeIdx;
              const isSelected = t.sub === value;
              return (
                <button
                  key={t.sub}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => pick(t)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '10px 12px',
                    background: active ? SKY.bg : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background .08s',
                  }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: SKY.accentSoft, color: SKY.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 11, flexShrink: 0,
                  }}>{t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: SKY.ink, letterSpacing: '-0.005em' }}>{t.name}</span>
                      {t.recent && <span style={{
                        fontSize: 10, fontWeight: 600, color: SKY.accent,
                        background: SKY.accentSoft, padding: '2px 6px', borderRadius: 999,
                        letterSpacing: '-0.005em',
                      }}>Recent</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: SKY.muted, marginTop: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'ui-monospace, monospace' }}>{t.sub}.myschedlr.app</span>
                      <span>·</span>
                      <span>{t.city}</span>
                      <span>·</span>
                      <span>{t.count.toLocaleString()} students</span>
                    </div>
                  </div>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={SKY.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7l2.5 2.5L11 4" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{
            padding: '10px 14px',
            borderTop: `1px solid ${SKY.line}`,
            background: SKY.bg,
            fontSize: 12, color: SKY.muted, fontWeight: 500,
          }}>
            Don't see your school? Ask your admin for the right subdomain.
          </div>
        </div>
      )}
      {help && <span style={{ fontSize: 12, color: SKY.muted, marginTop: 2, fontWeight: 500 }}>{help}</span>}
    </div>
  );
}

function ChevronGlyph({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={SKY.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M3 5.5l4 4 4-4" />
    </svg>
  );
}

// SSOButton — tile button for Google / Microsoft / SAML.
function SSOButton({ provider, onClick }) {
  const meta = {
    google: { label: 'Google', glyph: <GoogleGlyph /> },
    microsoft: { label: 'Microsoft', glyph: <MicrosoftGlyph /> },
    saml: { label: 'SAML SSO', glyph: <SAMLGlyph /> },
  }[provider];
  return (
    <button type="button" onClick={onClick} style={{
      flex: 1, minWidth: 0,
      background: SKY.surface,
      border: `1px solid ${SKY.lineStrong}`,
      borderRadius: 10,
      padding: '10px 12px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
      color: SKY.ink, cursor: 'pointer',
      letterSpacing: '-0.005em',
      transition: 'background .12s, border-color .12s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = SKY.bg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = SKY.surface; }}>
      {meta.glyph}
      {meta.label}
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.32z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}

function MicrosoftGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect width="7" height="7" fill="#F25022" />
      <rect x="9" width="7" height="7" fill="#7FBA00" />
      <rect y="9" width="7" height="7" fill="#00A4EF" />
      <rect x="9" y="9" width="7" height="7" fill="#FFB900" />
    </svg>
  );
}

function SAMLGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="#2f80ed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 2l6 3v4c0 4-3 6.5-6 7.5C6 15.5 3 13 3 9V5z" />
      <path d="M6.5 9l2 2 3-4" />
    </svg>
  );
}

// OTPInput — 6-box code input. Auto-advances on type, supports paste.
function OTPInput({ value, onChange, length = 6, autoFocus }) {
  const inputsRef = React.useRef([]);
  const chars = value.padEnd(length, ' ').slice(0, length).split('');

  const setAt = (i, ch) => {
    const next = (value + '').padEnd(length, ' ').split('');
    next[i] = ch;
    onChange(next.join('').trimEnd());
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) setAt(i, '');
      else if (i > 0) {
        setAt(i - 1, '');
        inputsRef.current[i - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const onPaste = (i, e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    const focusIdx = Math.min(text.length, length - 1);
    setTimeout(() => inputsRef.current[focusIdx]?.focus(), 0);
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={c.trim()}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, '').slice(-1);
            if (ch) {
              setAt(i, ch);
              if (i < length - 1) inputsRef.current[i + 1]?.focus();
            }
          }}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={(e) => onPaste(i, e)}
          style={{
            flex: 1, height: 56, minWidth: 0,
            textAlign: 'center', fontSize: 22, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
            color: SKY.ink,
            background: SKY.surface,
            border: `1.5px solid ${c.trim() ? SKY.accent : SKY.lineStrong}`,
            borderRadius: 10,
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color .12s, box-shadow .12s',
          }}
          onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${SKY.accentSoft}`; e.target.style.borderColor = SKY.accent; }}
          onBlur={(e) => { e.target.style.boxShadow = 'none'; if (!c.trim()) e.target.style.borderColor = SKY.lineStrong; }}
        />
      ))}
    </div>
  );
}

// Divider with "or" centered.
function OrDivider({ children = 'or' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      color: SKY.muted, fontSize: 12, fontWeight: 500,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      fontFamily: 'ui-monospace, monospace',
    }}>
      <span style={{ flex: 1, height: 1, background: SKY.line }} />
      {children}
      <span style={{ flex: 1, height: 1, background: SKY.line }} />
    </div>
  );
}

// Tall fill-width primary button — auth flows lean on a single confident CTA.
function AuthButton({ children, onClick, type = 'button', loading, kind = 'primary', disabled, leadingIcon }) {
  const base = {
    width: '100%',
    padding: '14px 20px',
    borderRadius: SKY.radiusButton,
    border: 'none',
    fontFamily: 'inherit',
    fontSize: 15, fontWeight: 700,
    letterSpacing: '-0.005em',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    opacity: disabled ? 0.55 : 1,
    transition: 'transform .08s, background .12s',
  };
  const kinds = {
    primary: { background: SKY.accent, color: '#fff', boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 18px rgba(47,128,237,0.30)' },
    secondary: { background: SKY.surface, color: SKY.ink, boxShadow: `inset 0 0 0 1px ${SKY.lineStrong}` },
    ghost: { background: 'transparent', color: SKY.inkSoft },
  }[kind];
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={{ ...base, ...kinds }}>
      {loading && (
        <span style={{
          display: 'inline-block', width: 14, height: 14,
          border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
          borderRadius: 7, animation: 'spin .8s linear infinite',
        }} />
      )}
      {!loading && leadingIcon}
      {children}
    </button>
  );
}

// Small text link.
function TextLink({ children, onClick, color }) {
  return (
    <a onClick={(e) => { e.preventDefault(); onClick?.(); }}
       style={{
         color: color || SKY.accent,
         fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
         textDecoration: 'none', letterSpacing: '-0.005em',
       }}>{children}</a>
  );
}

// Animation keyframes used by AuthButton spinner.
if (!document.getElementById('auth-anim')) {
  const s = document.createElement('style');
  s.id = 'auth-anim';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

Object.assign(window, {
  AuthShell, FormField, PasswordField, SSOButton, OTPInput,
  OrDivider, AuthButton, TextLink, TenantSelect,
});
