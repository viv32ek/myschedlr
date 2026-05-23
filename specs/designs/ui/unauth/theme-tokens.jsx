// Theme token sets for the 4 MySchedlr direction explorations.
// Each theme is consumed as CSS vars on a ThemeFrame wrapper so any nested
// component can read them. Keep these flat — no nested objects — so the
// Tweaks panel can shallow-merge overrides cleanly.

const THEMES = {
  bright: {
    key: 'bright',
    name: 'Bright Optimist',
    tag: '01 / Default',
    blurb: 'Cream + signal orange. The friendly modern-edtech baseline.',
    bg: '#faf6ec',
    surface: '#ffffff',
    surfaceAlt: '#f3eedf',
    ink: '#1a1714',
    inkSoft: '#3d3833',
    muted: '#7a7066',
    accent: '#ff5a1f',
    accentSoft: '#ffe2d2',
    accentInk: '#ffffff',
    line: 'rgba(26,23,20,0.10)',
    radiusCard: 3,
    radiusButton: 11,
    shadow: '0 1px 2px rgba(26,23,20,0.06), 0 4px 16px rgba(26,23,20,0.04)',
  },
  editorial: {
    key: 'editorial',
    name: 'Editorial Calm',
    tag: '02 / Quiet',
    blurb: 'Muted terracotta, mono labels, generous whitespace. For decision-makers.',
    bg: '#f3efe6',
    surface: '#fbf8f0',
    surfaceAlt: '#ebe6d8',
    ink: '#1d1916',
    inkSoft: '#3f3a36',
    muted: '#6e6760',
    accent: '#c0492a',
    accentSoft: '#e8d4ca',
    accentInk: '#fbf8f0',
    line: 'rgba(29,25,22,0.10)',
    radiusCard: 0,
    radiusButton: 7,
    shadow: '0 0 0 1px rgba(29,25,22,0.06)',
  },
  dark: {
    key: 'dark',
    name: 'Dark Focus',
    tag: '03 / Night',
    blurb: 'Night-mode student. Inks reversed, orange still pops.',
    bg: '#0e110f',
    surface: '#181c19',
    surfaceAlt: '#22272324',
    ink: '#f2ece1',
    inkSoft: '#c9c2b7',
    muted: '#857f76',
    accent: '#ff7a48',
    accentSoft: 'rgba(255,122,72,0.16)',
    accentInk: '#0e110f',
    line: 'rgba(242,236,225,0.10)',
    radiusCard: 4,
    radiusButton: 12,
    shadow: '0 2px 8px rgba(0,0,0,0.32), 0 12px 32px rgba(0,0,0,0.24)',
  },
  soft: {
    key: 'soft',
    name: 'Soft Pop',
    tag: '04 / Playful',
    blurb: 'Peach surfaces, bolder shadows. Maxes the energetic end.',
    bg: '#ffe8d3',
    surface: '#fff8ee',
    surfaceAlt: '#ffd9b8',
    ink: '#221710',
    inkSoft: '#4a382a',
    muted: '#8a7560',
    accent: '#e74617',
    accentSoft: '#ffc09a',
    accentInk: '#fff8ee',
    line: 'rgba(34,23,16,0.12)',
    radiusCard: 6,
    radiusButton: 16,
    shadow: '0 2px 0 rgba(34,23,16,0.10), 0 10px 28px rgba(231,70,23,0.12)',
  },
};

// ThemeFrame — paints a theme's bg/ink/font and exposes every token as a CSS
// var so child components can `var(--accent)` without prop drilling.
function ThemeFrame({ theme, children, padding = 0, style }) {
  const vars = {
    '--bg': theme.bg,
    '--surface': theme.surface,
    '--surface-alt': theme.surfaceAlt,
    '--ink': theme.ink,
    '--ink-soft': theme.inkSoft,
    '--muted': theme.muted,
    '--accent': theme.accent,
    '--accent-soft': theme.accentSoft,
    '--accent-ink': theme.accentInk,
    '--line': theme.line,
    '--rc': theme.radiusCard + 'px',
    '--rb': theme.radiusButton + 'px',
    '--shadow': theme.shadow,
  };
  return (
    <div
      style={{
        ...vars,
        background: 'var(--bg)',
        color: 'var(--ink)',
        fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
        fontFeatureSettings: '"ss01", "cv11"',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Monogram — a filled square (slight radius) with a vertical bar offset
// inside, reading as a divided time block / schedule slot. Color/radius
// come from the active theme.
function Monogram({ size = 32, theme }) {
  const r = Math.min(size * 0.18, (theme?.radiusCard ?? 3) + 4);
  const accent = theme?.accent ?? 'var(--accent)';
  const ink = theme?.accentInk ?? 'var(--accent-ink)';
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="MySchedlr">
      <rect x="0" y="0" width="32" height="32" rx={r} fill={accent} />
      <rect x="11" y="7" width="3.4" height="18" rx="0.6" fill={ink} opacity="0.92" />
      <rect x="19" y="7" width="3.4" height="11" rx="0.6" fill={ink} opacity="0.92" />
    </svg>
  );
}

// Wordmark — "myschedlr." lowercase with the period in accent. Pairs with
// the monogram.
function Wordmark({ size = 22, theme, dotOnly = false }) {
  return (
    <span style={{
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-0.025em',
      color: theme?.ink ?? 'var(--ink)',
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'baseline',
    }}>
      {!dotOnly && 'myschedlr'}
      <span style={{ color: theme?.accent ?? 'var(--accent)' }}>.</span>
    </span>
  );
}

window.THEMES = THEMES;
window.ThemeFrame = ThemeFrame;
window.Monogram = Monogram;
window.Wordmark = Wordmark;
