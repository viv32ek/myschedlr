// auth-screens.jsx
// The four auth screens. Each is a pure render function of (state, setState,
// navigate). The parent state machine lives in auth-app.jsx.

// ─── Screen header (title + subtitle, used by all four) ─────────────────────
function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && (
        <div style={{
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          fontSize: 10.5, fontWeight: 600,
          color: SKY.accent,
          textTransform: 'uppercase', letterSpacing: '0.14em',
          marginBottom: 10,
        }}>{eyebrow}</div>
      )}
      <h1 style={{
        margin: 0,
        fontSize: 32, fontWeight: 700,
        letterSpacing: '-0.028em', lineHeight: 1.1,
        color: SKY.ink, textWrap: 'balance',
      }}>{title}</h1>
      {subtitle && (
        <p style={{
          margin: '12px 0 0', fontSize: 15, lineHeight: 1.5,
          color: SKY.inkSoft, fontWeight: 500, textWrap: 'pretty',
        }}>{subtitle}</p>
      )}
    </div>
  );
}

// ─── Sign In ──────────────────────────────────────────────────────────────
function SignInScreen({ go }) {
  const [tenant, setTenant] = React.useState('northwind');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); go('verify'); }, 700);
  };

  return (
    <form onSubmit={submit}>
      <ScreenHeader
        eyebrow="Sign in"
        title="Welcome back."
        subtitle="Sign in to your tenant to pick up where you left off."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TenantSelect
          value={tenant}
          onChange={setTenant}
          label="School"
          help="Pick your school. Ask your admin if you're not sure."
        />
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@school.edu"
          autoFocus
        />
        <PasswordField
          label="Password"
          value={pw}
          onChange={setPw}
          placeholder="••••••••"
          action={<TextLink onClick={() => go('forgot')}>Forgot password?</TextLink>}
        />
        <Checkbox checked={remember} onChange={setRemember} label="Keep me signed in on this device" />
      </div>

      <div style={{ marginTop: 24 }}>
        <AuthButton type="submit" loading={loading}>
          Sign in
          {!loading && <ArrowRight />}
        </AuthButton>
      </div>

      <div style={{
        marginTop: 28, fontSize: 14, color: SKY.inkSoft, textAlign: 'center', fontWeight: 500,
      }}>
        New to MySchedlr?{' '}
        <TextLink onClick={() => go('signUp')}>Create an account →</TextLink>
      </div>
    </form>
  );
}

// ─── Sign Up ──────────────────────────────────────────────────────────────
function SignUpScreen({ go }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [tenant, setTenant] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); go('verify'); }, 700);
  };

  return (
    <form onSubmit={submit}>
      <ScreenHeader
        eyebrow="Get started"
        title="Create your account."
        subtitle="Join your school's MySchedlr tenant. Your role and batch are assigned by your admin."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TenantSelect
          value={tenant}
          onChange={setTenant}
          label="School"
          autoFocus
        />
        <FormField label="Full name" value={name} onChange={setName} placeholder="Anika Kapoor" />
        <FormField label="Email with school" type="email" value={email} onChange={setEmail} placeholder="you@school.edu" />
        <PasswordField
          label="Password"
          value={pw}
          onChange={setPw}
          placeholder="Min 10 chars · upper, lower, number"
          help={<PasswordStrength value={pw} />}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <AuthButton type="submit" loading={loading}>
          Create account
          {!loading && <ArrowRight />}
        </AuthButton>
      </div>

      <div style={{
        marginTop: 24, fontSize: 14, color: SKY.inkSoft, textAlign: 'center', fontWeight: 500,
      }}>
        Already have an account?{' '}
        <TextLink onClick={() => go('signIn')}>Sign in →</TextLink>
      </div>
    </form>
  );
}

// ─── Forgot Password ──────────────────────────────────────────────────────
function ForgotPasswordScreen({ go }) {
  const [email, setEmail] = React.useState('');
  const [tenant, setTenant] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 700);
  };

  if (sent) {
    return (
      <div>
        <SuccessGlyph />
        <ScreenHeader
          title="Check your inbox."
          subtitle={<>We sent a reset link to <strong style={{ color: SKY.ink }}>{email || 'your email'}</strong>. It expires in 30 minutes.</>}
        />
        <div style={{
          padding: 16, background: SKY.bg, border: `1px solid ${SKY.line}`,
          borderRadius: SKY.radiusCard, fontSize: 13.5, color: SKY.inkSoft,
          lineHeight: 1.5, fontWeight: 500,
        }}>
          <strong style={{ color: SKY.ink, display: 'block', marginBottom: 4 }}>Didn't get it?</strong>
          Check spam, or wait 60s and{' '}
          <TextLink onClick={() => setSent(false)}>send another</TextLink>.
          The link goes only to addresses registered under{' '}
          <code style={{ fontFamily: 'ui-monospace, monospace', color: SKY.ink, background: SKY.surfaceAlt, padding: '1px 6px', borderRadius: 4 }}>{tenant || 'your tenant'}.myschedlr.app</code>.
        </div>
        <div style={{ marginTop: 24 }}>
          <AuthButton kind="secondary" onClick={() => go('signIn')}>Back to sign in</AuthButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <ScreenHeader
        eyebrow="Reset password"
        title="Forgot password?"
        subtitle="No drama. Tell us your tenant and email, we'll send a reset link straight to your inbox."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TenantSelect
          value={tenant}
          onChange={setTenant}
          label="School"
        />
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@school.edu"
          autoFocus
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <AuthButton type="submit" loading={loading}>
          Send reset link
          {!loading && <ArrowRight />}
        </AuthButton>
      </div>

      <div style={{
        marginTop: 24, fontSize: 14, color: SKY.inkSoft, textAlign: 'center', fontWeight: 500,
      }}>
        Remembered it?{' '}
        <TextLink onClick={() => go('signIn')}>Back to sign in</TextLink>
      </div>
    </form>
  );
}

// ─── Verify Account ───────────────────────────────────────────────────────
// Email-only verification. On reaching this screen the system has already
// sent a 6-digit code to the user's registered email.

function VerifyAccountScreen({ go }) {
  const [code, setCode] = React.useState('');
  // Cooldown reflects that the code was sent automatically on screen open.
  const [resendIn, setResendIn] = React.useState(45);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const submit = (e) => {
    e?.preventDefault();
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); go('done'); }, 700);
  };

  const resend = () => {
    if (resendIn > 0) return;
    setResendIn(45);
  };

  return (
    <form onSubmit={submit}>
      <ScreenHeader
        eyebrow="One more step"
        title="Check your email."
        subtitle={<>We sent a 6-digit code to <strong style={{ color: SKY.ink }}>a••••@school.edu</strong>. Enter it below to finish signing in.</>}
      />

      <CodePane code={code} setCode={setCode} onResend={resend} resendIn={resendIn} />

      <div style={{ marginTop: 22 }}>
        <AuthButton type="submit" loading={loading} disabled={code.length < 6}>
          Verify & continue
          {!loading && <ArrowRight />}
        </AuthButton>
      </div>

      <div style={{
        marginTop: 22, fontSize: 14, color: SKY.inkSoft, textAlign: 'center', fontWeight: 500,
      }}>
        <TextLink color={SKY.inkSoft} onClick={() => go('signIn')}>← Back to sign in</TextLink>
      </div>
    </form>
  );
}

function MethodRow({ method, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '12px 14px', textAlign: 'left',
        background: active ? SKY.accentSoft : SKY.surface,
        border: `1.5px solid ${active ? SKY.accent : SKY.lineStrong}`,
        borderRadius: 10,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background .12s, border-color .12s',
      }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9,
        border: `2px solid ${active ? SKY.accent : SKY.muted}`,
        background: active ? SKY.accent : 'transparent',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .12s',
      }}>
        {active && <span style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: SKY.ink, letterSpacing: '-0.005em' }}>{method.label}</div>
        <div style={{ fontSize: 12.5, color: SKY.muted, marginTop: 2, fontFamily: method.id === 'email' || method.id === 'sms' ? 'ui-monospace, monospace' : 'inherit' }}>{method.desc}</div>
      </div>
      <MethodGlyph id={method.id} active={active} />
    </button>
  );
}

function MethodGlyph({ id, active }) {
  const color = active ? SKY.accent : SKY.muted;
  const props = { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (id === 'email') return <svg {...props}><rect x="3" y="5" width="14" height="11" rx="2" /><path d="M3 6l7 5 7-5" /></svg>;
  if (id === 'sms') return <svg {...props}><rect x="5" y="2" width="10" height="16" rx="2" /><path d="M5 14h10M9 17h2" /></svg>;
  if (id === 'totp') return <svg {...props}><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /></svg>;
  if (id === 'magic') return <svg {...props}><path d="M14 3l3 3M11 6l5-3 1 1-3 5M3 17l8-8" /><circle cx="10" cy="14" r="2" /></svg>;
  return null;
}

function CodePane({ code, setCode, onResend, resendIn }) {
  return (
    <div style={{
      padding: 20,
      background: SKY.bg,
      border: `1px solid ${SKY.line}`,
      borderRadius: SKY.radiusCard,
    }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: SKY.ink, marginBottom: 14,
        letterSpacing: '-0.005em',
      }}>
        Enter the 6-digit code from your inbox
      </div>
      <OTPInput value={code} onChange={setCode} autoFocus />
      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12.5,
      }}>
        <span style={{ color: SKY.muted, fontWeight: 500 }}>Didn't receive a code?</span>
        {resendIn > 0
          ? <span style={{ color: SKY.muted, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>Resend in {resendIn}s</span>
          : <TextLink onClick={onResend}>Resend</TextLink>}
      </div>
    </div>
  );
}

function MagicLinkPane({ sent, resendIn }) {
  return (
    <div style={{
      padding: 20,
      background: sent ? SKY.accentSoft : SKY.bg,
      border: `1px solid ${sent ? SKY.accent : SKY.line}`,
      borderRadius: SKY.radiusCard,
      display: 'flex', alignItems: 'flex-start', gap: 14,
      transition: 'background .15s, border-color .15s',
    }}>
      <div style={{
        flexShrink: 0,
        width: 36, height: 36, borderRadius: 18,
        background: sent ? SKY.accent : SKY.surface,
        color: sent ? '#fff' : SKY.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: sent ? 'none' : `inset 0 0 0 1px ${SKY.line}`,
      }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sent
            ? <path d="M5 10l3 3 7-7" />
            : <><path d="M14 3l3 3M11 6l5-3 1 1-3 5M3 17l8-8" /><circle cx="10" cy="14" r="2" /></>}
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.005em' }}>
          {sent ? 'Magic link on the way.' : 'A one-tap link to your inbox'}
        </div>
        <div style={{ fontSize: 13, color: SKY.inkSoft, marginTop: 4, lineHeight: 1.45, fontWeight: 500 }}>
          {sent
            ? <>Open your email and tap the link to finish signing in. The link expires in 10 minutes.{resendIn > 0 ? ` You can resend in ${resendIn}s.` : ''}</>
            : 'Skip the code — we\'ll email you a one-time link that signs you in with a single click.'}
        </div>
      </div>
    </div>
  );
}

// ─── "Done" state — minimal success view ──────────────────────────────────
function DoneScreen({ go }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <SuccessGlyph />
      <ScreenHeader
        title="You're in."
        subtitle="Heading to your dashboard. (This is a design prototype — the real product handoff lives behind that link.)"
      />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <AuthButton kind="primary" onClick={() => (window.location.href = 'MySchedlr Landing.html')}>
          Go to dashboard <ArrowRight />
        </AuthButton>
        <AuthButton kind="secondary" onClick={() => go('signIn')}>Sign out</AuthButton>
      </div>
    </div>
  );
}

// ─── Atomic helpers ───────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" />
    </svg>
  );
}

function SuccessGlyph() {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 28,
      background: SKY.accentSoft, color: SKY.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 20,
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 14l4 4 10-10" />
      </svg>
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <span
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 18, height: 18, borderRadius: 5,
          background: checked ? SKY.accent : SKY.surface,
          border: `1.5px solid ${checked ? SKY.accent : SKY.lineStrong}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transition: 'background .12s, border-color .12s',
        }}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5.5l2.4 2.4L9 3" />
          </svg>
        )}
      </span>
      <span style={{ fontSize: 13.5, color: SKY.inkSoft, fontWeight: 500 }}>{label}</span>
    </label>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{
      display: 'flex', padding: 4, gap: 4,
      background: SKY.bg, border: `1px solid ${SKY.line}`,
      borderRadius: 10,
    }}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              flex: 1, padding: '9px 12px',
              background: on ? SKY.surface : 'transparent',
              color: on ? SKY.ink : SKY.inkSoft,
              border: 'none',
              borderRadius: 7,
              boxShadow: on ? '0 1px 2px rgba(26,23,20,0.06)' : 'none',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              letterSpacing: '-0.005em', cursor: 'pointer',
              transition: 'background .12s, color .12s',
            }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function RoleCards({ value, onChange }) {
  const roles = [
    { id: 'student', label: 'Student', icon: '◐', desc: 'Enrolled in classes' },
    { id: 'faculty', label: 'Faculty', icon: '◆', desc: 'I teach or lead batches' },
    { id: 'admin',   label: 'Admin',   icon: '▢', desc: 'I run the school' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {roles.map((r) => {
        const on = value === r.id;
        return (
          <button key={r.id} type="button" onClick={() => onChange(r.id)}
            style={{
              padding: '14px 12px',
              background: on ? SKY.accentSoft : SKY.surface,
              border: `1.5px solid ${on ? SKY.accent : SKY.lineStrong}`,
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 6,
              transition: 'background .12s, border-color .12s',
            }}>
            <span style={{
              fontSize: 18, color: on ? SKY.accent : SKY.muted,
              transition: 'color .12s',
            }}>{r.icon}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.005em' }}>{r.label}</span>
            <span style={{ fontSize: 11.5, color: SKY.muted, fontWeight: 500, lineHeight: 1.3 }}>{r.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

function PasswordStrength({ value }) {
  const s = scorePassword(value);
  const levels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [SKY.muted, '#dc2626', '#f59e0b', '#10b981', '#059669'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: SKY.muted, fontWeight: 500 }}>
      <span style={{ display: 'inline-flex', gap: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{
            width: 22, height: 4, borderRadius: 2,
            background: i < s ? colors[s] : SKY.line,
            transition: 'background .15s',
          }} />
        ))}
      </span>
      <span style={{ color: value ? colors[s] : SKY.muted, fontWeight: 600 }}>{value ? levels[s] : 'Min 10 chars · upper, lower, number'}</span>
    </span>
  );
}

function scorePassword(p) {
  if (!p || p.length < 6) return 0;
  let s = 0;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}

Object.assign(window, {
  SignInScreen, SignUpScreen, ForgotPasswordScreen, VerifyAccountScreen, DoneScreen,
});
