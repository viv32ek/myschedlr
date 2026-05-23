// landing-shared.jsx
// Sky / Friendly theme tokens locked in + shared landing primitives.
// Lives separately from the canvas style-tile primitives so the landing has
// its own LButton/LPill scale (bigger, more confident).

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
window.SKY = SKY;

// LContainer — 1200 max-width with consistent horizontal padding.
function LContainer({ children, style }) {
  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '0 48px',
      boxSizing: 'border-box', ...style,
    }}>{children}</div>
  );
}

// LSection — vertical-rhythm wrapper with optional eyebrow/title/subtitle.
function LSection({ id, children, bg, ink, eyebrow, title, subtitle, align = 'left', dense = false, style }) {
  return (
    <section id={id} style={{
      background: bg || 'transparent',
      color: ink || 'inherit',
      padding: dense ? '72px 0' : '120px 0',
      ...style,
    }}>
      <LContainer>
        {(eyebrow || title || subtitle) && (
          <div style={{
            marginBottom: 56,
            textAlign: align,
            maxWidth: align === 'center' ? 680 : 'none',
            marginLeft: align === 'center' ? 'auto' : 0,
            marginRight: align === 'center' ? 'auto' : 0,
          }}>
            {eyebrow && <LEyebrow>{eyebrow}</LEyebrow>}
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

function LEyebrow({ children, tone = 'accent' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px',
      background: tone === 'accent' ? SKY.accentSoft : 'rgba(255,255,255,0.08)',
      color: tone === 'accent' ? SKY.accent : 'rgba(255,255,255,0.85)',
      borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      letterSpacing: '-0.005em',
      marginBottom: 20,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 3,
        background: tone === 'accent' ? SKY.accent : '#fff',
      }} />
      {children}
    </div>
  );
}

// LButton — primary / secondary / ghost / link, three sizes.
function LButton({ children, kind = 'primary', size = 'md', onClick, href, style }) {
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
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizes.gap,
    lineHeight: 1,
    textDecoration: 'none',
    transition: 'transform .08s, background .12s, box-shadow .12s',
    ...style,
  };
  const kinds = {
    primary: { background: SKY.accent, color: '#fff', boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 4px 16px rgba(47,128,237,0.28)' },
    primaryDark: { background: SKY.ink, color: '#fff' },
    secondary: { background: SKY.surface, color: SKY.ink, boxShadow: `inset 0 0 0 1px ${SKY.lineStrong}` },
    secondaryDark: { background: 'rgba(255,255,255,0.08)', color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' },
    ghost: { background: 'transparent', color: SKY.inkSoft },
    ghostDark: { background: 'transparent', color: 'rgba(255,255,255,0.85)' },
  }[kind];
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} style={{ ...base, ...kinds }}>
      {children}
    </Tag>
  );
}

// LPill — same vocabulary as the canvas pills but slightly larger.
function LPill({ children, tone = 'accent', dot = true }) {
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
      {dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: tones.dotC }} />}
      {children}
    </span>
  );
}

// LCardLabel — uppercase mono label used above section titles & card heads.
function LCardLabel({ children, color }) {
  return (
    <div style={{
      fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
      fontSize: 10.5, fontWeight: 600,
      color: color || SKY.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
    }}>{children}</div>
  );
}

// Smooth-scroll a section into view without using scrollIntoView (which can
// fight the canvas / iframe). Offsets for the sticky nav.
function scrollToId(id, offset = 72) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

Object.assign(window, { LContainer, LSection, LEyebrow, LButton, LPill, LCardLabel, scrollToId });
