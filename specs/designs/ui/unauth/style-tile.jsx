// StyleTile — one-page brand tile for a theme: monogram + wordmark, swatches,
// type ladder, buttons + form sample, badges. Sized for an 1100x780 artboard.

function Swatch({ color, name, hex, ink = '#1a1714' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{
        height: 84,
        background: color,
        borderRadius: 'var(--rc)',
        boxShadow: 'inset 0 0 0 1px var(--line)',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, color: 'var(--ink)' }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em' }}>{name}</span>
        <span style={{
          fontSize: 10.5,
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>{hex}</span>
      </div>
    </div>
  );
}

function StyleTile({ theme }) {
  return (
    <ThemeFrame theme={theme} padding={48}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 32 }}>

        {/* Header: monogram + wordmark + tag */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Monogram size={56} theme={theme} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Wordmark size={36} theme={theme} />
              <span style={{
                fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
                fontSize: 11,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>multi-tenant edu OS</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
              fontSize: 10.5,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 4,
            }}>{theme.tag}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              {theme.name}
            </div>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: 0 }} />

        {/* Palette */}
        <div>
          <SectionLabel>Palette</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            <Swatch color={theme.bg} name="Background" hex={theme.bg} />
            <Swatch color={theme.surface} name="Surface" hex={theme.surface} />
            <Swatch color={theme.ink} name="Ink" hex={theme.ink} />
            <Swatch color={theme.muted} name="Muted" hex={theme.muted} />
            <Swatch color={theme.accent} name="Accent" hex={theme.accent} />
          </div>
        </div>

        {/* Two-column: Type + Components */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, flex: 1, minHeight: 0 }}>

          {/* Type ladder */}
          <div>
            <SectionLabel>Type · Manrope</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <TypeRow size={42} weight={700} ls="-0.03em" tag="Display / 42 · 700">
                Run school on rails.
              </TypeRow>
              <TypeRow size={26} weight={600} ls="-0.02em" tag="H1 / 26 · 600">
                Today's classes
              </TypeRow>
              <TypeRow size={16} weight={500} ls="-0.005em" tag="Body / 16 · 500" muted>
                Drop in students, batches, and faculty — siloed by tenant, zero cross-org leak.
              </TypeRow>
              <TypeRow size={11} weight={600} ls="0.12em" tag="Eyebrow / 11 · 600 mono" mono uppercase>
                Tenant · acme-school
              </TypeRow>
            </div>
          </div>

          {/* Components */}
          <div>
            <SectionLabel>Components</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Buttons row */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button kind="primary">Start free trial</Button>
                <Button kind="secondary">View schedule</Button>
                <Button kind="ghost">Cancel</Button>
              </div>

              {/* Input */}
              <Input placeholder="acme-school.myschedlr.app" label="Tenant subdomain" />

              {/* Badges + pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Pill tone="accent">Live now</Pill>
                <Pill tone="ink">Batch · 2026-A</Pill>
                <Pill tone="muted">12 students</Pill>
              </div>

              {/* Mini-card */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--rc)',
                padding: 14,
                boxShadow: 'var(--shadow)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 'var(--rc)',
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15,
                }}>P3</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Physics · Mechanics</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Mr. Rao · 11:30 → 12:30</div>
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 11,
                  color: 'var(--muted)', letterSpacing: '0.04em',
                }}>R-214</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </ThemeFrame>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
      fontSize: 10.5,
      fontWeight: 600,
      color: 'var(--muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      marginBottom: 14,
    }}>{children}</div>
  );
}

function TypeRow({ children, size, weight, ls, tag, muted = false, mono = false, uppercase = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <div style={{
        fontSize: size,
        fontWeight: weight,
        letterSpacing: ls,
        color: muted ? 'var(--ink-soft)' : 'var(--ink)',
        lineHeight: 1.15,
        flex: 1,
        minWidth: 0,
        fontFamily: mono ? 'ui-monospace, "JetBrains Mono", monospace' : 'inherit',
        textTransform: uppercase ? 'uppercase' : 'none',
      }}>
        {children}
      </div>
      <div style={{
        fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
        fontSize: 10,
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>{tag}</div>
    </div>
  );
}

function Button({ children, kind = 'primary', size = 'md' }) {
  const base = {
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: size === 'sm' ? 13 : 14,
    letterSpacing: '-0.005em',
    padding: size === 'sm' ? '7px 12px' : '10px 16px',
    borderRadius: 'var(--rb)',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    lineHeight: 1,
    transition: 'transform .08s',
  };
  if (kind === 'primary') return <button style={{ ...base, background: 'var(--accent)', color: 'var(--accent-ink)', boxShadow: 'var(--shadow)' }}>{children}</button>;
  if (kind === 'secondary') return <button style={{ ...base, background: 'var(--surface)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--line)' }}>{children}</button>;
  return <button style={{ ...base, background: 'transparent', color: 'var(--ink-soft)' }}>{children}</button>;
}

function Input({ label, placeholder, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
        fontSize: 10.5,
        fontWeight: 600,
        color: 'var(--muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
      }}>{label}</label>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--rb)',
        padding: '10px 12px',
        fontSize: 14,
        color: value ? 'var(--ink)' : 'var(--muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <span>{value || placeholder}</span>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11,
          color: 'var(--muted)', letterSpacing: '0.04em',
        }}>↵</span>
      </div>
    </div>
  );
}

function Pill({ children, tone = 'accent' }) {
  const tones = {
    accent: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    ink: { bg: 'var(--surface-alt)', fg: 'var(--ink)' },
    muted: { bg: 'transparent', fg: 'var(--muted)', border: '1px solid var(--line)' },
  }[tone];
  return (
    <span style={{
      background: tones.bg,
      color: tones.fg,
      border: tones.border || 'none',
      fontSize: 12,
      fontWeight: 600,
      padding: '5px 10px',
      borderRadius: 999,
      letterSpacing: '-0.005em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    }}>
      {tone === 'accent' && <span style={{
        width: 6, height: 6, borderRadius: 3, background: 'var(--accent)',
      }} />}
      {children}
    </span>
  );
}

window.StyleTile = StyleTile;
window.Button = Button;
window.Pill = Pill;
window.Input = Input;
window.SectionLabel = SectionLabel;
